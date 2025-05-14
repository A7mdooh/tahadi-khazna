// script.js
let currentQuestionIndex = 0;
let students = [];
let scores = [0, 0, 0];
let currentStudent = 0;

const questionEl = document.getElementById("question");
const answerButtons = document.querySelectorAll(".answer-btn");
const studentTurnEl = document.getElementById("student-turn");
const studentsWaitingEl = document.getElementById("students-waiting");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const winSound = document.getElementById("win-sound");
const hoverSound = document.getElementById("hover-sound");

function startChallenge() {
    students = [
        document.getElementById("student1").value,
        document.getElementById("student2").value,
        document.getElementById("student3").value
    ];
    if (students.some(name => name.trim() === "")) {
        alert("يرجى إدخال أسماء جميع الطلاب.");
        return;
    }
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("question-screen").style.display = "block";
    showQuestion();
}

function showQuestion() {
    let q = questions[currentQuestionIndex];
    questionEl.textContent = q.question;
    answerButtons.forEach((btn, i) => {
        btn.textContent = q.answers[i];
        btn.onclick = () => handleAnswer(i);
        btn.onmouseenter = () => {
            hoverSound.currentTime = 0;
            hoverSound.play();
        };
    });
    studentTurnEl.textContent = students[currentStudent];
    studentsWaitingEl.textContent = "في انتظار إجابات الطلاب...";
}

function handleAnswer(selected) {
    const correct = questions[currentQuestionIndex].correct;
    if (selected === correct) {
        scores[currentStudent]++;
        playSound(true);
    } else {
        playSound(false);
    }
    currentQuestionIndex++;
    currentStudent = (currentStudent + 1) % 3;

    if (currentQuestionIndex >= questions.length) {
        document.getElementById("who-is-winner").style.display = "block";
        studentsWaitingEl.textContent = "تمت الإجابة على جميع الأسئلة.";
    } else {
        showQuestion();
    }
}

function playSound(isCorrect) {
    if (isCorrect) correctSound.play();
    else wrongSound.play();
}

function getWinnerName() {
    const maxScore = Math.max(...scores);
    const winnerIndex = scores.indexOf(maxScore);
    return students[winnerIndex];
}

function showWinner() {
    document.getElementById("question-screen").style.display = "none";
    document.getElementById("winner-screen").style.display = "block";
    document.getElementById("winner-name").textContent = getWinnerName();
    winSound.play();
    startFireworks();
    createMoneyRain();
}

function restart() {
    window.location.reload();
}

function startFireworks() {
    const canvas = document.getElementById("fireworks-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    const fireworks = [];
    for (let i = 0; i < 100; i++) {
        fireworks.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height / 2),
            radius: random(2, 4),
            color: `hsl(${random(0, 360)}, 100%, 50%)`,
            dx: random(-2, 2),
            dy: random(-2, 2)
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fireworks.forEach(f => {
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            ctx.fillStyle = f.color;
            ctx.fill();
            f.x += f.dx;
            f.y += f.dy;
            f.radius *= 0.96;
        });
        requestAnimationFrame(draw);
    }
    draw();
}

function createMoneyRain() {
    const container = document.getElementById("money-rain");
    for (let i = 0; i < 30; i++) {
        const money = document.createElement("img");
        money.src = "images/money.png";
        money.classList.add("money");
        money.style.left = Math.random() * 100 + "vw";
        money.style.animationDuration = (Math.random() * 2 + 3) + "s";
        money.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(money);
    }
}

window.addEventListener("resize", () => {
    const canvas = document.getElementById("fireworks-canvas");
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});