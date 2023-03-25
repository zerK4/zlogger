export interface LogData {
  level: string;
  message: string;
  timestamp: Date;
}
export interface Data {
  location: string;
  level: string;
}
export interface LoggerOptions {
  destination: 'db' | 'file' | 'console';
  location?: string;
  console?: boolean;
  shouldConsole?: boolean;
}
