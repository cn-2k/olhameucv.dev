export interface FeedbackResponse {
  response: {
    email: string
    summary: {
      feedback: string
      suggestions: string
    }
    profissionalExperiences: {
      feedback: string
      suggestions: string
    }
    education: {
      feedback: string
      suggestions: string
    }
    skills: {
      feedback: string
      suggestions: string
    }
    certifications: {
      feedback: string
      suggestions: string
    }
  }
}

export interface FeedbackProps {
  email: string
  summary: FeedbackSection
  profissionalExperiences: FeedbackSection
  education: FeedbackSection
  skills: FeedbackSection
  certifications: FeedbackSection
}

interface FeedbackSection {
  feedback: string
  suggestions: string
}
