const questions = [

{
sentence: "She is wearing a mask.",
correct: "Present Continuous",
choices: [
"Present Continuous",
"Present Simple",
"Past Simple"
],
feedback: {
"Present Simple":
"Incorrect. 'She is wearing' uses the verb BE + verb-ing, which indicates an action happening right now.",
"Past Simple":
"Incorrect. Past Simple describes completed actions in the past. This sentence describes something happening now."
}
},

{
sentence: "They play soccer every Saturday.",
correct: "Present Simple",
choices: [
"Present Simple",
"Present Continuous",
"Past Continuous"
],
feedback: {
"Present Continuous":
"Incorrect. Present Continuous is for actions happening now. 'Every Saturday' shows a routine.",
"Past Continuous":
"Incorrect. Past Continuous describes an action that was in progress in the past."
}
},

{
sentence: "I visited my grandmother yesterday.",
correct: "Past Simple",
choices: [
"Past Simple",
"Present Perfect",
"Future with Will"
],
feedback: {
"Present Perfect":
"Incorrect. The word 'yesterday' indicates a finished past time, so Past Simple is needed.",
"Future with Will":
"Incorrect. This action already happened in the past."
}
},

{
sentence: "We were watching TV when the lights went out.",
correct: "Past Continuous",
choices: [
"Past Continuous",
"Past Simple",
"Present Continuous"
],
feedback: {
"Past Simple":
"Incorrect. The action was in progress when another event happened.",
"Present Continuous":
"Incorrect. The sentence refers to a past event, not a current action."
}
},

{
sentence: "She has finished her homework.",
correct: "Present Perfect",
choices: [
"Present Perfect",
"Past Simple",
"Future with Will"
],
feedback: {
"Past Simple":
"Incorrect. Present Perfect connects a past action with the present result.",
"Future with Will":
"Incorrect. The action is already completed."
}
},

{
sentence: "I will call you tomorrow.",
correct: "Future with Will",
choices: [
"Future with Will",
"Present Simple",
"Past Simple"
],
feedback: {
"Present Simple":
"Incorrect. The word 'tomorrow' indicates a future action.",
"Past Simple":
"Incorrect. The action has not happened yet."
}
}

];

let currentQuestion = 0;
let score = 0;
let wrongAnswers = 0;
let seconds = 0;

const sentenceEl = document.getElementById("sentence");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");

const timer = setInterval(() => {
    seconds++;
    timerEl.textContent = seconds;
},1000);

function loadQuestion(){

    feedbackEl.innerHTML = "";
    nextBtn.style.display = "none";

    const q = questions[currentQuestion];

    sentenceEl.textContent = q.sentence;
    choicesEl.innerHTML = "";

    q.choices.forEach(choice => {

        const btn = document.createElement("button");

        btn.classList.add("choice-btn");

        btn.innerHTML = `🔫 Shoot: ${choice}`;

        btn.addEventListener("click", () => checkAnswer(choice, btn));

        choicesEl.appendChild(btn);
    });
}

function checkAnswer(choice, button){

    const q = questions[currentQuestion];

    document.querySelectorAll(".choice-btn")
        .forEach(btn => btn.disabled = true);

    if(choice === q.correct){

        button.classList.add("correct");

        score++;
        scoreEl.textContent = score;

        feedbackEl.innerHTML =
        `
        <h3>🎯 Direct Hit!</h3>
        <p>Correct! This sentence is in <strong>${q.correct}</strong>.</p>
        `;

    } else {

        button.classList.add("wrong");
        wrongAnswers++;

        feedbackEl.innerHTML =
        `
        <h3>❌ Missed Shot!</h3>
        <p>${q.feedback[choice]}</p>
        <br>
        <p><strong>Correct Answer:</strong> ${q.correct}</p>
        `;
    }

    nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {

    currentQuestion++;

    if(currentQuestion < questions.length){
        loadQuestion();
    }else{
        finishGame();
    }
});

function finishGame(){

    clearInterval(timer);

    document.getElementById("gameArea").style.display = "none";
    document.getElementById("resultScreen").classList.remove("hidden");

    const resultTitle = document.getElementById("resultTitle");
    const resultMessage = document.getElementById("resultMessage");

    if(wrongAnswers === 0){

        resultTitle.textContent = "🏆 Perfect Score!";

        resultMessage.innerHTML =
        `
        Excellent work!

        You correctly identified all verb tenses.

        Final Score: ${score}/${questions.length}

        Time: ${seconds} seconds

        Keep practicing! Your grammar recognition skills are outstanding!
        `;
    }
    else{

        resultTitle.textContent = "📚 Keep Practicing";

        resultMessage.innerHTML =
        `
        Good effort!

        Score: ${score}/${questions.length}

        Time: ${seconds} seconds

        You missed ${wrongAnswers} question(s).

        Read the feedback carefully and try again. Identifying verb tenses becomes easier with practice!
        `;
    }
}

loadQuestion();
