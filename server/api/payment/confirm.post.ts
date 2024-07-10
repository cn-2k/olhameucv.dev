import { Resend } from "resend";
import { openai } from "~/libs/openai/openai";
import { NewPrompt } from "~/libs/openai/promptbuilder";
import { useCompiler } from "#vue-email";

const resend = new Resend(process.env.RESEND_KEY);

export default defineEventHandler(async (event) => {
  const { processId, correlationId } = await readBody(event);

  const client = useTurso();

  // Atualiza o estado do pagamento no banco de dados
  await client.execute({
    sql: "UPDATE usuarios SET is_paid = ?, correlation_id = ? WHERE process_id = ?",
    args: [true, correlationId, processId],
  });

  // Recupera o texto extraído do banco de dados
  const { rows } = await client.execute({
    sql: "SELECT resume FROM usuarios WHERE process_id = ?",
    args: [processId],
  });

  const resume = rows[0].resume as any;

  // Dividir o currículo em seções
  const sections = {
    summary: getSection(resume, "Resumo"),
    experience: getSection(resume, "Experiência"),
    education: getSection(resume, "Formação acadêmica"),
    skills: getSection(resume, "Principais Competências"),
    certifications: getSection(resume, "Certifications"),
  };

  const prompt = NewPrompt();

  prompt.withPersona(`
    Persona do Recrutador: Especialista Experiente em Recrutamento de Engenheiros e Desenvolvedores de Software.

    Objetivo: Avaliar a adequação de um candidato para cargos de engenheiro de software com base no resumo do seu currículo.

    Pontos-chave a serem considerados:

    Histórico profissional:
    - Foco em resultados e impacto: Priorizar as realizações do candidato e o impacto tangível que ele causou em cada função.
    - Considerar o tipo de empresa: Avaliar a relevância das empresas em que o candidato trabalhou, incluindo startups, grandes empresas de tecnologia e agências.
    - Avaliar expertise em tecnologia: Identificar as tecnologias mencionadas e avaliar o nível de proficiência do candidato e os anos de experiência com cada uma.
    Educação e certificações:
    - Dar menos peso à educação: Embora a educação possa fornecer contexto, geralmente é menos significativa para funções de engenheiro de software.
    - Não confiar apenas em credenciais: Não baseie decisões apenas em diplomas, certificações ou cursos online.
    Presença online:
    - LinkedIn como fonte primária: Use o LinkedIn como a plataforma principal para entender o perfil profissional do candidato.
    - Considere GitHub, sites pessoais e blogs: Embora não sejam essenciais, essas plataformas podem fornecer informações adicionais.
    - Valorizar o envolvimento da comunidade: A participação positiva em comunidades online pode ser um indicador valioso.
    Detalhes do resumo do currículo:
    - Revisão completa do histórico de trabalho: Comece examinando cuidadosamente o histórico profissional do candidato.
    - Use descrições de experiência para perguntas direcionadas: Utilize as descrições de experiências passadas para formular perguntas de entrevista relevantes.
    - Não priorize o tempo gasto em cada empresa; concentre-se na qualidade de suas contribuições.
    Considerações adicionais:
    - Alinhamento de habilidades técnicas: Avaliar se as habilidades técnicas do candidato estão alinhadas com os requisitos específicos da posição em aberto.
    - Ajuste cultural: Avaliar o ajuste cultural do candidato com o ambiente de trabalho e os valores da empresa.
    - Habilidades de comunicação e interpessoais: Avaliar a capacidade do candidato de se comunicar de forma eficaz e colaborar com os outros.
  `);

  for (const [section, content] of Object.entries(sections)) {
    prompt.withContext(`
      ## ${section.charAt(0).toUpperCase() + section.slice(1)} Seção:
      ${content}
      - Avalie a seção de ${section} do currículo do candidato.
      - Separe o email do canditado e coloque na chave da response email
      - Forneça feedback específico sobre essa seção.
      - Sugira melhorias específicas para esta seção.
      - Retorne a resposta em português brasileiro.
      - Forneça o feedback e análise como se estivesse falando com o candidato mas com nível de formalidade moderado.
      - Não deixe explícito que a análise é baseada em cargo de "Engenheiro/Engenharia de Software" mas sim para desenvolvedor de software no geral.
      - Caso usar o nome da seção na resposta, traduza para o português brasileiro.
    `);
  }

  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const emailMatch = resume.match(emailRegex);

  prompt.withResponseType({
    email: emailMatch[0],
    summary: {
      feedback: "",
      suggestions: "",
    },
    profissionalExperiences: {
      feedback: "",
      suggestions: "",
    },
    education: {
      feedback: "",
      suggestions: "",
    },
    skills: {
      feedback: "",
      suggestions: "",
    },
    certifications: {
      feedback: "",
      suggestions: "",
    },
  });

  const messages = prompt.build();

  try {
    const response = await openai.createCompletions(messages);

    const template = await useCompiler("feedbackAnalyse.vue", {
      props: {
        feedbackResponse: response,
      },
    });

    const options = {
      from: "Acme <onboarding@resend.dev>",
      to: String(emailMatch[0]),
      subject: "Avaliação de currículo",
      html: template.html,
    };

    await resend.emails.send(options);
    return { response };
  } catch (error) {
    console.error("Error processing response or sending email:", error);
  }
});

// Função auxiliar para extrair seções do currículo
function getSection(resume: string, sectionTitle: string) {
  const sectionRegex = new RegExp(`${sectionTitle}:(.*?)(?=\\n[A-Z]|$)`, "s");
  const match = resume.match(sectionRegex);
  return match ? match[1].trim() : "";
}
