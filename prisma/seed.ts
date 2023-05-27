import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);
  const hashedPassword2 = await bcrypt.hash("password", 10);

  const user = await prisma.user.create({
    data: {
      email,
      role: "USER",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "quentingibson94@gmail.com",
      role: "ADMIN",
      password: {
        create: {
          hash: hashedPassword2,
        },
      },
    },
  });
  await prisma.post.create({
    data: {
      title: faker.lorem.words(),
      slug: decodeURI(faker.lorem.words()),
      date: faker.date.recent(),
      category: "test",
      image: "https://picsum.photos/1920",
      content: `Project Details
League Of Wordle

My Submission for Neighborhood Hackathon 2023



If you're a League of Legends enthusiast and enjoy challenging word games, then League of Wordle is the perfect combination of both worlds for you! Inspired by the popular game "Squirdle", League of Wordle puts your champion knowledge to the test. In this web browser word game, your objective is to guess which League of Legends champion the game has selected by decoding hints related to their class and stats.


How to Play:

League of Wordle is a straightforward game that will engage and entertain League of Legends fans. Here's how it works:
    The game will randomly select a League of Legends champion, and your task is to figure out which one it is. The champion stats are hidden.
    To help you guess, League of Wordle provides you with hints in the form of the champion's class and specific stats. The hints will guide you in narrowing down the possibilities and making an educated guess.
    Keep Guessing:
    Continue guessing the champion's name by utilizing the hints. Knowing who is stronger than who is a major advantage here.
    Once you successfully guess the correct champion, celebrate your victory and take pride in your expertise. League of Wordle is not just a game but also an opportunity to deepen your understanding of different champions and their characteristics.`,
    },
  });

  await prisma.project.create({
    data: {
      title: faker.lorem.words(),
      slug: decodeURI(faker.lorem.words()),
      link: faker.internet.url(),
      date: faker.date.recent(),
      type: faker.lorem.word(),
      image: "https://picsum.photos/1920",
      content: `
    The game will randomly select a League of Legends champion, and your task is to figure out which one it is. The champion stats are hidden.
    To help you guess, League of Wordle provides you with hints in the form of the champion's class and specific stats. The hints will guide you in narrowing down the possibilities and making an educated guess.
    Keep Guessing:
    Continue guessing the champion's name by utilizing the hints. Knowing who is stronger than who is a major advantage here.
    Once you successfully guess the correct champion, celebrate your victory and take pride in your expertise. League of Wordle is not just a game but also an opportunity to deepen your understanding of different champions and their characteristics.`,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
