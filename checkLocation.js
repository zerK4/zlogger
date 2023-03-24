import { existsSync, mkdirSync, writeFileSync } from "fs";

export const createLogFile = (data) => {
  const { location, level } = data;

  const logFilePath = `${location}/${level}.log`;
  if (!existsSync(logFilePath)) {
    mkdirSync(location, { recursive: true });
    writeFileSync(logFilePath, "");
  }
};

export default createLogFile;
