// Full question set incorporating all specified tenses across 3 sets
const questionBank = [
    // Set 1
    {
        sentence: "She is wearing a mask.",
        correct: "Present Simple Progressive",
        options: ["Present Simple", "Past Simple", "Present Simple Progressive"],
        feedback: "Incorrect! 'is wearing' shows an action happening right now. 'Is' matches the present, and '-ing' shows it is continuous/progressive."
    },
    {
        sentence: "They built a new bridge over the river last year.",
        correct: "Past Simple",
        options: ["Past Simple", "Past Simple Progressive", "Present Perfect"],
        feedback: "Incorrect! 'Built' is the completed past form of build, and 'last year' specifies a completed time in the past, which is Past Simple."
    },
    {
        sentence: "I was cooking dinner when the phone rang.",
        correct: "Past Simple Progressive",
        options: ["Past Simple", "Past Simple Progressive", "Past Perfect"],
        feedback: "Incorrect! 'Was cooking' describes an action that was ongoing or in progress at a specific moment in the past."
    },
    {
        sentence: "He drinks a glass of warm water every morning.",
        correct: "Present Simple",
        options: ["Present Simple", "Present Simple Progressive", "Future using will"],
        feedback: "Incorrect! 'Drinks' indicates a habit or regular routine, which is the core function of the Present Simple tense."
    },
    
    // Set 2
    {
        sentence: "We have visited Paris three times already.",
        correct: "Present Perfect",
        options: ["Present Perfect", "Past Perfect", "Past Simple"],
        feedback: "Incorrect! 'Have visited' uses have + past participle. It connects the past experience to the present without a specific past time."
    },
    {
        sentence: "By the time the police arrived, the thieves had escaped.",
        correct: "Past Perfect",
        options: ["Past Simple", "Present Perfect", "Past Perfect"],
        feedback: "Incorrect! 'Had escaped' shows an action that happened and was completed before another specific action in the past."
    },
    {
        sentence: "Scientists believe it will rain heavily tomorrow.",
        correct: "Future using will",
        options: ["Future using will", "Present Simple", "Present Simple Progressive"],
        feedback: "Incorrect! 'Will rain' uses the modal verb 'will' to express a prediction about a future event."
    },
    {
        sentence: "Look! The children are playing in the garden.",
        correct: "Present Simple Progressive",
        options: ["Present Simple", "Present Simple Progressive", "Past Simple Progressive"],
        feedback: "Incorrect! 'Are playing' describes an action currently in progress at the exact moment of speaking, guided by the cue 'Look!'."
    },

    // Set 3
    {
        sentence: "She always forgets her keys on the dining table.",
        correct: "Present Simple",
        options: ["Past Simple", "Present Simple", "Present Perfect"],
        feedback: "Incorrect! 'Forgets' combined with the adverb 'always' describes a permanent state, habit, or frequency rule."
    },
    {
        sentence: "Yesterday at 5 PM, John was washing his car.",
        correct: "Past Simple Progressive",
        options: ["Past Simple Progressive", "Past Simple", "Present Simple Progressive"],
        feedback: "Incorrect! 'Was washing' highlights an ongoing activity that was happening at a precise historical time frame."
    },
    {
        sentence: "I have lived here since I was a little child.",
        correct: "Present Perfect",
        options: ["Present Perfect", "Past Perfect", "Present Simple Progressive"],
        feedback: "Incorrect! 'Have lived' describes a state that started in the past and continues right up into the present day."
    },
    {
        sentence: "If you study hard, I am sure you will pass the exam.",
        correct: "Future using will",
        options: ["Present Simple", "Future using will", "Past Simple"],
        feedback: "Incorrect! 'Will pass' represents an outcome or assurance positioned in the upcoming future timeline."
    }
];

// Game State variables
let currentRound = 0;
let score = 0;
let totalQuestions = questionBank.length;
let timeElapsed = 0.0;
let timerInterval = null;
let gameActive = false;

// DOM Elements
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const sentenceText = document.getElementById("sentence-text");
const targetArea = document.getElementById("target-area");

const scoreVal = document.getElementById("score-val");
const totalVal = document.getElementById("total-val");
const roundVal = document.getElementById("round-val");
const maxRoundsVal = document.getElementById("max-rounds");
const timerVal = document.getElementById("timer-val");

const feedbackPanel = document.getElementById("feedback-panel");
const feedbackText = document.getElementById("feedback-text");
const feedbackIcon = document.querySelector(".feedback-icon");

const endTitle = document.getElementById("end-title");
const finalScore = document.getElementById("final-score");
const finalTime = document.getElementById("final-time");
const endMessage = document.getElementById("end-message");

// Sound Synthesis using Web Audio API (No audio assets required)
function playGunshot() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // White noise node for blast
        const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        // Lowpass filter to make it sound punchy
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.4);
        
        // Volume decay envelope
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start();
    } catch (e) {
        console.log("Audio not supported or blocked by browser policy");
    }
}

// Start Game Initialization
function startGame() {
    currentRound = 0;
    score = 0;
    timeElapsed = 0.0;
    gameActive = true;
    
    totalVal.textContent = totalQuestions;
    maxRoundsVal.textContent = totalQuestions;
    
    startScreen.classList.remove("active");
    endScreen.classList.remove("active");
    gameScreen.classList.add("active");
    
    startTimer();
    loadQuestion();
}

// Timer management (updates every 100ms for decimal accuracy)
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    const startTime = Date.now();
    timerInterval = setInterval(() => {
        if (gameActive) {
            timeElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            timerVal.textContent = timeElapsed;
        }
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Load current question onto targets
function loadQuestion() {
    feedbackPanel.classList.add("hidden");
    
    if (currentRound >= totalQuestions) {
        endGame();
        return;
    }
    
    scoreVal.textContent = score;
    roundVal.textContent = currentRound + 1;
    
    const q = questionBank[currentRound];
    sentenceText.textContent = q.sentence;
    
    // Clear old target buttons
    targetArea.innerHTML = "";
    
    // Map options out into clickable target boxes
    q.options.forEach(option => {
        const targetBtn = document.createElement("div");
        targetBtn.className = "target";
        targetBtn.textContent = option;
        targetBtn.addEventListener("click", () => handleShot(option, q));
        targetArea.appendChild(targetBtn);
    });
}

// Process the target shot
function handleShot(selectedOption, questionObj) {
    playGunshot();
    
    // Gun flash screen animation trigger
    const container = document.querySelector(".game-container");
    container.classList.add("flash-effect");
    setTimeout(() => container.classList.remove("flash-effect"), 150);
    
    if (selectedOption === questionObj.correct) {
        // Correct Target Hit
        score++;
        feedbackIcon.textContent = "🎯";
        feedbackText.innerHTML = `<span style="color:#6a994e; font-weight:bold; font-size:1.4rem;">DIRECT HIT!</span><br><br>"${questionObj.sentence}" is indeed <strong>${questionObj.correct}</strong>. Excellent grammar recognition!`;
        currentRound++;
    } else {
        // Incorrect Target Hit
        feedbackIcon.textContent = "💥💥💥";
        feedbackText.innerHTML = `<span style="color:#bc4749; font-weight:bold; font-size:1.4rem;">MISSED TARGET!</span><br><br>${questionObj.feedback}<br><br>The correct answer is actually <strong>${questionObj.correct}</strong>.`;
        currentRound++;
    }
    
    feedbackPanel.classList.remove("hidden");
}

// Show final screen results and rewards
function endGame() {
    gameActive = false;
    stopTimer();
    
    gameScreen.classList.remove("active");
    endScreen.classList.add("active");
    
    finalScore.textContent = `${score} / ${totalQuestions}`;
    finalTime.textContent = timeElapsed;
    
    endMessage.innerHTML = "";
    
    if (score === totalQuestions) {
        // 100% Perfect Score - Encouragement Message
        endTitle.textContent = "🏆 Master Marksman! 🏆";
        endMessage.className = "end-message success-box";
        endMessage.innerHTML = "<h4>Incredible Job! 🎉</h4><p>You didn't miss a single shot! You have completely mastered English verb tenses. Keep up this magnificent accuracy and go forth with absolute confidence!</p>";
    } else {
        // Any errors present - Direct feedback to try again
        endTitle.textContent = "🤠 Keep Practicing, Partner! 🤠";
        endMessage.className = "end-message retry-box";
        endMessage.innerHTML = `<h4>Nice Try! You scored ${score} out of ${totalQuestions}.</h4><p>To become a true Tense Master, you must get a flawless score! Review your mistakes, reload your shotgun, and try the activity again. Practice makes perfect!</p>`;
    }
}

// Event Listeners for Game Management Loops
startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", loadQuestion);
restartBtn.addEventListener("click", startGame);
```[cite: 1]
