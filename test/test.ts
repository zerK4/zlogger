const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

const testLogger = async () => {
    try {
        const data = await prisma.log.create({
            data: {
                level: 'info',
                message: 'Huray, your first log',
                timestamp: new Date()
            }
        })
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
}

module.exports = testLogger();