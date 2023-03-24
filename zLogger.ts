import { PrismaClient } from '@prisma/client';
import { appendFileSync } from 'fs';
import createLogFile from './checkLocation';
import { LogData } from './Interfaces';

const NODE_ENV = process.env.NODE_ENV;

export default class ZLogger {
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

  constructor(options: { destination: 'db' | 'file' | 'console', location?: string, shouldConsole?: boolean }) {
    this.prisma = new PrismaClient();
    this.options = options;
    if (this.options.destination === 'file' && !this.options.location) {
      throw new Error('Location must be specified if logging in file!')
    };
    this.options.shouldConsole = NODE_ENV === 'development' && options.shouldConsole ? true : false;
  }
  
  /**
   * @param message 
   * @public info | error | warn
   * ? Logging levels
   */

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

    /**
     * ? switch cases for logging destination
     */
    switch (destination) {
      case 'db':
        await this.prisma.log.create({
          data: logData
        })
        shouldConsole ? console.log(logData) : null;
        break;
      case 'file':
        if (location) {
          const logFilePath = `${location}/${level}.log`;
          createLogFile({location: location, level: level})
          const logString = `${JSON.stringify(logData)}\n`
          appendFileSync(logFilePath, logString, { flag: 'a+'})
          shouldConsole ? console.log(logData) : null;
        }
        break;
      default: 
        console.log(logData);
        break;
    }
  }
}

