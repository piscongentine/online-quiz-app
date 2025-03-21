const startBtn = document.getElementById("startBtn");
const proceedBtn = document.getElementById("proceedBtn");
const nameInput = document.getElementById("nameInput");
const nameSection = document.getElementById("nameSection");
const rulesSection = document.getElementById("rulesSection");
const agreeCheckbox = document.getElementById("agreeCheckbox");
const quizContainer = document.getElementById("quizContainer");
const resultScreen = document.getElementById("resultScreen");
const questionLine = document.getElementById("questionLine");  // Added for line
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const timerElement = document.getElementById("timer");
const finalScore = document.getElementById("finalScore");


let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = 300;
let interval;
startBtn.addEventListener("click", function () {
    if (nameInput.value.trim() === "") {
        alert("Please enter your name dear!");
        return;
    }

    // Hide button and show loading animation
    startBtn.style.display = "none";
    let loadingAnimation = document.getElementById("loadingAnimation");
    loadingAnimation.classList.remove("hidden");

    // Cmd-style loading effect
    let symbols = ["/", "-", "\\", "|"];
    let index = 0;

    let cmdInterval = setInterval(() => {
        document.getElementById("cmdLoader").textContent = symbols[index];
        index = (index + 1) % symbols.length;
    }, 200);

    // Simulate loading and move to rules after 2 seconds
    setTimeout(() => {
        clearInterval(cmdInterval); // Stop animation
        loadingAnimation.classList.add("hidden");
        nameSection.style.display = "none";
        rulesSection.style.display = "block";
    }, 2000); // 2-second effect
});
proceedBtn.addEventListener("click", function () {
    if (!agreeCheckbox.checked) {
        alert("You must agree to the rules!");
        return;
    }
    rulesSection.style.display = "none";
    quizContainer.style.display = "block";
    startTimer();
    loadQuestions();
});

function startTimer() {
    interval = setInterval(() => {
        timer--;
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;
        timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timer === 0) {
            clearInterval(interval);
            submitQuiz();
        }
    }, 1000);
}

function loadQuestions() {
    fetch("data/questions.json")
        .then(response => response.json())
        .then(data => {
            questions = shuffleArray(data).slice(0, 25);
            displayQuestion();
        })
        .catch(error => console.error("Error loading questions:", error));
}

function displayQuestion() {
    const q = questions[currentQuestionIndex];
    questionLine.innerHTML = `<em>${q.line}</em>`; // Displaying line
    questionText.innerHTML = `<strong>Q${currentQuestionIndex + 1}:</strong> ${q.question}`;
    
    optionsContainer.innerHTML = q.options.map((option, index) => 
        `<div class="option" style="background-color: ${getOptionColor(index)};">
            <label>
                <input type="radio" name="answer" value="${option}"> ${option}
            </label>
        </div>`
    ).join('');

    prevBtn.style.display = currentQuestionIndex === 0 ? "none" : "inline-block";
    nextBtn.style.display = currentQuestionIndex === questions.length - 1 ? "none" : "inline-block";
    submitBtn.style.display = currentQuestionIndex === questions.length - 1 ? "inline-block" : "none";
}

function getOptionColor(index) {
    const colors = ["#FFC0CB", "#FFD700", "#ADD8E6", "#98FB98"];
    return colors[index % colors.length];  // Rotating colors for each option
}

nextBtn.addEventListener("click", function () {
    let selectedOption = document.querySelector("input[name='answer']:checked");
    if (selectedOption && selectedOption.value === questions[currentQuestionIndex].correct) {
        score += 2;
    }
    currentQuestionIndex++;
    displayQuestion();
});

prevBtn.addEventListener("click", function () {
    currentQuestionIndex--;
    displayQuestion();
});

submitBtn.addEventListener("click", submitQuiz);

function submitQuiz() {
    clearInterval(interval);
    let selectedOption = document.querySelector("input[name='answer']:checked");
    if (selectedOption && selectedOption.value === questions[currentQuestionIndex].correct) {
        score += 2;
    }
    quizContainer.style.display = "none";
    resultScreen.style.display = "block";
    finalScore.innerHTML = `<p>Final Score: ${score} / 40</p>`;
}
restartBtn.addEventListener("click", function () {
    // Reset all variables
    currentQuestionIndex = 0;
    score = 0;
    timer = 300; // Reset timer to 2 minutes

    // Hide result screen and show the name input again
    resultScreen.style.display = "none";
    nameSection.style.display = "block";

    // Stop any running timer before starting a new one
    clearInterval(interval);

    console.log("Quiz Restarted!");
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}






