// Variables
let displayInput = document.querySelector('#displayInput');
let displayBuffer = document.querySelector('#displayBuffer');

let buttons = document.querySelectorAll('button');
let eraseBtn = document.querySelector('#erase');
let clearBtn = document.querySelector('#сlear');
let clearEntryBtn = document.querySelector('#сlearEntry');
let evaluate = document.querySelector('#evaluate');

displayInput.value = 0;

// Clear
clearBtn.addEventListener("click", () => {
    clearResults();
})

// CE
clearEntryBtn.addEventListener("click", () => {
    calculator.waitingForSecondOperand ? displayInput.value = 0 : clearResults();
})

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
        
        // When clicked button is evaluate button
        if (btn.id.match('evaluate')) {
            calculate();
        }
        
        if (btn.value == '+/-') {
            displayInput.value = -displayInput.value;
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
    
    if (calculator.waitingForSecondOperand || displayInput.value == '0') {
        displayInput.value = value;
        calculator.waitingForSecondOperand = false;
        calculator.secondOperand = 0;
        return;
    }
    displayInput.value += value;
}

function inputOperator(operator) {
    if(calculator.error) {
        return;
    }
    if (calculator.firstOperand == 0) {
        calculator.firstOperand = displayInput.value;
    } else if (calculator.operator && !calculator.waitingForSecondOperand) {
        calculate();
        calculator.firstOperand = displayInput.value;
        calculator.secondOperand = 0;
    }

    calculator.operator = operator;
    renderBuffer();
    calculator.waitingForSecondOperand = true;
}

function calculate() {
    if(calculator.error) {
        clearResults ();
        return;
    }
    
    if (!calculator.operator) {
        return;
    }
    
    console.log(`${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand}`);
    
    if (calculator.secondOperand != 0) {
        calculator.firstOperand = displayInput.value;
    } else {
        calculator.secondOperand = displayInput.value;
    }

    renderBuffer();
    calculator.selectCommand();
    calculator.error ? displayInput.value = calculator.error : displayInput.value = calculator.current
}

function clearResults () {
    displayBuffer.value = '';
    displayInput.value = 0;
    
    calculator.clear();
}

function renderBuffer() {
    displayBuffer.value = calculator.getExpression();
}

// Commands
export function add(x, y) {
  return parseFloat(x) + parseFloat(y);
}

export function sub(x, y) {
  return x - y;
}

export function mul(x, y) {
  return x * y;
}

export function div(x, y) {
  if (y == 0) {
    return "Cannot divide by zero";
  }

  return x / y;
}

export const Command = function (execute, undo) {
  this.execute = execute;
  this.undo = undo;
}

export const AddCommand = function () {
  return new Command(add, sub);
}

export const SubCommand = function () {
  return new Command(sub, add);
}

export const MulCommand = function () {
  return new Command(mul, div);
}

export const DivCommand = function () {
  return new Command(div, mul);
}

// Calculator
export const calculator = {
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
    selectCommand: function () {
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
            default:
                console.log("Unexpected opration.");
        }
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
    }
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
