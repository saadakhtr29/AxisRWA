const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createNotification = async ({ userId, title, body }) => {
  return prisma.notification.create({
    data: {
      userId,
      title,
      body,
      readStatus: false,
    },
  });
};

module.exports = { createNotification };