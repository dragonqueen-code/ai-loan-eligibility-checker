"use strict";

// Educational estimates only. This app does not make real lending decisions.

const formatRupees = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

function calculateMonthlyEmi(principal, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 1200;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

// Module 1: Loan estimate
document.getElementById("loanForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const age = Number(document.getElementById("custAge").value);
  const income = Number(document.getElementById("custIncome").value);
  const existingEmi = Number(
    document.getElementById("custObligations").value
  );
  const loan = Number(document.getElementById("custLoan").value);
  const rate = Number(document.getElementById("custRate").value);
  const years = Number(document.getElementById("custTenure").value);
  const output = document.getElementById("loanOutput");

  if (
    !Number.isFinite(age) ||
    !Number.isFinite(income) ||
    !Number.isFinite(existingEmi) ||
    !Number.isFinite(loan) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(years) ||
    income <= 0 ||
    existingEmi < 0 ||
    loan <= 0 ||
    rate <= 0 ||
    years <= 0
  ) {
    output.className = "result rejected";
    output.textContent = "Please enter valid values in all required fields.";
    return;
  }

  if (age < 18 || age > 75) {
    output.className = "result rejected";
    output.textContent =
      "This estimate supports applicants aged 18 to 75. Lender rules may differ.";
    return;
  }

  const proposedEmi = calculateMonthlyEmi(loan, rate, years);
  const dti = ((existingEmi + proposedEmi) / income) * 100;

  if (dti > 50) {
    output.className = "result rejected";
    output.textContent =
      `Estimated EMI: ${formatRupees(proposedEmi)}. ` +
      `Estimated debt-to-income ratio: ${dti.toFixed(1)}%. ` +
      "This is above the demo's 50% guideline. Consider a smaller loan or longer tenure.";
  } else if (dti <= 35) {
    output.className = "result approved";
    output.textContent =
      `Estimated EMI: ${formatRupees(proposedEmi)}. ` +
      `Estimated debt-to-income ratio: ${dti.toFixed(1)}%. ` +
      "This is within the demo's 35% guideline. It is not a loan approval.";
  } else {
    output.className = "result review";
    output.textContent =
      `Estimated EMI: ${formatRupees(proposedEmi)}. ` +
      `Estimated debt-to-income ratio: ${dti.toFixed(1)}%. ` +
      "This falls in the demo's review range. Lender rules may differ.";
  }
});

// Module 2: Credit score display and general guidance
const creditScore = document.getElementById("creditScore");
const scoreValue = document.getElementById("scoreVal");

creditScore.addEventListener("input", () => {
  scoreValue.textContent = creditScore.value;
});

document.getElementById("riskForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const score = Number(creditScore.value);
  const history = document.getElementById("repayHistory").value;
  const output = document.getElementById("riskOutput");

  if (score >= 750 && history === "good") {
    output.className = "result approved";
    output.textContent =
      "This demo indicates a stronger credit profile. Lenders consider other information too.";
  } else if (score >= 650 && history !== "poor") {
    output.className = "result review";
    output.textContent =
      "This demo indicates a profile that may need review. Paying bills on time can help build a positive payment history.";
  } else {
    output.className = "result rejected";
    output.textContent =
      "This demo indicates areas to improve. Consider paying dues on time and reviewing your credit report. This is not a lender decision.";
  }
});

// Module 3: EMI calculator
function updateEmiCalculator() {
  const principal = Number(document.getElementById("emiPrincipal").value);
  const rate = Number(document.getElementById("emiRate").value);
  const years = Number(document.getElementById("emiTenure").value);

  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(years) ||
    principal <= 0 ||
    rate <= 0 ||
    years <= 0
  ) {
    return;
  }

  const emi = calculateMonthlyEmi(principal, rate, years);
  const totalPayable = emi * years * 12;
  const totalInterest = totalPayable - principal;

  document.getElementById("resEmi").textContent = formatRupees(emi);
  document.getElementById("resInterest").textContent =
    formatRupees(totalInterest);
  document.getElementById("resTotal").textContent =
    formatRupees(totalPayable);
}

document
  .getElementById("btnCalculateEmi")
  .addEventListener("click", updateEmiCalculator);

updateEmiCalculator();

// Module 4: Preset general tips (not connected to Claude AI)
document
  .getElementById("btnGetAiAdvice")
  .addEventListener("click", () => {
    const question = document
      .getElementById("aiQuery")
      .value.trim()
      .toLowerCase();
    const output = document.getElementById("aiOutput");

    output.style.display = "block";

    if (!question) {
      output.textContent = "Enter a question to see a general financial tip.";
    } else if (
      question.includes("dti") ||
      question.includes("debt") ||
      question.includes("ratio")
    ) {
      output.textContent =
        "General tip: Review your monthly debt payments and avoid taking on new debt you cannot comfortably repay.";
    } else if (
      question.includes("score") ||
      question.includes("credit")
    ) {
      output.textContent =
        "General tip: Pay bills on time and review your credit report for errors. Credit scoring rules vary.";
    } else {
      output.textContent =
        "General tip: Compare loan offers, understand the total repayment amount, and keep an emergency fund where possible.";
    }
  });
