export declare const config = "\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:dev.db\"\n}\n\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\nmodel Log {\n  id        Int      @id @default(autoincrement())\n  level     String\n  timestamp DateTime\n  message   String\n}\n";
export default config;
