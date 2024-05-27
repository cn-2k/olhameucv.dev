interface Experience {
  position?: string
  duration: string
  responsibilities: string
}

interface Experiences {
  [key: string]: Experience
}

interface FeedbackResponse {
  experiences: Experiences
  bio: string
  name: string
  technologies: string[]
  linkedinUrl: string
  email: string
  feedback: string
  suggestions: string
}

export interface FeedbackProps {
  response: FeedbackResponse
}
