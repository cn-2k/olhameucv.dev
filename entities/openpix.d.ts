// openpix.d.ts

interface OpenPixEvent {
  type: string
  data: {
    status: string
    [key: string]: any // for additional properties
  }
}

interface OpenPixConfig {
  appID: string
}

interface OpenPixPixCommand {
  value: number
  correlationID: string
  description: string
}

type OpenPixCommand = ["config", OpenPixConfig] | ["pix", OpenPixPixCommand]

interface Window {
  $openpix: {
    push: (command: OpenPixCommand) => void
    addEventListener: (callback: (event: OpenPixEvent) => void) => void
    removeEventListener: (callback: (event: OpenPixEvent) => void) => void
  }
}

interface OpenPixEventData {
  status: string
  [key: string]: any
}

interface OpenPixEvent {
  type: string
  data: OpenPixEventData
}
