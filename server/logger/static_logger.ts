import { ParsedPath, parse } from 'path'
import { inspect } from 'util'
import { Colorize } from './util'
import { Configuration, ConfigurationExtender } from './interface'
import { formattedLog, formattedTrace } from './type'

export class StaticLogger extends Colorize {
  protected static config: ConfigurationExtender = {
    timestamp: true,
    color: true,
    multiline: true,
    showHidden: true,
    depth: true
  }

  private static loggerLevel = {
    info: {
      level: 'info',
      color: 'green'
    },
    warn: {
      level: 'warn',
      color: 'yellow'
    },
    error: {
      level: 'error',
      color: 'red'
    }
  }

  private static mergeConfig(config: Configuration): ConfigurationExtender {
    return {
      ...StaticLogger.config,
      ...config
    }
  }

  private static generateTimeStamp(): string {
    const timestamp = new Date(Date.now()).toLocaleString(undefined, {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: '2-digit',
      month: '2-digit'
    })
    return timestamp
  }

  private static formatLog(
    level: string,
    message: string,
    context: string,
    config: Configuration
  ): formattedLog {
    const {
      color: isColorize,
      timestamp
    } = config

    const formattedTimestamp: string = timestamp
      ? ` ${StaticLogger.generateTimeStamp()} `
      : ' '

    let formattedLevel: string = `[${level.toUpperCase()}]`
    let formattedContext = context ? `[${context}] ` : ''
    let formattedMessage = message
    const { color } = StaticLogger.loggerLevel[level as keyof typeof StaticLogger.loggerLevel]

    if (isColorize) {
      formattedLevel = StaticLogger[color as 'yellow' | 'green' | 'red'](formattedLevel)
      formattedContext = StaticLogger.yellow(formattedContext)
      formattedMessage = StaticLogger[color as 'yellow' | 'green' | 'red'](formattedMessage)
    }

    return {
      formattedLevel,
      formattedContext,
      formattedMessage,
      formattedTimestamp
    }
  }

  private static formatTrace(
    errorTrace: string[],
    callback: (trace: formattedTrace | undefined, traceIndex: number) => void
  ): void {
    errorTrace.forEach((trace, index) => {
      const trimedTrace: string = trace.trim()
      if (trimedTrace.startsWith('at')) {
        const trimedRawTrace: string = trimedTrace.replace('at', '').trim()
        const additionalInfo: string[] | null = trimedRawTrace.match(/\((.*?)\)/g)
        const filePath: string = Array.isArray(additionalInfo) && additionalInfo.length > 0
          ? additionalInfo[0].replace(/\(|\)/g, '')
          : trimedRawTrace
        const parsedFilePath: ParsedPath = parse(filePath)
        const hasFileName: boolean = !!parsedFilePath.ext
        let fileName: string = parsedFilePath.base
        const lastIndexOfColon: number = fileName.lastIndexOf(':')
        hasFileName && lastIndexOfColon > -1
          ? fileName = fileName.substring(0, lastIndexOfColon)
          : fileName = ''
        const invokedFunction: string = Array.isArray(additionalInfo) && additionalInfo.length > 0
          ? trimedRawTrace.replace(/\((.*?)\).*/g, '').trim()
          : ''

        callback({
          invokedFunction,
          fileName,
          filePath
        }, index)
      }
    })
  }

  private static printMultilineLog(logs: formattedLog): void {
    const {
      formattedContext,
      formattedMessage,
      formattedLevel,
      formattedTimestamp
    } = logs

    process.stdout.write(`${formattedLevel}${formattedTimestamp}${formattedContext}${formattedMessage}\n`)
  }

  private static printMultilineData<T>(data: T, config: Configuration): void {
    const {
      depth,
      color,
      showHidden
    } = config

    let depthLevel = null
    if (depth === true) {
      depthLevel = null
    } else if (depth === false) {
      depthLevel = -1
    } else if (!Number.isNaN(depth)) {
      depthLevel = depth
    }

    const formattedData: string = inspect(data, {
      depth: depthLevel,
      colors: color,
      showHidden
    })

    process.stdout.write(`${formattedData}\n`)
  }

  private static printMultilineTrace(trace: formattedTrace | undefined, config: Configuration): void {
    if (trace) {
      let colorizedInvokedFn = trace.invokedFunction
        ? `${trace.invokedFunction} `
        : ''
      let colorizedFilePath = trace.filePath
        ? trace.filePath
        : ''
      const fileName = trace.fileName
        ? trace.fileName
        : ''
      let dash = '-'
      if (config.color) {
        colorizedInvokedFn = StaticLogger.yellow(colorizedInvokedFn)
        colorizedFilePath = StaticLogger.dim(colorizedFilePath)
        dash = StaticLogger.dim(dash)
      }
      process.stdout.write(`${dash} ${colorizedInvokedFn}${fileName}\n`)
      process.stdout.write(`  ${colorizedFilePath}\n`)
    }
  }

  private static printOneLineLog(logs: formattedLog, breakLine?: boolean): void {
    const {
      formattedContext,
      formattedMessage,
      formattedLevel,
      formattedTimestamp
    } = logs

    const br: string = breakLine ? '\n' : ' '

    process.stdout.write(`${formattedLevel}${formattedTimestamp}${formattedContext}${formattedMessage}${br}`)
  }

  private static printOneLineData<T>(data: T, config: Configuration, breakLine?: boolean): void {
    const {
      depth,
      color,
      showHidden
    } = config

    const br: string = breakLine ? '\n' : ' '

    let depthLevel = null
    if (depth === true) {
      depthLevel = null
    } else if (depth === false) {
      depthLevel = -1
    } else if (!Number.isNaN(depth)) {
      depthLevel = depth
    }
    const breakLength: number = 999999
    const formattedData: string = inspect(data, {
      colors: color,
      depth: depthLevel,
      showHidden,
      breakLength,
      compact: breakLength
    })

    process.stdout.write(`${formattedData}${br}`)
  }

  private static printOneLineTrace(trace: string, breakLine?: boolean): void {
    const br: string = breakLine ? '\n' : ' '
    process.stdout.write(`${trace}${br}`)
  }

  public static info<T>(message: string, context?: string, data?: T, config?: ConfigurationExtender): void {
    const level: string = StaticLogger.loggerLevel.info.level
    let mergedConfig = StaticLogger.config
    if (config) {
      mergedConfig = StaticLogger.mergeConfig(config)
    }

    context = context ? context : ''

    const logs = StaticLogger.formatLog(level, message, context, mergedConfig)
    if (mergedConfig.multiline) {
      StaticLogger.printMultilineLog(logs)
      if (mergedConfig.showData) {
        StaticLogger.printMultilineData(data, mergedConfig)
      }
    } else {
      StaticLogger.printOneLineLog(logs, !mergedConfig.showData)
      if (mergedConfig.showData) {
        StaticLogger.printOneLineData(data, mergedConfig, true)
      }
    }
  }

  public static warn<T>(message: string, context?: string, data?: T, config?: ConfigurationExtender): void {
    const level: string = StaticLogger.loggerLevel.warn.level
    let mergedConfig = StaticLogger.config
    if (config) {
      mergedConfig = StaticLogger.mergeConfig(config)
    }

    context = context ? context : ''

    const logs = StaticLogger.formatLog(level, message, context, mergedConfig)

    if (mergedConfig.multiline) {
      StaticLogger.printMultilineLog(logs)
      if (mergedConfig.showData) {
        StaticLogger.printMultilineData(data, mergedConfig)
      }
    } else {
      StaticLogger.printOneLineLog(logs, !mergedConfig.showData)
      if (mergedConfig.showData) {
        StaticLogger.printOneLineData(data, mergedConfig, true)
      }
    }
  }

  public static error<T>(message: string, error: Error, context?: string, data?: T, config?: ConfigurationExtender): void {
    const level: string = StaticLogger.loggerLevel.error.level
    let mergedConfig = StaticLogger.config
    if (config) {
      mergedConfig = StaticLogger.mergeConfig(config)
    }

    context = context ? context : ''

    const logs = StaticLogger.formatLog(level, message, context, mergedConfig)
    const isError: boolean = error instanceof Error

    if (mergedConfig.multiline) {
      StaticLogger.printMultilineLog(logs)
      if (mergedConfig.showData) {
        StaticLogger.printMultilineData(data, mergedConfig)
      }
      if (isError) {
        const errorStack = error.stack || ''
        const errorTrace: string[] = errorStack.split('\n')
        StaticLogger.formatTrace(errorTrace, eachTrace => {
          StaticLogger.printMultilineTrace(eachTrace, mergedConfig)
        })
      }
    } else {
      StaticLogger.printOneLineLog(logs, !mergedConfig.showData && !isError)
      if (mergedConfig.showData) {
        StaticLogger.printOneLineData(data, mergedConfig, false)
      }
      if (isError) {
        const errorStack = error.stack || ''
        const errorTrace: string[] = errorStack.split('\n')
        const totalTrace: number = errorTrace.length
        let printedTrace: string = ''
        StaticLogger.formatTrace(errorTrace, (eachTrace, index) => {
          const willPrintSpace = !printedTrace ? '' : ' '
          const willPrintComma = index === totalTrace - 1 ? '' : ','
          if (eachTrace) {
            let colorizedInvokedFn = eachTrace.invokedFunction
              ? `${eachTrace.invokedFunction} `
              : ''
            let colorizedFilePath = eachTrace.filePath
              ? `(${eachTrace.filePath})`.replace(process.cwd(), '')
              : ''
            if (mergedConfig.color) {
              colorizedInvokedFn = StaticLogger.yellow(colorizedInvokedFn)
              colorizedFilePath = StaticLogger.dim(colorizedFilePath)
            }
            printedTrace += `${willPrintSpace}${colorizedInvokedFn}${colorizedFilePath}${willPrintComma}`
          }
        })

        StaticLogger.printOneLineTrace(printedTrace, true)
      }
    }
  }
}