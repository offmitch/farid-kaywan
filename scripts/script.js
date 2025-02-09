const form = document.querySelector('form')
const mortgageAmountInput = document.querySelector('#mortgage-amount');
const mortgageTermInput = document.querySelector('#mortgage-term');
const interestRateInput = document.querySelector('#interest-rate');
const calculateBtn = document.querySelector('.calculate-btn');
const clearAllBtn = document.querySelector('.clear-all-btn')
const rightContent = document.querySelector('.right-content');
const monthlyPaymentTextContent = document.querySelector('#monthly-repayments')
const totalOverTheTermTextContent = document.querySelector('#total-over-the-term')

mortgageAmountInput.addEventListener('input', () => {
    let value = mortgageAmountInput.value;

    value = value.replace(/,/g, '');
    if (isNaN(value)) {
        mortgageAmountInput.value = "";
        return;
    }
    if (value === "") {
        mortgageAmountInput.value = "";
        return;
    }
    const parentDivChildren = [...mortgageAmountInput.parentNode.parentNode.children]
    if (parentDivChildren.length > 2) {
        // remove o ultimo filho, que sempre vai ser o spanError
        mortgageAmountInput.parentNode.parentNode.removeChild(parentDivChildren.pop())
        mortgageAmountInput.parentNode.classList.toggle('error-div')
    }
    mortgageAmountInput.value = new Intl.NumberFormat('en-US').format(value)
})

document.addEventListener("DOMContentLoaded", function () {
    const inputContainer = document.querySelector(".payment-frequency-container .input-container");
    
    if (!inputContainer) return;
  
    // Create a select element
    const select = document.createElement("select");
    select.id = "payment-frequency";
  
    // Define the options
    const options = [
      "Annually", "Semi-annual", "Quarterly", "Bi-monthly", "Monthly", 
      "Semi-monthly", "Bi-weekly", "Accelerated Bi-weekly", "Accelerated Weekly"
    ];
  
    // Populate the select element with options
    options.forEach(optionText => {
      const option = document.createElement("option");
      option.value = optionText;
      option.textContent = optionText;
      select.appendChild(option);
    });
  
    // Replace the input field with the select element
    const inputField = inputContainer.querySelector("input");
    if (inputField) {
      inputContainer.replaceChild(select, inputField);
    }
  });

mortgageTermInput.addEventListener('input', () => {
    let value = mortgageTermInput.value;

    if (isNaN(value)) {
        mortgageTermInput.value = "";
        return;
    }

    const parentDivChildren = [...mortgageTermInput.parentNode.parentNode.children]
    if (parentDivChildren.length > 2) {
        // remove o ultimo filho, que sempre vai ser o spanError
        mortgageTermInput.parentNode.parentNode.removeChild(parentDivChildren.pop())
        mortgageTermInput.parentNode.classList.toggle('error-div')

    }
})

interestRateInput.addEventListener('input', () => {
    let value = interestRateInput.value;

    if (isNaN(value)) {
        interestRateInput.value = "";
        return;
    }

    const parentDivChildren = [...interestRateInput.parentNode.parentNode.children]
    if (parentDivChildren.length > 2) {
        // remove o ultimo filho, que sempre vai ser o spanError
        interestRateInput.parentNode.parentNode.removeChild(parentDivChildren.pop())
        interestRateInput.parentNode.classList.toggle('error-div')

    }
})





const clearAll = () => {
    mortgageAmountInput.value = ''
    mortgageTermInput.value = ''
    interestRateInput.value = ''

}

clearAllBtn.addEventListener('click', () => {
    clearAll()
    changeRightContent()
})



form.addEventListener('submit', (e) => {
    e.preventDefault();
    const readyToSubmit = checkInputs();

    if (readyToSubmit) {
        const [amount, term, rate] = readyToSubmit;

        const [monthlyPayment, totalRepayOverTheTerm] = calculate(amount, term, rate)

        changeRightContent(monthlyPayment, totalRepayOverTheTerm)
    }
})


function checkInputs() {
    let mortgageAmountValue = mortgageAmountInput.value;
    const mortgageTermValue = mortgageTermInput.value;
    const interestRateValue = interestRateInput.value;
    // const radioInputsList = [...radioInputs]
    if (mortgageAmountValue === '') {
        setErrorFor(mortgageAmountInput);
    }
    if (mortgageTermValue === '') {
        setErrorFor(mortgageTermInput);
    }
    if (interestRateValue === '') {
        setErrorFor(interestRateInput);
    }

    if (mortgageAmountValue === '' && mortgageTermValue === '' && interestRateValue === '') {
        return false
    }

    // retirar a ',' da string que contem o numero
    mortgageAmountValue = mortgageAmountValue.replace(/,/g, '')

    if (isNaN(mortgageAmountValue) || isNaN(mortgageTermValue) || isNaN(interestRateValue)) {
        return false
    }

    const mortgageValues = [parseFloat(mortgageAmountValue), parseInt(mortgageTermValue), parseFloat(interestRateValue)]

    return mortgageValues

}


function changeRightContent(monthlyPayment = null, totalRepayOverTheTerm = null) {
    const children = [...rightContent.children]
    if ((monthlyPayment && totalRepayOverTheTerm) === null) {
        rightContent.classList.toggle('after-reset')

        children[1].classList.toggle('hidden')
        children[0].classList.toggle('hidden')
        return;
    }
    if (children[1].classList.contains('hidden')) {
        rightContent.classList.toggle('after-reset')
        children[1].classList.toggle('hidden')
        children[0].classList.toggle('hidden')
        monthlyPaymentTextContent.innerText = `$${monthlyPayment}`
        totalOverTheTermTextContent.innerText = `$${totalRepayOverTheTerm}`

    }
    else {
        rightContent.classList.toggle('after-reset')

        children[1].classList.toggle('hidden')
        children[0].classList.toggle('hidden')
    }


}

function calculate(amount, term, rate) {
    console.log(amount, term, rate)
    let monthlyPayment;

        const monthlyInterestRate = rate / 12 / 100;
        const numberOfPayments = term * 12;

        monthlyPayment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    
    let totalRepayOverTheTerm = (monthlyPayment * term * 12).toFixed(2);
    monthlyPayment = monthlyPayment.toFixed(2);

    monthlyPayment = new Intl.NumberFormat('en-US').format(monthlyPayment)
    totalRepayOverTheTerm = new Intl.NumberFormat('en-US').format(totalRepayOverTheTerm)

    return [monthlyPayment, totalRepayOverTheTerm]
}

function toggleMenu() {
    let nav = document.querySelector(".nav-links");
    if (nav.style.display === "flex") {
        nav.style.display = "none";
    } else {
        nav.style.display = "flex";
    }
}





