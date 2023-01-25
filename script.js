//Imports
//const calculator = require('./calculator');
import { calculator } from './calculator.js';

// Variables
let displayInput = document.querySelector('#displayInput');
let displayBuffer = document.querySelector('#displayBuffer');

let buttons = document.querySelectorAll('button');
let clearBtn = document.querySelector('#сlear');

// Clear
clearBtn.addEventListener("click", () => {
if (clearBtn.textContent == 'C') {
    clearResults();
} else {
    calculator.waitingForSecondOperand ? displayInput.value = 0 : clearResults();    
    clearBtn.textContent = 'C';                   
}
});

// Buttons
buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        // When number button clicked
        if(btn.classList.contains('num-btn')) {
            inputNumber(btn.value)  
        }    
        
        // When operator button clicked
        if (btn.id.match('op')) {
            inputOperator(btn.value)
        }
        
        // When evaluate button clicked
        if (btn.id.match('evaluate')) {
            calculate(displayInput.value);
        }
        
        // When erase button clicked
        if (btn.id.match('erase')) {
            erase();
        }
        
        // When switch sign button clicked
        if (btn.value == '+/-') {
            displayInput.value = -displayInput.value;
        }
        
        // When percent button clicked
        if (btn.value == '%') {
            var result = calculator.percent(displayInput.value);
            if (result != null) {
                displayInput.value = result;
                renderBuffer();
            }
        }
        
        // When 1/x button clicked
        if (btn.value == '1/x') {
            calculator.setExpression(1, displayInput.value, '/');
            calculate();
        }
        
        // When square button clicked
        if (btn.value == '2√x') {
            calculator.setExpression(displayInput.value, 2, '√');
            calculate();
        }
        
        // When pow button clicked
        if (btn.value == 'x^2') {
            calculator.setExpression(displayInput.value, 2, '^');
            calculate();
        }

        // When  button clicked
        if (btn.value == '3√x') {
            calculator.setExpression(displayInput.value, 3, '√');
            calculate();
        }
              
        // When  button clicked
        if (btn.value == 'x^3') {
            calculator.setExpression(displayInput.value, 3, '^');
            calculate();
        }

        // When  button clicked
        if (btn.value == '10^x') {
            calculator.setExpression(10, displayInput.value, '^');
            calculate();
        }
        
        // When factorial button clicked
        if (btn.value == 'n!') {
            calculator.setFirstOperand(displayInput.value);
            calculator.setOperator('!');
            calculate();
        }
        
        // When MC button clicked
        if (btn.value == 'MC') {
            memory.clear();
        }
        
        // When M+ button clicked
        if (btn.value == 'M+') {
            memory.add(displayInput.value);
        }
        
        // When M- button clicked
        if (btn.value == 'M-') {
            memory.sub(displayInput.value);
        }
        
        // When MR button clicked
        if (btn.value == 'MR') {
            displayInput.value = memory.recall();
        }
    })
})

// Functions
function inputNumber(value) {
    if (calculator.error) {
        clearResult();
        calculator.clear();
    }
    
    if (value == ".") {
        if (!displayInput.value.includes('.')) {
            displayInput.value += value;
        }
        return;
    }
    
    clearBtn.textContent = 'CE';  
    
    if (calculator.waitingForSecondOperand || displayInput.value == '0') {
        displayInput.value = value;
        calculator.setWaitingFlag(false);
        calculator.setSecondOperand(0);
        return;
    }

    displayInput.value += value;
}

function inputOperator(operator) {
    if(calculator.error) {
        return;
    }
    
    if (calculator.firstOperand == 0) {
        calculator.setFirstOperand(displayInput.value);
    } else if (calculator.operator && !calculator.waitingForSecondOperand) {
        calculate(displayInput.value);
        calculator.setFirstOperand(displayInput.value);
        calculator.setSecondOperand(0);
    }

    calculator.setOperator(operator);
    renderBuffer();
    calculator.setWaitingFlag(true);
}

function calculate(input) {
    if(calculator.error) {
        clearResults();
        return;
    }
    
    if (!calculator.operator) {
        return;
    }
    
    console.log(calculator.getExpression());

    renderBuffer();
    displayInput.value = calculator.selectCommand(input);
}

function clearResults () {
    displayBuffer.value = '';
    displayInput.value = 0;
    
    calculator.clear();
}

function erase () {
    if (displayInput.value.length > 1) {
        displayInput.value = displayInput.value.slice(0, displayInput.value.length -1);
    } else {
        displayInput.value = 0;
    }
}

function renderBuffer() {
    displayBuffer.value = calculator.getExpression();
}
/*
// Commands
function add(x, y) {
    return parseFloat(x) + parseFloat(y);
}

function sub(x, y) {
    return x - y;
}

function mul(x, y) {
    return x * y;
}

function div(x, y) {
    if (y == 0) {
        return "Cannot divide by zero";
    }

    return x / y;
}

function pow(base, exponent) {
    let result = 1;
    for (let i = 0; i < exponent; i++) {
        result *= base;
    }
    
    return result;
}

function root(value, root) {
    return value ** (1/root);
}

function factorial(n, x) {
    let result = 1;
    for (let i = n; i > 1; i--) {
        result *= i;
    }
    console.log("fact")
    return result;
}

function unfactorial(n, x) {
    let i = 1;
    while(n > 1){
        n = n/i;
        i++;
    }
    
    return i-1;
}

const Command = function (execute, undo) {
  this.execute = execute;
  this.undo = undo;
}

const AddCommand = function () {
  return new Command(add, sub);
}

const SubCommand = function () {
  return new Command(sub, add);
}

const MulCommand = function () {
  return new Command(mul, div);
}

const DivCommand = function () {
  return new Command(div, mul);
}

const PowerCommand = function () {
  return new Command(pow, root);
}

const RootCommand = function () {
  return new Command(root, pow);
}

const FactorialCommand = function () {
  return new Command(factorial, unfactorial);
}

const UnFactorialCommand = function () {
  return new Command(unfactorial, factorial);
}

// Calculator
const calculator = {
    current: 0,
    firstOperand: 0,
    secondOperand: 0,
    operator: null,
    waitingForSecondOperand: false,
    commands: [],
    error: null,
    
    execute: function (command) {
        this.current = command.execute(this.firstOperand, this.secondOperand);
        if(isNaN(this.current)) {
            this.error = this.current;
            this.current = 0;
        }
        
        this.commands.push(command);
        
        this.firstOperand = this.current;
        this.waitingForSecondOperand = true;
    },
    undo: function () {
        const command = this.commands.pop();
        this.current = command.undo(current, this.secondOperand);
    },
    selectCommand: function (input) {
        if (input !== undefined) {
            if (this.secondOperand != 0) {
                this.setFirstOperand(input);
            } else {
                this.setSecondOperand(input);
            }
        }
        
        switch (this.operator) {
            case "+":
                this.execute(AddCommand());
                break
            case "-":
                this.execute(SubCommand());
                break
            case "*":
                this.execute(MulCommand());
                break
            case "/":
                this.execute(DivCommand());
                break
            case "^":
                this.execute(PowerCommand());
                break
            case "√":
                this.execute(RootCommand());
                break
            case "!":
                this.execute(FactorialCommand());
                break
            default:
                console.log("Unexpected opration.");
        }

        return this.error ? calculator.error : calculator.current;
    },
    clear: function () {
        this.firstOperand = 0;
        this.secondOperand = 0;
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.error = null;
    },
    getExpression: function () {
        return this.secondOperand == 0 ? 
            `${calculator.firstOperand} ${calculator.operator}` : 
            `${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand}`
    },
    percent: function (value) {
        if (this.firstOperand == 0 || this.operator == null) {
            return;
        }
        switch (this.operator) {
            case '*':
            case '/':
                value = value / 100
                break
            case '+':
            case '-':
                value = this.firstOperand * value / 100
        }
        this.secondOperand = value;
        return value;
    },
    setWaitingFlag: function (value) {
      this.waitingForSecondOperand = value;
    },
    setFirstOperand: function (value) {
      this.firstOperand = value;
    },
    setSecondOperand: function (value) {
      this.secondOperand = value;
    },
    setOperator: function (value) {
      this.operator = value;
    },
    setExpression: function (firstValue, secondValue, operator) {
        this.setFirstOperand(firstValue);
        this.setSecondOperand(secondValue);
        this.setOperator(operator);
    },
}
*/
// Memory
const memory = {
    current: 0,

    clear: function () {
        this.current = 0;
    },
    set: function (input) {
        this.current = input;
    },
    add: function (value) {
        this.current = Number(this.current) + Number(value);
    },
    sub: function (value) {
        this.current = Number(this.current) - Number(value);
    },
    recall: function () {
        return this.current;
    },
}

// Listen keyboard keys
document.addEventListener("keydown", function (event) {
  var key = event.key;
  var parsed = parseInt(key);
  if (Number.isInteger(parsed)) {
    inputNumber(key);
  } else {
    switch (key) {
      case '.':
        inputNumber(key);
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        inputOperator(key);
        break;
      case 'Enter':
      case '=':
        calculate();
        break;
  }}
});

module.exports = {
  add: add,
  sub: sub,
  mul: mul,
  div: div,
  calculator: calculator,
}
