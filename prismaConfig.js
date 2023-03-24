export const config = `
datasource db {
  provider = "sqlite"
  url      = "file:dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Log {
  id        Int      @id @default(autoincrement())
  level     String
  timestamp DateTime
  message   String
}
`