// This is the new, flexible data structure for our habit packs
export const packs = [
  {
    title: 'Daily Wellness Routine',
    description: 'A daily set of small tasks to build focus, awareness, and a positive mindset.',
    tasksPerDay: 4, // 1 mandatory breathing exercise + 3 random tasks
    duration: 21,
    taskPool: [
      // Cognitive Reframing & Emotional Awareness
      {
        taskType: 'textInput',
        prompt: 'Name one thing you\'re grateful for today.',
        minWords: 5,
      },
      {
        taskType: 'textInput',
        prompt: 'Choose a single word that defines your intention for today.',
      },
      // Logic & Focus
      {
        taskType: 'multipleChoice',
        prompt: 'Which word doesn’t belong: Apple, Banana, Carrot, Mango?',
        options: ['Apple', 'Banana', 'Carrot', 'Mango'],
        correctAnswer: 'Carrot',
      },
      {
        taskType: 'textInput',
        prompt: 'Unscramble this word: TSEFCOU',
        correctAnswer: 'FOCUS',
      },
      // Reflection & Mindset
      {
        taskType: 'textInput',
        prompt: 'Write one thing you did well recently.',
        minWords: 5,
      },
      {
        taskType: 'textInput',
        prompt: 'Imagine a peaceful place. Describe it in 1–2 sentences.',
      },
      {
        taskType: 'textInput',
        prompt: 'What advice would your future self give you today?',
        minWords: 5,
      },
      {
        taskType: 'textInput',
        prompt: 'Write one small act of kindness you can do today.',
        minWords: 5,
      },
    ],
  },
];
