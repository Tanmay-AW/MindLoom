export const mindGamesPack = {
  title: 'Mind Games',
  description: 'A 21-day journey to sharpen your mind with daily cognitive challenges and exercises.',
  tasksPerDay: 3,
  duration: 21,
  taskPool: [
    // Day 1
    {
      taskType: 'multipleChoice',
      prompt: 'Which word doesn\'t belong: Apple, Banana, Carrot, Mango?',
      options: ['Apple', 'Banana', 'Carrot', 'Mango'],
      correctAnswer: 'Carrot',
    },
    {
      taskType: 'textInput',
      prompt: 'Unscramble this word: TSEFCOU',
      correctAnswer: 'FOCUS',
    },
    {
      taskType: 'textInput',
      prompt: 'Count backwards from 100 by 7. Write the first 5 numbers.',
      correctAnswer: '100, 93, 86, 79, 72',
    },
    
    // Day 2
    {
      taskType: 'multipleChoice',
      prompt: 'If a bat and ball cost $1.10 together, and the bat costs $1.00 more than the ball, how much does the ball cost?',
      options: ['$0.05', '$0.10', '$0.15', '$0.20'],
      correctAnswer: '$0.05',
    },
    {
      taskType: 'textInput',
      prompt: 'What comes next in this sequence: 2, 4, 8, 16, __',
      correctAnswer: '32',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these is not a primary color?',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      correctAnswer: 'Green',
    },
    
    // Day 3
    {
      taskType: 'textInput',
      prompt: 'Rearrange these letters to form a word: ARPIS',
      correctAnswer: 'PARIS',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'If you rearrange the letters "CIFAIPC", you would have the name of a:',
      options: ['City', 'Animal', 'Ocean', 'Country'],
      correctAnswer: 'Ocean',
    },
    {
      taskType: 'textInput',
      prompt: 'What number is missing: 8, 27, __, 125',
      correctAnswer: '64',
    },
    
    // Day 4
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these words is a synonym for "ephemeral"?',
      options: ['Permanent', 'Fleeting', 'Solid', 'Ancient'],
      correctAnswer: 'Fleeting',
    },
    {
      taskType: 'textInput',
      prompt: 'Solve this riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
      correctAnswer: 'Echo',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'If you have 3 apples and take away 2, how many do you have?',
      options: ['1', '2', '3', '5'],
      correctAnswer: '2',
    },
    
    // Day 5
    {
      taskType: 'textInput',
      prompt: 'What is the capital of France?',
      correctAnswer: 'Paris',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      correctAnswer: 'Mars',
    },
    {
      taskType: 'textInput',
      prompt: 'If you multiply all the numbers on a telephone keypad, what do you get?',
      correctAnswer: '0',
    },
    
    // Day 6
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these animals is not a mammal?',
      options: ['Dolphin', 'Bat', 'Penguin', 'Elephant'],
      correctAnswer: 'Penguin',
    },
    {
      taskType: 'textInput',
      prompt: 'Unscramble this word: GRAEUCO',
      correctAnswer: 'COURAGE',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'What comes next in this pattern: Triangle, Square, Pentagon, ?',
      options: ['Circle', 'Hexagon', 'Octagon', 'Rectangle'],
      correctAnswer: 'Hexagon',
    },
    
    // Day 7
    {
      taskType: 'textInput',
      prompt: 'If a clock takes 7 seconds to strike 7 times, how long will it take to strike 10 times?',
      correctAnswer: '10.5 seconds',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these is not one of the five senses?',
      options: ['Sight', 'Hearing', 'Balance', 'Touch'],
      correctAnswer: 'Balance',
    },
    {
      taskType: 'textInput',
      prompt: 'What 5-letter word becomes shorter when you add two letters to it?',
      correctAnswer: 'Short',
    },
    
    // Additional tasks for remaining days
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these countries is not in Europe?',
      options: ['Spain', 'Germany', 'Egypt', 'Italy'],
      correctAnswer: 'Egypt',
    },
    {
      taskType: 'textInput',
      prompt: 'What has a head and a tail but no body?',
      correctAnswer: 'Coin',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'If you have a cube with 3 red faces and 3 blue faces, what is the probability that the cube will land with a red face on top when rolled?',
      options: ['1/6', '1/3', '1/2', '2/3'],
      correctAnswer: '1/2',
    },
    {
      taskType: 'textInput',
      prompt: 'I am taken from a mine, and shut in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?',
      correctAnswer: 'Pencil lead',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these is not a type of cloud?',
      options: ['Cumulus', 'Stratus', 'Nimbus', 'Celsius'],
      correctAnswer: 'Celsius',
    },
    {
      taskType: 'textInput',
      prompt: 'What has keys but no locks, space but no room, and you can enter but not go in?',
      correctAnswer: 'Keyboard',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these elements has the chemical symbol "Au"?',
      options: ['Silver', 'Gold', 'Aluminum', 'Argon'],
      correctAnswer: 'Gold',
    },
    {
      taskType: 'textInput',
      prompt: 'What has a neck but no head?',
      correctAnswer: 'Bottle',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these is not a programming language?',
      options: ['Python', 'Java', 'HTML', 'Cobra'],
      correctAnswer: 'Cobra',
    },
    {
      taskType: 'textInput',
      prompt: 'What gets wetter as it dries?',
      correctAnswer: 'Towel',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these is not a planet in our solar system?',
      options: ['Mercury', 'Venus', 'Pluto', 'Neptune'],
      correctAnswer: 'Pluto',
    },
    {
      taskType: 'textInput',
      prompt: 'Forward I am heavy, but backward I am not. What am I?',
      correctAnswer: 'Ton',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these is not a type of triangle?',
      options: ['Equilateral', 'Isosceles', 'Scalene', 'Trapezoid'],
      correctAnswer: 'Trapezoid',
    },
    {
      taskType: 'textInput',
      prompt: 'What has many keys but can\'t open a single lock?',
      correctAnswer: 'Piano',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these is not a fruit?',
      options: ['Tomato', 'Avocado', 'Carrot', 'Cucumber'],
      correctAnswer: 'Carrot',
    },
    {
      taskType: 'textInput',
      prompt: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
      correctAnswer: 'Map',
    },
    {
      taskType: 'multipleChoice',
      prompt: 'Which of these is not a state of matter?',
      options: ['Solid', 'Liquid', 'Gas', 'Energy'],
      correctAnswer: 'Energy',
    },
    {
      taskType: 'textInput',
      prompt: 'What comes once in a minute, twice in a moment, but never in a thousand years?',
      correctAnswer: 'The letter M',
    },
  ],
};