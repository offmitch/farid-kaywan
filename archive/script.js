// Mortgage Calculator logic

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("my-form");
  const mortgageAmountInput = document.getElementById("mortgage-amount");
  const paymentFrequencySelect = document.getElementById("payment-frequency");
  const mortgageTermInput = document.getElementById("mortgage-term");
  const interestRateInput = document.getElementById("interest-rate");
  const amortizationInput = document.getElementById("amortization");
  const clearAllBtn = document.querySelector(".clear-all-btn");

  const beforeResults = document.querySelector(".before-results-container");
  const afterResults = document.querySelector(".after-results-container");
  const monthlyRepaymentsEl = document.getElementById("monthly-repayments");
  const totalOverTermEl = document.getElementById("total-over-the-term");
  const resultsLabel = document.querySelector(
    ".results-monthly-repayments span",
  );

  // Number of payment periods per year for each frequency
  const PERIODS_PER_YEAR = {
    annually: 1,
    "semi-annual": 2,
    quarterly: 4,
    "bi-monthly": 6,
    monthly: 12,
    "semi-monthly": 24,
    "bi-weekly": 26,
    "accelerated-bi-weekly": 26,
    "accelerated-weekly": 52,
  };

  // Human readable label for each frequency, used to relabel the results
  const FREQUENCY_LABELS = {
    annually: "Your annual repayment",
    "semi-annual": "Your semi-annual repayment",
    quarterly: "Your quarterly repayment",
    "bi-monthly": "Your bi-monthly repayment",
    monthly: "Your monthly repayment",
    "semi-monthly": "Your semi-monthly repayment",
    "bi-weekly": "Your bi-weekly repayment",
    "accelerated-bi-weekly": "Your accelerated bi-weekly repayment",
    "accelerated-weekly": "Your accelerated weekly repayment",
  };

  // Format raw digits typed into the mortgage amount field with thousands separators
  mortgageAmountInput.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    if (raw === "") {
      e.target.value = "";
      return;
    }
    const parts = raw.split(".");
    const wholePart = parts[0].replace(/^0+(?=\d)/, "");
    const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    e.target.value =
      parts.length > 1
        ? `${formattedWhole}.${parts[1].slice(0, 2)}`
        : formattedWhole;
  });

  clearAllBtn.addEventListener("click", (e) => {
    e.preventDefault();
    form.reset();
    clearErrors();
    afterResults.classList.add("hidden");
    beforeResults.classList.remove("hidden");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const mortgageAmount = parseFloat(
      mortgageAmountInput.value.replace(/,/g, ""),
    );
    const frequency = paymentFrequencySelect.value;
    const termYears = parseFloat(mortgageTermInput.value);
    const interestRate = parseFloat(interestRateInput.value);
    const amortizationYears = parseFloat(amortizationInput.value);

    const fields = [
      { input: mortgageAmountInput, value: mortgageAmount },
      { input: mortgageTermInput, value: termYears },
      { input: interestRateInput, value: interestRate },
      { input: amortizationInput, value: amortizationYears },
    ];

    let hasError = false;
    fields.forEach(({ input, value }) => {
      if (isNaN(value) || value <= 0) {
        markError(input);
        hasError = true;
      }
    });

    if (hasError) {
      afterResults.classList.add("hidden");
      beforeResults.classList.remove("hidden");
      return;
    }

    const { payment, periodsPerYear } = calculatePayment(
      mortgageAmount,
      interestRate,
      amortizationYears,
      frequency,
    );

    const totalOverTerm = payment * periodsPerYear * termYears;

    resultsLabel.textContent = FREQUENCY_LABELS[frequency] || "Your repayment";
    monthlyRepaymentsEl.textContent = formatCurrency(payment);
    totalOverTermEl.textContent = formatCurrency(totalOverTerm);

    beforeResults.classList.add("hidden");
    afterResults.classList.remove("hidden");
  });

  function calculatePayment(
    principal,
    annualRatePercent,
    amortizationYears,
    frequency,
  ) {
    const annualRate = annualRatePercent / 100;

    // Accelerated frequencies are derived from the monthly payment,
    // then paid on a faster schedule to shorten the amortization.
    if (
      frequency === "accelerated-bi-weekly" ||
      frequency === "accelerated-weekly"
    ) {
      const monthlyPayment = standardPayment(
        principal,
        annualRate,
        amortizationYears,
        12,
      );
      const periodsPerYear = PERIODS_PER_YEAR[frequency];
      const divisor = periodsPerYear === 26 ? 2 : 4;
      return { payment: monthlyPayment / divisor, periodsPerYear };
    }

    const periodsPerYear = PERIODS_PER_YEAR[frequency] || 12;
    const payment = standardPayment(
      principal,
      annualRate,
      amortizationYears,
      periodsPerYear,
    );
    return { payment, periodsPerYear };
  }

  function standardPayment(
    principal,
    annualRate,
    amortizationYears,
    periodsPerYear,
  ) {
    const r = periodicRateFromSemiAnnualCompounding(annualRate, periodsPerYear);
    const n = amortizationYears * periodsPerYear;

    if (r === 0) {
      return principal / n;
    }
    return (principal * r) / (1 - Math.pow(1 + r, -n));
  }

  // Converts a nominal annual rate that compounds semi-annually (the
  // Canadian mortgage convention) into the equivalent periodic rate for
  // whatever payment frequency is being used. This is NOT the same as
  // annualRate / periodsPerYear unless periodsPerYear happens to be 2.
  function periodicRateFromSemiAnnualCompounding(annualRate, periodsPerYear) {
    if (annualRate === 0) {
      return 0;
    }
    const semiAnnualRate = annualRate / 2;
    return Math.pow(1 + semiAnnualRate, 2 / periodsPerYear) - 1;
  }

  function formatCurrency(value) {
    return (
      "$" +
      value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function markError(input) {
    const wrapper = input.closest(".input-container") || input.parentElement;
    wrapper.classList.add("error-div");
    const msg = wrapper.parentElement.querySelector(".error-msg");
    if (msg) msg.classList.remove("hidden");
  }

  function clearErrors() {
    document
      .querySelectorAll(".error-div")
      .forEach((el) => el.classList.remove("error-div"));
    document
      .querySelectorAll(".error-msg")
      .forEach((el) => el.classList.add("hidden"));
  }
});
