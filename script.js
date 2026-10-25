// Module 1: Eligibility Checker Logic
document.getElementById('loanForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const age = parseInt(document.getElementById('custAge').value);
  const income = parseFloat(document.getElementById('custIncome').value);
  const existingEmi = parseFloat(document.getElementById('custObligations').value);
  const loan = parseFloat(document.getElementById('custLoan').value);
  const out = document.getElementById('loanOutput');

  const estEmi = (loan * 0.10) / 12; // estimated monthly obligation
  const dti = ((existingEmi + estEmi) / income) * 100;

  if (age < 21 || age > 65) {
    out.className = 'result rejected';
    out.innerHTML = '<strong>Application Declined:</strong> Applicant must be between 21 and 65 years old for standard lending criteria.';
  } else if (dti > 55) {
    out.className = 'result rejected';
    out.innerHTML = `<strong>High Risk (DTI: ${dti.toFixed(1)}%):</strong> Permissible debt-to-income limit exceeded (>50%). Consider reducing existing debt or increasing tenure.`;
  } else if (dti <= 35) {
    out.className = 'result approved';
    out.innerHTML = `<strong>Loan Pre-Approved:</strong> Excellent debt ratio of ${dti.toFixed(1)}%. You qualify for instant processing and prime interest rates.`;
  } else {
    out.className = 'result review';
    out.innerHTML = `<strong>Conditional Approval (DTI: ${dti.toFixed(1)}%):</strong> Moderate risk profile. Additional guarantor or collateral verification required.`;
  }
});

// Module 2: Credit Analyzer Logic
document.getElementById('riskForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const score = parseInt(document.getElementById('creditScore').value);
  const history = document.getElementById('repayHistory').value;
  const out = document.getElementById('riskOutput');

  if (score >= 750 && history === 'good') {
    out.className = 'result approved';
    out.innerHTML = '<strong>Tier 1 - Prime Risk Profile:</strong> 95%+ approval probability. Est. APR: 7.2% - 8.5%.';
  } else if (score >= 650 && history !== 'poor') {
    out.className = 'result review';
    out.innerHTML = '<strong>Tier 2 - Moderate Risk Profile:</strong> Standard underwriting needed. Est. APR: 9.5% - 12.0%. Keep credit utilization under 30%.';
  } else {
    out.className = 'result rejected';
    out.innerHTML = '<strong>Subprime / Elevated Credit Risk:</strong> High default probability. High APR applies (14%+). Clear existing dues before re-applying.';
  }
});

// Module 3: EMI Calculation Formula
function calculateEMI() {
  const P = parseFloat(document.getElementById('emiPrincipal').value) || 0;
  const rate = parseFloat(document.getElementById('emiRate').value) || 0;
  const years = parseFloat(document.getElementById('emiTenure').value) || 0;

  if (P <= 0 || rate <= 0 || years <= 0) return;

  const r = rate / (12 * 100);
  const n = years * 12;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - P;

  document.getElementById('resEmi').innerText = '$' + emi.toFixed(2);
  document.getElementById('resInterest').innerText = '$' + interest.toFixed(2);
  document.getElementById('resTotal').innerText = '$' + total.toFixed(2);
}
calculateEMI();

// Module 4: Claude AI Recommendations Logic
function getAIAdvice() {
  const q = document.getElementById('aiQuery').value.toLowerCase();
  const out = document.getElementById('aiOutput');
  out.style.display = 'block';

  if (!q.trim()) {
    out.innerText = 'Claude AI: Please describe your financial situation or question above to get tailored insights.';
    return;
  }

  if (q.includes('dti') || q.includes('debt') || q.includes('ratio')) {
    out.innerHTML = '<strong>Claude AI Recommendation:</strong><br/>1. Consolidate high-interest unsecured revolving credit into a fixed installment loan.<br/>2. Refrain from taking new credit lines within 60 days before applying.<br/>3. Prioritize paying off debts with monthly obligations over $200 first to immediately free up DTI capacity.';
  } else if (q.includes('score') || q.includes('credit')) {
    out.innerHTML = '<strong>Claude AI Recommendation:</strong><br/>1. Keep revolving credit utilization under 10% on reporting dates.<br/>2. Never close old credit card accounts; length of credit history accounts for 15% of your score.<br/>3. Automate minimum payments to prevent 30-day delinquency marks.';
  } else {
    out.innerHTML = '<strong>Claude AI Recommendation:</strong><br/>Aim to follow the 50/30/20 rule: 50% for fixed needs/EMIs, 30% for discretionary wants, and 20% dedicated directly to savings and debt reduction. Maintain at least 3 months of emergency reserves before committing to high-tenure loans.';
  }
}
