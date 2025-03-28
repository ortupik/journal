import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.journal.createMany({
    data: [
      {
        id: "journal-1",
        title: "Morning Reflections",
        content: "Had a great morning walk today!",
        category: "Personal",
        userId: "c11347cd-acd8-4cd0-bdae-4e67ce034e79",
      },
      {
        id: "journal-2",
        title: "Work Progress",
        content: "Completed the project milestone on time.",
        category: "Work",
        userId: "c11347cd-acd8-4cd0-bdae-4e67ce034e79",
      },
      {
        id: "journal-3",
        title: "Travel Plans",
        content: "Planning a trip to Japan next summer!",
        category: "Travel",
        userId: "c11347cd-acd8-4cd0-bdae-4e67ce034e79",
      },
      {
        id: "journal-4",
        title: "Health & Fitness",
        content: "Started a new workout routine.",
        category: "Health",
        userId: "c11347cd-acd8-4cd0-bdae-4e67ce034e79",
      },
      {
        id: "journal-5",
        title: "Random Thoughts",
        content: "Thinking about learning a new language.",
        category: "Other",
        userId: "c11347cd-acd8-4cd0-bdae-4e67ce034e79"
      },
    ],
  });

  console.log("✅ Journal entries seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
