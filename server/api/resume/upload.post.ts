import { v4 as uuidv4 } from "uuid";
import pdfText from "pdf-text";

const toText = (pdfBuffer: Buffer): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    return pdfText(pdfBuffer, async (err: Error, chunks: string[]) => {
      if (err) {
        reject(err);
      }

      resolve(chunks);
    });
  });
};

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const [file] = form ?? [];

  if (!file) {
    throw createError({
      status: 400,
      statusMessage: "file required",
    });
  }

  const pdfBuffer = file.data;

  try {
    const processId = uuidv4();
    const client = useTurso();
    const chunks = await toText(pdfBuffer);
    const resumeText = chunks.join(" ");

    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const emailMatch = resumeText?.match(emailRegex);
    console.log("Email", emailMatch);

    if (emailMatch) {
      await client.execute({
        sql: "INSERT INTO usuarios (process_id, email, resume, is_paid) VALUES (?, ?, ?, ?)",
        args: [processId, emailMatch[0], resumeText, false],
      });
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: "Curriculo invalido",
      });
    }

    return { processId };
  } catch (error) {
    const err = error as Error;
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    });
  }
});
