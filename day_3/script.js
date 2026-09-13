const form = document.querySelector('#calculator-form');
const firstNumber = document.querySelector('#first-number');
const operator = document.querySelector('#operator');
const secondNumber = document.querySelector('#second-number');
const result = document.querySelector('#result');
const popup = document.querySelector('#keypad-popup');
const keypad = document.querySelector('.keypad');
const activeFieldLabel = document.querySelector('#active-field');

let activeInput = firstNumber;
const operationNames = { '+': 'Addition (+)', '-': 'Subtraction (−)', '*': 'Multiplication (×)', '/': 'Division (÷)', '%': 'Remainder (%)' };

function openKeypad(input) {
    activeInput = input;
    activeFieldLabel.textContent = input === operator ? 'Choose an operation' : input.labels[0].textContent;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
}

function closeKeypad() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
}

[firstNumber, operator, secondNumber].forEach((input) => input.addEventListener('click', () => openKeypad(input)));

function addValue(value) {
    if (activeInput === operator) {
        if (operationNames[value]) {
            operator.value = value;
            activeInput = secondNumber;
            activeFieldLabel.textContent = 'Second number';
        }
        return;
    }

    if (operationNames[value]) {
        operator.value = value;
        activeInput = secondNumber;
        activeFieldLabel.textContent = 'Second number';
        return;
    }
    if (value === '.' && activeInput.value.includes('.')) return;
    activeInput.value = activeInput.value === '0' && value !== '.' ? value : activeInput.value + value;
}

keypad.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;

    if (action === 'close' || action === 'done') { closeKeypad(); return; }
    if (action === 'clear') { activeInput.value = ''; return; }
    if (action === 'delete') { activeInput.value = activeInput.value.slice(0, -1); return; }
    if (action === 'sign' && activeInput !== operator && activeInput.value) {
        activeInput.value = activeInput.value.startsWith('-') ? activeInput.value.slice(1) : `-${activeInput.value}`;
        return;
    }
    addValue(button.dataset.value);
});

popup.addEventListener('click', (event) => {
    if (event.target.dataset.action === 'close') closeKeypad();
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!firstNumber.value || !secondNumber.value || !operator.value) { result.textContent = 'Complete all fields'; return; }

    const first = Number(firstNumber.value);
    const second = Number(secondNumber.value);
    if (operator.value === '/' && second === 0) { result.textContent = 'Cannot divide by zero'; return; }

    const answers = { '+': first + second, '-': first - second, '*': first * second, '/': first / second, '%': first % second };
    result.textContent = Number(answers[operator.value].toPrecision(12));
});
