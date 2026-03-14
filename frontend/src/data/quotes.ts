export interface Quote {
  text: string;
  source: string;
  character?: string;
}

const quotes: Quote[] = [
  // How I Met Your Mother
  {
    text: "If you're not scared, then you're not taking a chance. And if you're not taking a chance, then what the hell are you doing?",
    source: "How I Met Your Mother",
    character: "Ted Mosby",
  },
  {
    text: "You will be shocked, kids, when you discover how easy it is in life to part ways with people forever. That's why, when you find someone you want to keep around, you do something about it.",
    source: "How I Met Your Mother",
    character: "Ted Mosby",
  },
  {
    text: "Love is the best thing we do.",
    source: "How I Met Your Mother",
    character: "Ted Mosby",
  },
  {
    text: "When you meet the right person, you know it. You can't stop thinking about them. They're your best friend and your soulmate. You can't wait to spend the rest of your life with them.",
    source: "How I Met Your Mother",
    character: "Ted Mosby",
  },

  // The Summer I Turned Pretty
  {
    text: "It's always been you. Even when I didn't know it, it was you.",
    source: "The Summer I Turned Pretty",
    character: "Conrad Fisher",
  },
  {
    text: "I think I've been holding myself back from falling in love again because once you do, you give someone the power to destroy you.",
    source: "The Summer I Turned Pretty",
    character: "Belly",
  },
  {
    text: "Some loves are too big for this world. Too bright, too fierce. But they burn on forever.",
    source: "The Summer I Turned Pretty",
  },

  // Stuck in Love
  {
    text: "The rare, random moments of closeness between human beings are worth living for.",
    source: "Stuck in Love",
    character: "Bill Borgens",
  },
  {
    text: "I remember that it hurt. Looking at her hurt.",
    source: "Stuck in Love",
    character: "Rusty",
  },
  {
    text: "In the end, we all just want someone that chooses us, over everyone else, under any circumstances.",
    source: "Stuck in Love",
  },

  // The Perks of Being a Wallflower
  {
    text: "We accept the love we think we deserve.",
    source: "The Perks of Being a Wallflower",
    character: "Mr. Anderson",
  },
  {
    text: "And in that moment, I swear we were infinite.",
    source: "The Perks of Being a Wallflower",
    character: "Charlie",
  },
  {
    text: "So I guess we are who we are for a lot of reasons. And maybe we'll never know most of them. But even if we don't have the power to choose where we come from, we can still choose where we go from there.",
    source: "The Perks of Being a Wallflower",
    character: "Charlie",
  },
  {
    text: "There's nothing like deep breaths after laughing that hard. Nothing in the world like a sore stomach for the right reasons.",
    source: "The Perks of Being a Wallflower",
    character: "Charlie",
  },

  // Trying (Apple TV+)
  {
    text: "You don't find love, it finds you. It's got a little bit to do with destiny, fate, and what's written in the stars.",
    source: "Trying",
  },
  {
    text: "Sometimes the bravest thing you can do is keep trying, even when everything tells you to stop.",
    source: "Trying",
    character: "Nikki",
  },
  {
    text: "The thing about love is, it doesn't care about your plans.",
    source: "Trying",
    character: "Jason",
  },

  // Dead Poets Society
  {
    text: "Carpe diem. Seize the day, boys. Make your lives extraordinary.",
    source: "Dead Poets Society",
    character: "John Keating",
  },
  {
    text: "We don't read and write poetry because it's cute. We read and write poetry because we are members of the human race. And the human race is filled with passion.",
    source: "Dead Poets Society",
    character: "John Keating",
  },
  {
    text: "Medicine, law, business, engineering -- these are noble pursuits and necessary to sustain life. But poetry, beauty, romance, love -- these are what we stay alive for.",
    source: "Dead Poets Society",
    character: "John Keating",
  },

  // Before Sunrise / Before Sunset / Before Midnight
  {
    text: "I believe if there's any kind of God, it wouldn't be in any of us. Not you or me, but just this little space in between.",
    source: "Before Sunrise",
    character: "Celine",
  },
  {
    text: "Isn't everything we do in life a way to be loved a little more?",
    source: "Before Sunset",
    character: "Celine",
  },
  {
    text: "If there's any kind of magic in this world, it must be in the attempt of understanding someone, sharing something.",
    source: "Before Sunrise",
    character: "Celine",
  },
  {
    text: "I guess when you're young, you just believe there'll be many people with whom you'll connect. Later in life, you realize it only happens a few times.",
    source: "Before Sunset",
    character: "Celine",
  },
  {
    text: "Like sunlight, sunset, we appear, we disappear. We are so important to some, but we are just passing through.",
    source: "Before Midnight",
    character: "Jesse",
  },
];

export default quotes;
