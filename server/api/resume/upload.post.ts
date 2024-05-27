import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import PDFParser from "pdf2json"

interface PDFData {
  Pages: Array<{
    Texts: Array<{
      R: Array<{
        T: string
      }>
    }>
  }>
}

const uploadDirectory = "./server/upload"

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const [file] = form ?? []

  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true })
  }

  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: "File is required.",
    })
  }

  const pdfBuffer = file.data

  try {
    const fileHash = uuidv4()
    const processId = uuidv4()
    const client = useTurso()
    await writePDFDataToJson(pdfBuffer, fileHash)
    const resumeText = await readJsonAsText(fileHash)

    await fs.promises.unlink(`${uploadDirectory}/${fileHash}.json`)

    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/
    const emailMatch = resumeText?.match(emailRegex)

    if (emailMatch) {
      await client.execute({
        sql: "INSERT INTO usuarios (process_id, email, resume, is_paid) VALUES (?, ?, ?, ?)",
        args: [
          processId,
          emailMatch[0],
          resumeText,
          false,
        ],
      })
    }

    return { processId }
  }
  catch (error) {
    const err = error as Error
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
})

const readJsonAsText = async (fileHash: string): Promise<string | null> => {
  try {
    const data = await fs.promises.readFile(`${uploadDirectory}/${fileHash}.json`, "utf8")
    return extractTextFromPDFData(JSON.parse(data))
  }
  catch (error) {
    console.error("Error reading JSON:", error)
    return null
  }
}

const extractTextFromPDFData = (pdfData: PDFData): string => {
  return pdfData.Pages.reduce((accumulatedText, page) => {
    const pageText = page.Texts.map(item => decodeURIComponent(item.R[0].T)).join(" ")
    return accumulatedText + pageText + " "
  }, "").trim()
}

const writePDFDataToJson = async (pdfBuffer: Buffer, fileHash: string): Promise<void> => {
  const pdfParser = new PDFParser()

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error(errData)
      reject(errData)
    })

    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      try {
        await fs.promises.writeFile(
          `${uploadDirectory}/${fileHash}.json`,
          JSON.stringify(pdfData),
        )
        resolve()
      }
      catch (error) {
        console.error("Error writing JSON:", error)
        reject(error)
      }
    })

    pdfParser.parseBuffer(pdfBuffer)
  })
}
