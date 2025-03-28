import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function main() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const now = new Date();

  // Create a user
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '$2a$10$cInGzDREJtRXt.zMns.9Uu8psAcet20tprzh4DUccCGPa/QEyUfJO'
    }
  });

  const journalData = [
    {
      title: 'Morning Reflections',
      content:
        'I woke up early today and took a quiet walk around the neighborhood. The sun was just rising, painting the sky in beautiful shades of orange and pink. The cool morning breeze was refreshing, and I could hear the faint chirping of birds in the distance. It reminded me of how peaceful the world can be when I take a moment to slow down and appreciate it. I want to start making morning walks a habit.',
      category: 'Personal',
      userId: user.id,
      summary: 'A peaceful morning walk that provided clarity and relaxation.',
      sentiment: 'Positive',
      suggestions:
        'Try to incorporate a short meditation session after morning walks.'
    },
    {
      title: 'Work Goals for the Week',
      content:
        "This week, I need to finalize the UI improvements for the dashboard. The biggest challenge is optimizing performance while keeping the design intuitive. I also have to prepare for Friday's client presentation, which is a bit nerve-wracking since I still need to refine some of my talking points. Time management is going to be key.",
      category: 'Work',
      userId: user.id,
      summary:
        'Setting clear work goals to improve productivity and manage stress.',
      sentiment: 'Neutral',
      suggestions:
        'Block out dedicated focus time for UI improvements and schedule a practice session for the presentation.'
    },
    {
      title: 'Weekend Trip Planning',
      content:
        "I have been feeling a little burnt out, so I decided to plan a weekend getaway. I'm thinking of visiting a quiet town by the lake where I can relax, read a book, and disconnect from technology for a while. I need to book accommodations and make a list of must-see spots.",
      category: 'Travel',
      userId: user.id,
      summary: 'Planning a weekend retreat to unwind and recharge.',
      sentiment: 'Positive',
      suggestions:
        'Research activities in the area and pack essentials like a journal and comfortable hiking shoes.'
    },
    {
      title: 'Gym Progress',
      content:
        "I hit a new personal record on deadlifts today—finally reached 120kg! It's amazing to see how consistency pays off. However, I noticed some strain on my lower back, so I need to focus more on form and stretching before and after workouts.",
      category: 'Health',
      userId: user.id,
      summary:
        'Reached a strength milestone but need to improve form to prevent injuries.',
      sentiment: 'Neutral',
      suggestions:
        'Record form videos to analyze technique and include mobility exercises in warm-ups.'
    },
    {
      title: 'Reading List Updates',
      content:
        'I started reading "Atomic Habits" by James Clear today. The concept of small, incremental improvements really resonated with me. I love the idea that true change comes from identity-based habits rather than just setting goals. Going to apply this approach to my fitness and work routines.',
      category: 'Personal Development',
      userId: user.id,
      summary: 'Reading about habit-building and motivation.',
      sentiment: 'Positive',
      suggestions:
        'Take notes on key takeaways and implement one small habit change per week.'
    },
    {
      title: 'Reflections on Productivity',
      content:
        "Lately, I've been struggling with distractions while working. I tried time-blocking today—set a 90-minute deep work session followed by a 15-minute break. It made a huge difference in my focus. I think I'll keep refining this method to boost efficiency.",
      category: 'Work',
      userId: user.id,
      summary: 'Experimented with time-blocking to improve focus.',
      sentiment: 'Positive',
      suggestions:
        'Track time-blocking effectiveness for a week and adjust break durations if needed.'
    },
    {
      title: 'Family Dinner Recap',
      content:
        'Had dinner with my family after a long time. We shared stories from the past and laughed about childhood memories. It was heartwarming to reconnect. I need to make more time for these moments.',
      category: 'Personal',
      userId: user.id,
      summary: 'Quality time spent with family over dinner.',
      sentiment: 'Positive',
      suggestions: 'Schedule regular family meetups, even if they are virtual.'
    },
    {
      title: 'Coding Breakthrough',
      content:
        'Finally fixed a complex bug in the authentication system today. It was a tricky async issue that took hours to debug, but in the process, I learned more about error handling in Next.js. Documenting this for future reference!',
      category: 'Work',
      userId: user.id,
      summary: 'Solved a major bug and improved coding skills.',
      sentiment: 'Positive',
      suggestions:
        'Write a blog post or internal documentation to share the solution with the team.'
    },
    {
      title: 'Evening Walk Experience',
      content:
        'Went for a walk along the lake today. The sound of water and the sight of the sunset reflecting off the waves was incredibly calming. It made me realize how much I miss being in nature.',
      category: 'Personal',
      userId: user.id,
      summary: 'A refreshing evening walk by the lake.',
      sentiment: 'Positive',
      suggestions: 'Schedule outdoor walks at least three times a week.'
    },
    {
      title: 'Trying a New Recipe',
      content:
        "Cooked homemade sushi for the first time! It was a fun experiment, though my rolls didn't turn out as neat as I hoped. Need to work on my rolling technique.",
      category: 'Food',
      userId: user.id,
      summary: 'Attempted making sushi at home.',
      sentiment: 'Neutral',
      suggestions:
        'Watch a tutorial on proper sushi-rolling techniques and try again next week.'
    }
  ];

  const formattedJournalData = journalData.map((entry) => {
    const createdAt = getRandomDate(threeMonthsAgo, now);
    return {
      ...entry,
      createdAt,
      updatedAt: getRandomDate(createdAt, now)
    };
  });

  // Insert the journal entries into the database
  await prisma.journal.createMany({ data: formattedJournalData });

  console.log('✅ User and Journal entries seeded successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
