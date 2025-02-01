const form = document.querySelector('form')
const mortgageAmountInput = document.querySelector('#mortgage-amount');
const mortgageTermInput = document.querySelector('#mortgage-term');
const interestRateInput = document.querySelector('#interest-rate');
const radioInputs = document.querySelectorAll('input[type="radio"]');
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

for (const radioInput of radioInputs) {

    radioInput.addEventListener('input', () => {


        const parentDivChildren = [...radioInput.parentNode.parentNode.children]
        console.log(parentDivChildren)
        if (parentDivChildren.length > 3) {
            // remove o ultimo filho, que sempre vai ser o spanError
            radioInput.parentNode.parentNode.removeChild(parentDivChildren.pop())

        }
    })
}





const clearAll = () => {
    mortgageAmountInput.value = ''
    mortgageTermInput.value = ''
    interestRateInput.value = ''
    for (const radioInput of radioInputs) {
        radioInput.checked = false;
    }
}

clearAllBtn.addEventListener('click', () => {
    clearAll()
    changeRightContent()
})



form.addEventListener('submit', (e) => {
    e.preventDefault();
    const readyToSubmit = checkInputs();

    if (readyToSubmit) {
        const [amount, term, rate, type] = readyToSubmit;

        const [monthlyPayment, totalRepayOverTheTerm] = calculate(amount, term, rate, type)

        changeRightContent(monthlyPayment, totalRepayOverTheTerm)
    }
})
function checkRadioInputs() {
    const mortgageTypeInputChecked = document.querySelector('input[name = "mortgage-type"]:checked');

    return mortgageTypeInputChecked
}


function checkInputs() {
    let mortgageAmountValue = mortgageAmountInput.value;
    const mortgageTermValue = mortgageTermInput.value;
    const interestRateValue = interestRateInput.value;
    const radioInputsList = [...radioInputs]
    if (mortgageAmountValue === '') {
        setErrorFor(mortgageAmountInput);
    }
    if (mortgageTermValue === '') {
        setErrorFor(mortgageTermInput);
    }
    if (interestRateValue === '') {
        setErrorFor(interestRateInput);
    }
    const radioInputChecked = checkRadioInputs()
    if (!radioInputChecked) {
        setErrorFor(radioInputsList[1])
    }

    if (mortgageAmountValue === '' && mortgageTermValue === '' && interestRateValue === '' && !radioInputChecked) {
        return false
    }

    // retirar a ',' da string que contem o numero
    mortgageAmountValue = mortgageAmountValue.replace(/,/g, '')

    if (isNaN(mortgageAmountValue) || isNaN(mortgageTermValue) || isNaN(interestRateValue)) {
        return false
    }

    const mortgageValues = [parseFloat(mortgageAmountValue), parseInt(mortgageTermValue), parseFloat(interestRateValue), radioInputChecked.value]

    return mortgageValues

}

function setErrorFor(input) {

    const parentDiv = input.parentNode
    const inputType = input.getAttribute('type');
    const spanMsg = document.createElement('span');
    spanMsg.classList.add('error-msg');
    spanMsg.innerText = 'This field is required';
    if (inputType === 'radio') {
        const hasSpanErrorMsg = parentDiv.parentNode.childElementCount > 3;

        if (hasSpanErrorMsg) {
            return
        }
        parentDiv.after(spanMsg);

    }
    else {
        const hasSpanErrorMsg = parentDiv.parentNode.childElementCount > 2;
        if (hasSpanErrorMsg) {
            return
        }
        parentDiv.classList.toggle('error-div')
        parentDiv.after(spanMsg);

    }


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

function calculate(amount, term, rate, type) {
    console.log(amount, term, rate, type)
    let monthlyPayment;
    if (type === 'repayment') {

        const monthlyInterestRate = rate / 12 / 100;
        const numberOfPayments = term * 12;

        monthlyPayment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    } else if (type === 'interest-only') {

        monthlyPayment = amount * (rate / 100);
    }
    let totalRepayOverTheTerm = (monthlyPayment * term * 12).toFixed(2);
    monthlyPayment = monthlyPayment.toFixed(2);

    monthlyPayment = new Intl.NumberFormat('en-US').format(monthlyPayment)
    totalRepayOverTheTerm = new Intl.NumberFormat('en-US').format(totalRepayOverTheTerm)

    return [monthlyPayment, totalRepayOverTheTerm]
}



