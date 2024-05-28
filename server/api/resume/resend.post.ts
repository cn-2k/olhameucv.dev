import { Resend } from "resend";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  const resend = new Resend(process.env.RESEND_KEY);

  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "rodrigo.gabriel@cuponomia.com.br",
      subject: "Avaliação de currículo",
      text: `Olá! Seu currículo foi avaliado por um especialista. Para ver o feedback, acesse o link: https://www.turso.com.br/feedback`,
    });
  } catch (error) {
    console.log(error);
  }
});
