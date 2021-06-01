export type formattedLog = {
  formattedLevel: string
  formattedMessage: string
  formattedContext: string
  formattedTimestamp: string
}

export type formattedTrace = {
  invokedFunction?: string
  fileName?: string
  filePath?: string
}