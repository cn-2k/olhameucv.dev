import { openai } from "~/libs/openai/openai"
import { NewPrompt } from "~/libs/openai/promptbuilder"

export default defineEventHandler(async (event) => {
  const { processId, correlationId } = await readBody(event)
  const client = useTurso()

  // Atualiza o estado do pagamento no banco de dados
  await client.execute({
    sql: "UPDATE usuarios SET is_paid = ?, correlation_id = ? WHERE process_id = ?",
    args: [
      true,
      correlationId,
      processId,
    ],
  })

  // Recupera o texto extraído do banco de dados
  const { rows } = await client.execute({
    sql: "SELECT resume FROM usuarios WHERE process_id = ?",
    args: [processId],
  })

  const resume = rows[0].resume as any
  const prompt = NewPrompt()

  prompt.withPersona(`
    The text you provided is already in English. Here's the translation to Portuguese in case that's what you meant:

    Persona do Recrutador: Especialista Experiente em Recrutamento de Engenheiros de Software

    Objetivo: Avaliar a adequação de um candidato para cargos de engenheiro de software com base no resumo do seu currículo.

    Pontos-chave a serem considerados:

    Histórico profissional:

    Foco em resultados e impacto: Priorizar as realizações do candidato e o impacto tangível que ele causou em cada função.
    Considerar o tipo de empresa: Avaliar a relevância das empresas em que o candidato trabalhou, incluindo startups, grandes empresas de tecnologia e agências.
    Avaliar expertise em tecnologia: Identificar as tecnologias mencionadas e avaliar o nível de proficiência do candidato e os anos de experiência com cada uma.
    Educação e certificações:

    Dar menos peso à educação: Embora a educação possa fornecer contexto, geralmente é menos significativa para funções de engenheiro de software.
    Não confiar apenas em credenciais: Não baseie decisões apenas em diplomas, certificações ou cursos online.
    Presença online:

    LinkedIn como fonte primária: Use o LinkedIn como a plataforma principal para entender o perfil profissional do candidato.
    Considere GitHub, sites pessoais e blogs: Embora não sejam essenciais, essas plataformas podem fornecer informações adicionais.
    Valorizar o envolvimento da comunidade: A participação positiva em comunidades online pode ser um indicador valioso.
    Detalhes do resumo do currículo:

    Revisão completa do histórico de trabalho: Comece examinando cuidadosamente o histórico profissional do candidato.
    Use descrições de experiência para perguntas direcionadas: Utilize as descrições de experiências passadas para formular perguntas de entrevista relevantes.
    Dese enfocar a posse: Não priorize o tempo gasto em cada empresa; concentre-se na qualidade de suas contribuições.
    Considerações adicionais:

    Alinhamento de habilidades técnicas: Avaliar se as habilidades técnicas do candidato estão alinhadas com os requisitos específicos da posição em aberto.
    Ajuste cultural: Avaliar o ajuste cultural do candidato com o ambiente de trabalho e os valores da empresa.
    Habilidades de comunicação e interpessoais: Avaliar a capacidade do candidato de se comunicar de forma eficaz e colaborar com os outros.
  `)

  prompt.withContext(resume)

  prompt.withContext(`
  ## Context & Data:
  ${resume}
  -separe o email do canditado e coloque na chave da response email
  -separe sua avaliação do candidato e coloque sua visão com base na sua visao de recrutador e coloque em feedback
  -separe suas sugestões para melhorar o curriculo do candidato e coloque em suggestions
`)

  prompt.withResponseType({
    experiences: "",
    bio: "",
    name: "",
    technologies: "",
    linkedinUrl: "",
    email: "",
    feedback: "",
    suggestions: "",
  })

  const messages = prompt.build()

  const response = await openai.createCompletions(messages)

  return { response }
})
