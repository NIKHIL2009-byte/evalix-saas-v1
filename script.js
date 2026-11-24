
// 1. DOM ELEMENTS (HTML Remote Control)
const startBtn1 = document.querySelector(".btn-start");
const startBtn2 = document.querySelector(".btn-primary");
const modal = document.querySelector("#examModal");
const closeBtn = document.querySelector("#closeExamBtn");

const introArea = document.querySelector("#introArea");
const quizArea = document.querySelector("#quizArea");
const resultArea = document.querySelector("#resultArea");

const studentNameInput = document.querySelector("#studentName");
const beginBtn = document.querySelector("#beginBtn");
const qCounter = document.querySelector("#qCounter");
const timerText = document.querySelector("#timerText");
const questionText = document.querySelector("#questionText");
const optionsList = document.querySelector("#optionsList");
const cheatBanner = document.querySelector("#cheatBanner");

const resultHeading = document.querySelector("#resultHeading");
const finalScoreText = document.querySelector("#finalScoreText");
const liveLeaderboard = document.querySelector("#liveLeaderboard");
const doneExamBtn = document.querySelector("#doneExamBtn");

// Teacher Admin Elements
const adminNavBtn = document.querySelector(".btn-admin");
const adminModal = document.querySelector("#adminModal");
const closeAdminBtn = document.querySelector("#closeAdminBtn");
const addQuestionBtn = document.querySelector("#addQuestionBtn");
const adminMsg = document.querySelector("#adminMsg");
// 2. COMPUTER SCIENCE MCQ BANK (Array of Objects
const quizQuestions = [
  {
    q: "Which data structure uses LIFO (Last In, First Out)?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    ans: 1
  },
  {
    q: "What does DOM stand for in JavaScript?",
    options: ["Data Object Model", "Document Object Model", "Digital Ordinance Map", "Desktop Oriented Mode"],
    ans: 1
  },
  {
    q: "Which time complexity represents Binary Search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    ans: 2
  },
  {
    q: "Which event detects when a student switches browser tabs?",
    options: ["mouseover", "visibilitychange", "keydown", "dblclick"],
    ans: 1
  }
];

// 3. EXAM STATE & CLEAN LEADERBOARD
let currentIndex = 0;
let score = 0;
let timeLeft = 60;
let timerInterval = null;
let isExamRunning = false;
let tabSwitches = 0;
let studentName = "Student";

const leaderboardData = [];
// 4. OPEN & CLOSE STUDENT EXAM MODAL
function openModal() {
  modal.style.display = "flex";
  introArea.style.display = "block";
  quizArea.style.display = "none";
  resultArea.style.display = "none";
}

function closeModal() {
  modal.style.display = "none";
  isExamRunning = false;
  clearInterval(timerInterval);
}

startBtn1.addEventListener("click", openModal);
startBtn2.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
doneExamBtn.addEventListener("click", closeModal);
// 5. BEGIN MONITORED LAB TEST
beginBtn.addEventListener("click", function () {
  const enteredName = studentNameInput.value.trim();
  studentName = enteredName !== "" ? enteredName : "Guest Student";

  currentIndex = 0;
  score = 0;
  timeLeft = 60;
  tabSwitches = 0;
  isExamRunning = true;

  introArea.style.display = "none";
  quizArea.style.display = "block";
  cheatBanner.style.display = "none";

  loadQuestion();
  startTimer();
});
// 6. LOAD CURRENT QUESTION & HANDLE ANSWER
function loadQuestion() {
  const currentQ = quizQuestions[currentIndex];
  qCounter.innerText = `Question ${currentIndex + 1} / ${quizQuestions.length}`;
  questionText.innerText = currentQ.q;
  optionsList.innerHTML = "";

  currentQ.options.forEach((optText, index) => {
    const btn = document.createElement("button");
    btn.className = "mcq-opt-btn";
    btn.innerText = optText;
    btn.addEventListener("click", () => handleAnswer(index));
    optionsList.appendChild(btn);
  });
}

function handleAnswer(selectedIndex) {
  if (selectedIndex === quizQuestions[currentIndex].ans) {
    score++;
  }
  currentIndex++;
  if (currentIndex < quizQuestions.length) {
    loadQuestion();
  } else {
    finishExam(false);
  }
}
// 7. LIVE 60s COUNTDOWN TIMER
function startTimer() {
  clearInterval(timerInterval);
  timerText.innerText = `⏱️ ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.innerText = `⏱️ ${timeLeft}s`;
    if (timeLeft <= 0) {
      finishExam(false);
    }
  }, 1000);
}
// 8. LIVE GUARD ANTI-CHEAT (Tab-Switch Watchman)
document.addEventListener("visibilitychange", function () {
  if (document.hidden && isExamRunning) {
    tabSwitches++;
    if (tabSwitches === 1) {
      cheatBanner.style.display = "block";
      cheatBanner.innerText = "🚨 TAB SWITCH DETECTED! Violation 1/2 — Next switch will AUTO-LOCK your exam!";
    } else if (tabSwitches >= 2) {
      finishExam(true);
    }
  }
});

// 9. FINISH EXAM, LEADERBOARD & ECO PAPER-SAVED COUNTER
function finishExam(wasLocked) {
  isExamRunning = false;
  clearInterval(timerInterval);

  quizArea.style.display = "none";
  resultArea.style.display = "block";

  if (wasLocked) {
    resultHeading.innerText = "🚨 Exam Auto-Locked (Cheating)!";
    resultHeading.style.color = "#ef4444";
    finalScoreText.innerText = `${studentName}, your test was locked due to multiple tab switches.`;
    leaderboardData.push({ name: studentName, score: 0, total: quizQuestions.length, status: "🔴 Flagged" });
  } else {
    resultHeading.innerText = "Assessment Completed! 🎉";
    resultHeading.style.color = "#4ade80";
    finalScoreText.innerText = `${studentName}, you scored ${score} out of ${quizQuestions.length}!`;
    leaderboardData.push({ name: studentName, score: score, total: quizQuestions.length, status: "🟢 Clean" });
  }

  leaderboardData.sort((a, b) => b.score - a.score);

  liveLeaderboard.innerHTML = "<strong>🏆 Live Lab Leaderboard</strong>";
  leaderboardData.forEach((entry, idx) => {
    liveLeaderboard.innerHTML += `
      <div class="lb-row">
        <span>#${idx + 1} ${entry.name}</span>
        <span>${entry.score}/${entry.total} • ${entry.status}</span>
      </div>
    `;
  });

  const sheetsSaved = leaderboardData.length * quizQuestions.length;
  liveLeaderboard.innerHTML += `<div class="eco-banner">🌱 Eco Impact: ${sheetsSaved} A4 Paper Sheets Saved in this Lab Session!</div>`;
}
// 10. TEACHER ADMIN LIVE QUESTION CREATOR
adminNavBtn.addEventListener("click", () => {
  adminModal.style.display = "flex";
  adminMsg.style.display = "none";
});

closeAdminBtn.addEventListener("click", () => {
  adminModal.style.display = "none";
});

addQuestionBtn.addEventListener("click", () => {
  const qText = document.querySelector("#newQInput").value.trim();
  const opt0 = document.querySelector("#opt0Input").value.trim();
  const opt1 = document.querySelector("#opt1Input").value.trim();
  const opt2 = document.querySelector("#opt2Input").value.trim();
  const opt3 = document.querySelector("#opt3Input").value.trim();
  const ansIndex = Number(document.querySelector("#correctAnsSelect").value);

  if (!qText || !opt0 || !opt1 || !opt2 || !opt3) {
    adminMsg.style.display = "block";
    adminMsg.style.color = "#f87171";
    adminMsg.innerText = "⚠️ Please fill the question and all 4 options!";
    return;
  }

  quizQuestions.push({
    q: qText,
    options: [opt0, opt1, opt2, opt3],
    ans: ansIndex
  });

  document.querySelector("#newQInput").value = "";
  document.querySelector("#opt0Input").value = "";
  document.querySelector("#opt1Input").value = "";
  document.querySelector("#opt2Input").value = "";
  document.querySelector("#opt3Input").value = "";

  adminMsg.style.display = "block";
  adminMsg.style.color = "#4ade80";
  adminMsg.innerText = `✅ Added! Total Live Test Questions: ${quizQuestions.length}`;
});
//  NAVBAR LINKS & HERO 'LIVE DEMO GUARD' BUTTON
const navLinks = document.querySelectorAll(".nav-links a");
const demoGuardBtn = document.querySelector(".btn-secondary");

// 'How it works' & 'Features' -> Open Teacher/Student Demo Guide
navLinks[0].addEventListener("click", (e) => {
  e.preventDefault();
  alert("🛡️ How Evalix Works:\n1. Teacher creates custom MCQs in 30s.\n2. Live Guard locks tab switches automatically.\n3. Instant Eco-Leaderboard saves paper & trees!");
});

navLinks[1].addEventListener("click", (e) => {
  e.preventDefault();
  alert("⚡ Evalix Core Features:\n• 2-Strike Tab-Switch Auto-Lock\n• 60s Live Exam Countdown\n• Live Teacher Question Builder\n• Zero-Paper Eco Impact Tracker");
});

// 'Leaderboard' -> Direct Open Live Leaderboard Screen
navLinks[2].addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
  introArea.style.display = "none";
  quizArea.style.display = "none";
  resultArea.style.display = "block";
  resultHeading.innerText = "🏆 Live Lab Leaderboard";
  resultHeading.style.color = "#818cf8";
  finalScoreText.innerText = leaderboardData.length === 0 ? "No tests submitted yet. Click 'Start test' to be #1!" : "Current Lab Integrity Rankings:";
});

// Hero 'Live Demo Guard' Button -> Open Student Exam Modal Directly
demoGuardBtn.addEventListener("click", openModal);
