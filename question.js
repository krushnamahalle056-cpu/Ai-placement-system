// Hamare questions aur answers ka data

const cardsData = [
    { 
        question: "What is Time Shifting?", 
        answer: "A signal is delayed or advanced in time. Equation: y(t) = x(t - t0)." 
    },
    { 
        question: "What is Time Scaling?", 
        answer: "Compression or expansion of a signal in time. Equation: y(t) = x(at)." 
    },
      { 
        question: "What is a Class B Amplifier?", 
        answer: "An amplifier where the active device conducts for only 180 degrees (half) of the input cycle." 
    },
    { 
        question: "Difference between Let and Const in JS?", 
        answer: "'let' can be reassigned, but 'const' cannot be reassigned after initialization." 
    }
  
];

let currentIndex = 0;
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const flashcard = document.querySelector('.flashcard');