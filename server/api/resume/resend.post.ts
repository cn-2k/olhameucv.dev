import { Resend } from "resend";
import { useCompiler } from "#vue-email"

const resend = new Resend(process.env.RESEND_KEY);

export default defineEventHandler(async (event) => {
  const { email, feedbackResponse } = await readBody(event);

  const template = await useCompiler("feedbackAnalyse.vue", {
    props: {
      feedbackOverview: feedbackResponse.experiences,
      feedbackResponse: feedbackResponse.suggestions,
    }
  })

  const options = {
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Avaliação de currículo",
    html: template.html,
  }

  try {
    await resend.emails.send(options);

    return { message: "Email sent" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { message: "Failed to send email", error };
  }
});
