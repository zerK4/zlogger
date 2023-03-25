# zLogger

> `...`
>
> A simple, customizable log system.
>
> `...`

## Installation

`npm install @zerka/zlogger`

## Configuration

```javascript
import zwsLogger from '@zerka/zlogger';


const logger = new zwsLogger({
    destination: 'db | file | console', // where do you want to save the logs. Read more about db bellow.
    location: './logs', // if destination is file, you whould specify also a folder.
    shouldConsole: true | false, // if destination is not console, you can pass this param to have it logged in console too.
})

logger.info(`Some random info`)
logger.error(`Some random error`)
logger.warn(`Some random warning`)
```
> `...`
>
> A log message looks as it follows:
>
> In the future we will work to make it configurable by user directly.
>
> `...`

`{"level":"error","message":"testing","timestamp":"2023-03-25T12:36:58.641Z"}`

## **What DB means and how it works?**
> `...`
>
> PrismaIO was used to handle the queries and database.
>
> ### For the moment one of the drawbacks is that the prisma files and schema are not generated automatically.
> Currently working to fix this and to make the script check if the folder **prisma** exists at the root and if not to create it.
>
> `...`

### If you did not installed prisma yet, and you want to use the logger in prisma, follow this instructions:

> `...`
>
> ## **Install prisma**
>
> `...`

```javascript
npx install prisma @prisma/client // install
npx prisma init // generate base files
```
## Replace schema.prisma content with:
> `.`
>
> If you alreay have it, just add the Log model.
>
> `.`
```javascript
datasource db {
  provider = "sqlite" // using sqlite for local database, you can change with anything supported by prisma.
  url      = "file:dev.db" // location of the database, default in prisma/dev.db.
}

generator client {
  provider = "prisma-client-js"
}

model Log { // Default log model
  id        Int      @id @default(autoincrement())
  level     String // Log level: error | warn | info
  timestamp DateTime // Timestamp for the log.
  message   String // Message which will be provided by you.
}
```

## Once configured, migrate database:
```
npx prisma migrate dev --name some_name
npx prisma studio
```
> `...`
>
> Last commands will handle database migration and live studio provided by prismaIO.
>
> `...`

## File case:
> `...`
>
> Provide the location where you want the logs to be, ./foldername, and it will be created automatically when the log requests will be made.
>
> `...`
## Console case:
> `...`
>
> Just logging everything in console as usual.
>
> `...`

`Chalk is used to make the console more colorfull.`


`Future expectations:`

`...`
> `...`
>
> Prisma will generate automatically based on destination provided.
>
> Error levels will become customisable.
>
> Prisma model will be customisable from input.
> 
> Possible playground by default, without using prismaIO's studio.
>
> `...`