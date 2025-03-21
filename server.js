const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Load questions from JSON file
const questionsFilePath = path.join(__dirname, "data/questions.json");
let questions = JSON.parse(fs.readFileSync(questionsFilePath, "utf8"));

// Shuffle and return 10 random questions
function getRandomQuestions() {
    return [...questions].sort(() => Math.random() - 0.5).slice(0, 20);
}

// API to fetch random questions
app.get("/data/questions.json", (req, res) => {
    res.json(getRandomQuestions());
});

// API to submit answers and calculate score
app.post("/submit", (req, res) => {
    let userAnswers = req.body;
    let score = 0;

    questions.forEach((q) => {
        if (userAnswers[String(q.id)] === q.correct) {
            score += 2;
        }
    });

    res.json({ message: `Your Score: ${score}/20` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});






