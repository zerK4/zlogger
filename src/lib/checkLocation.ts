import { existsSync, mkdirSync, writeFileSync } from "fs";
import { Data } from "../types/Interfaces.js";

export const createLogFile = (data: Data) => {
  const { location, level } = data;

  const logFilePath = `${location}/${level}.log`;
  if (!existsSync(logFilePath)) {
    mkdirSync(location, { recursive: true });
    writeFileSync(logFilePath, "");
  }
};

export default createLogFile;
