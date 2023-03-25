import { LoggerOptions } from './types/Interfaces.js';
export default class zwsLogger {
    private options;
    private prisma;
    constructor(options: LoggerOptions);
    info(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    private logger;
}
