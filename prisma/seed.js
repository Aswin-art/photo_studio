/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");

function saltAndHashPassword(password) {
  const saltRounds = 10;
  const salt = bcryptjs.genSaltSync(saltRounds);
  const hashedPassword = bcryptjs.hashSync(password, salt);
  return hashedPassword;
}

const prisma = new PrismaClient();
async function main() {
  await prisma.users.deleteMany();

  const newUser2 = await prisma.users.create({
    data: {
      email: "admin@prostudio.com",
      password: saltAndHashPassword("STDpr0STD"),
      updatedAt: new Date()
    }
  });
  console.log("Created new user: ", newUser2);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
