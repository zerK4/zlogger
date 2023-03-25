import { spawnSync } from "child_process";
import {existsSync} from "fs";
import {writeFileSync} from "fs";
import chalk from "chalk";
import ora from 'ora'
import config from "./lib/config.js";
import path from "path";

const __dirname = process.cwd();
const rootDir = path.join(__dirname);
export const prismaDir = `${rootDir}/prisma`;
const schemaPath = `${prismaDir}/schema.prisma`;


async function generatePrisma() {
  // Check if prisma directory exists
  console.log('\n');
  const spinner = ora('Generating files from prisma...').start();
  if (existsSync(prismaDir)) {
    console.log('\n');
    spinner.warn(chalk.yellow('Prisma directory already exists'))
    console.log('\n');
    return false;
  }
  
  /**
   * initialize prisma config
   */
  const initResult = spawnSync("npx", ["prisma", "init"], { cwd: rootDir });
  if (initResult.status !== 0) {
    console.error(initResult.stderr.toString());
    throw new Error("Prisma initialization failed.");
  }

  /**
   * Update schema.prisma file
   */
  writeFileSync(schemaPath, config);

  /**
   * Push db changes to db
   */
  const pushResult = spawnSync(
    "npx",
    ["prisma", "migrate", "dev", "--name", "initialMigration"],
    { cwd: rootDir }
  );
  if (pushResult.status !== 0) {
    spinner.fail('Prisma schema push failed.')
    console.error(pushResult.stderr.toString());
    throw new Error("Prisma schema push failed.");
  }
  spinner.succeed(chalk.green(`Generated prisma schema in ${schemaPath}, including schema configuration.\n`))
  spinner.succeed(chalk.green(`Log model generated successfully.\n`))
  
  return true;
}

export default generatePrisma;