// Asegurar que todo el código se ejecute SOLO cuando el HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

    // Banco de preguntas (3 sets completos, 12 preguntas en total)
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

    // Variables de estado del juego
    let currentRound = 0;
    let score = 0;
    let totalQuestions = questionBank.length;
    let timeElapsed = 0.0;
    let timerInterval = null;
    let gameActive = false;

    // Elementos del DOM (Se obtienen de manera segura)
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

    // Síntesis de Sonido optimizada para evitar bloqueos del navegador en Deploy
    function playGunshot() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            // Reanudar el contexto
