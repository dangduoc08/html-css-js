export interface Configuration {
  timestamp?: boolean
  color?: boolean
  multiline?: boolean
  showHidden?: boolean
  depth?: number | boolean
}

export interface ConfigurationExtender extends Configuration {
  showData?: boolean
}

export interface LoggerService {
  info<T>(message: string, context?: string, data?: T): void
  warn<T>(message: string, context?: string, data?: T): void
  error<T>(message: string, error: Error, context?: string, data?: T): void
}
