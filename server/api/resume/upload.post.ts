/* eslint-disable @stylistic/semi */
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import { openai } from "~/libs/openai/openai";
import { NewPrompt } from "~/libs/openai/promptbuilder";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const [file] = form ?? [];

  const uploadDir = "./server/upload";

  // Verifica se a pasta 'upload' existe
  if (!fs.existsSync(uploadDir)) {
  // Se não existir, cria a pasta
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (!file) {
    throw createError({
      status: 400,
      statusMessage: "file required",
    });
  }

  const pdfBuffer = file.data;

  try {
    const namefilehash = uuidv4();
    await writeJson(pdfBuffer, namefilehash);
    const resume = await lendoJson(namefilehash);

    const prompt = NewPrompt();
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
    `);

    prompt.withContext(resume);

    prompt.withContext(`
      ## Context & Data:
      ${resume}
      -separe o email do canditado e coloque na chave da response email
      -separe sua avaliação do candidato e coloque sua visão com base na sua visao de recrutador e coloque em feedback
      -separe suas sugestões para melhorar o curriculo do candidato e coloque em suggestions
    `);

    prompt.withResponseType({
      experiences: "",
      bio: "",
      name: "",
      technologies: "",
      linkedinUrl: "",
      email: "",
      feedback: "",
      suggestions: "",
    });

    const messages = prompt.build();
    console.log("Prompt =>", JSON.stringify(messages, null, 2));

    await fs.promises.unlink(`./server/upload/${namefilehash}.json`);

    const response = await openai.createCompletions(messages);

    return { response };
  }
  catch (e) {
    const error = e as Error;

    throw createError({
      status: 500,
      statusMessage: error.message,
    });
  }
});

const lendoJson = async (namefilehash) => {
  try {
    const data = await fs.promises.readFile(
      `./server/upload/${namefilehash}.json`,
      "utf8",
    );
    return extractData(JSON.parse(data));
  }
  catch (error) {
    console.error("Error reading JSON:", error);
    return null;
  }
};

const extractData = (data) => {
  const totalPages = data.Pages.length;
  let textTotal = "";

  for (let i = 0; i < totalPages; i++) {
    const text = data.Pages[i].Texts;
    const textArray = text.map((item) => {
      return decodeURIComponent(item.R[0].T);
    });

    textTotal += textArray.join(" ");
  }

  return textTotal;
};

const writeJson = async (pdfBuffer, namefilehash) => {
  const pdfParser = new PDFParser();

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error(errData.parserError);
      reject(errData.parserError); // Reject the promise with the error
    });

    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      try {
        await fs.promises.writeFile(
          `./server/upload/${namefilehash}.json`,
          JSON.stringify(pdfData),
        );
        resolve(); // Resolve the promise when writing is successful
      }
      catch (error) {
        console.error("Error writing JSON:", error);
        reject(error); // Reject the promise with the error during writing
      }
    });

    pdfParser.parseBuffer(pdfBuffer);
  });
};
