var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import { appendFileSync } from 'fs';
import createLogFile from './lib/checkLocation.js';
import chalk from 'chalk';
const NODE_ENV = process.env.NODE_ENV;
export default class zwsLogger {
    constructor(options) {
        this.prisma = new PrismaClient();
        this.options = options;
        if (this.options.destination === 'file' && !this.options.location) {
            throw new Error('Location must be specified if logging in file!');
        }
        ;
        this.options.shouldConsole = NODE_ENV === 'development' && options.shouldConsole ? true : false;
    }
    info(message) {
        this.logger('info', message);
    }
    error(message) {
        this.logger('error', message);
    }
    warn(message) {
        this.logger('warn', message);
    }
    logger(level, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { options: { destination, location, shouldConsole } } = this;
            const logData = {
                level,
                message,
                timestamp: new Date(),
            };
            const consoleMessage = console.log(chalk[level === 'warn' ? 'yellow' : level === 'error' ? 'red' : 'green'](logData.message + " | " + logData.level + " | " + logData.timestamp));
            switch (destination) {
                case 'db':
                    try {
                        yield this.prisma.log.create({
                            data: logData
                        });
                    }
                    catch (err) {
                        console.log('\n');
                        console.error(chalk.bgYellow(`Prisma schema not initialized yet! \n`));
                    }
                    shouldConsole ? consoleMessage : null;
                    break;
                case 'file':
                    if (location) {
                        const logFilePath = `${location}/${level}.log`;
                        createLogFile({ location: location, level: level });
                        const logString = `${JSON.stringify(logData)}\n`;
                        appendFileSync(logFilePath, logString, { flag: 'a+' });
                        shouldConsole ? consoleMessage : null;
                    }
                    break;
                default:
                    consoleMessage;
                    break;
            }
        });
    }
}
