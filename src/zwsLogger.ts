import { PrismaClient } from '@prisma/client';
import { appendFileSync } from 'fs';
import { LogData, LoggerOptions } from './types/Interfaces.js';
import createLogFile from './lib/checkLocation.js';
import chalk from 'chalk';

const NODE_ENV = process.env.NODE_ENV;

export default class zwsLogger {
  private options: {
    destination: 'db' | 'file' | 'console';
    location?: string;
    console?: boolean;
    shouldConsole?: boolean;
  }
  private prisma: PrismaClient;

/**
 * @param options 
 * destination is file ? location = mandatory
 */
  constructor(options: LoggerOptions) {
    this.prisma = new PrismaClient();
    this.options = options;
    if (this.options.destination === 'file' && !this.options.location) {
      throw new Error('Location must be specified if logging in file!')
    };
    this.options.shouldConsole = NODE_ENV === 'development' && options.shouldConsole ? true : false;
  }
  
  public info(message: string): void {
    this.logger('info', message);
  }

  public error(message: string): void {
    this.logger('error', message);
  }

  public warn(message: string): void {
    this.logger('warn', message);
  }

  /**
   * @param level 
   * @param message 
   */

  private async logger(level: string, message: string): Promise<void> {
    const { options: { destination, location, shouldConsole } } = this;
    const logData: LogData = {
      level,
      message,
      timestamp: new Date(),
    };
    const consoleMessage = console.log(chalk[level === 'warn' ? 'yellow' : level === 'error' ? 'red' : 'green'](logData.message + " | " + logData.level + " | " + logData.timestamp));
    /**
     * ? switch cases for logging destination
     */
    switch (destination) {
      case 'db':
        try {
          await this.prisma.log.create({
            data: logData
          })
        } catch (err) {
          console.log('\n')
          console.error(chalk.bgYellow(`Prisma schema not initialized yet! \n`));
        }
        shouldConsole ? consoleMessage : null;
        break;
      case 'file':
        if (location) {
          const logFilePath = `${location}/${level}.log`;
          createLogFile({location: location, level: level})
          const logString = `${JSON.stringify(logData)}\n`
          appendFileSync(logFilePath, logString, { flag: 'a+'})
          shouldConsole ? consoleMessage : null;
        }
        break;
      default: 
        consoleMessage;
        break;
    }
  }
}

