#!/usr/bin/env node

const spawnSync = require("child_process").spawnSync;
const existsSync = require("fs").existsSync;
const writeFileSync = require("fs").writeFileSync;
const config = require("./config");
const path = require("path");

const rootDir = path.join(__dirname, "..", "..");
const prismaDir = `${rootDir}/prisma`;
const schemaPath = `${prismaDir}/schema.prisma`;

async function generatePrisma() {
  // Check if prisma directory exists
  if (existsSync(prismaDir)) {
    return null;
  }

  /**
   * initialize prisma config
   */
  console.log("Generating files...");
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
    console.error(pushResult.stderr.toString());
    throw new Error("Prisma schema push failed.");
  }

  console.log(
    `Generated prisma schema in ${schemaPath}, including schema configuration and Log Model: \n ${config}`
  );

  return Promise.resolve();
}

module.exports = generatePrisma();
