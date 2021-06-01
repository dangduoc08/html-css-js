import { Configuration, ConfigurationExtender, LoggerService } from './interface'
import { StaticLogger } from './static_logger'

export class Logger extends StaticLogger implements LoggerService {
  private static instance: Logger
  private constructor() {
    super()
  }

  public static getInstance(config?: Configuration): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
      Logger.config = config || Logger.config
    }
    return Logger.instance
  }

  public info<T>(message: string, context?: string, data?: T): void {
    const loggerConfig: ConfigurationExtender = {
      ...Logger.config
    }
    if (arguments.length > 2) loggerConfig.showData = true
    Logger.info(message, context, data, loggerConfig)
  }

  public warn<T>(message: string, context?: string, data?: T): void {
    const loggerConfig: ConfigurationExtender = {
      ...Logger.config
    }
    if (arguments.length > 2) loggerConfig.showData = true
    Logger.warn(message, context, data, loggerConfig)
  }

  public error<T>(message: string, error: Error, context?: string, data?: T): void {
    const loggerConfig: ConfigurationExtender = {
      ...Logger.config
    }
    if (arguments.length > 3) loggerConfig.showData = true
    Logger.error(message, error, context, data, loggerConfig)
  }
}
