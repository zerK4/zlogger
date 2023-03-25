var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { writeFileSync } from "fs";
import chalk from "chalk";
import ora from 'ora';
import config from "./lib/config.js";
import path from "path";
const __dirname = process.cwd();
const rootDir = path.join(__dirname);
export const prismaDir = `${rootDir}/prisma`;
const schemaPath = `${prismaDir}/schema.prisma`;
function generatePrisma() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n');
        const spinner = ora('Generating files from prisma...').start();
        if (existsSync(prismaDir)) {
            console.log('\n');
            spinner.warn(chalk.yellow('Prisma directory already exists'));
            console.log('\n');
            return false;
        }
        const initResult = spawnSync("npx", ["prisma", "init"], { cwd: rootDir });
        if (initResult.status !== 0) {
            console.error(initResult.stderr.toString());
            throw new Error("Prisma initialization failed.");
        }
        writeFileSync(schemaPath, config);
        const pushResult = spawnSync("npx", ["prisma", "migrate", "dev", "--name", "initialMigration"], { cwd: rootDir });
        if (pushResult.status !== 0) {
            spinner.fail('Prisma schema push failed.');
            console.error(pushResult.stderr.toString());
            throw new Error("Prisma schema push failed.");
        }
        spinner.succeed(chalk.green(`Generated prisma schema in ${schemaPath}, including schema configuration.\n`));
        spinner.succeed(chalk.green(`Log model generated successfully.\n`));
        return true;
    });
}
export default generatePrisma;
