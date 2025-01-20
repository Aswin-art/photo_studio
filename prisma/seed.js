import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

function saltAndHashPassword(password) {
  const saltRounds = 10; // Define the cost factor for the hashing process
  const salt = bcryptjs.genSaltSync(saltRounds); // Generate a salt
  const hashedPassword = bcryptjs.hashSync(password, salt); // Hash the password using the salt
  return hashedPassword;
}

const prisma = new PrismaClient();
async function main() {
  // const hash = await bcryptjs.hash("password", 10);
  // const newUser = await prisma.users.create({
  //   data: {
  //     email: "admin@gmail.com",
  //     password: hash
  //   }
  // });
  // console.log("Created new user: ", newUser);

  const newUser2 = await prisma.users.create({
    data: {
      email: "test1@mail.com",
      password: await saltAndHashPassword("123")
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
