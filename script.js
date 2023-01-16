// Variables
let displayInput = document.querySelector('#displayInput');
let displayBuffer = document.querySelector('#displayBuffer');

let buttons = document.querySelectorAll('button');
let clearBtn = document.querySelector('#сlear');
let clearEntryBtn = document.querySelector('#сlearEntry');

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
        
        // When evaluate button clicked
        if (btn.id.match('evaluate')) {
            calculate();
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
            calculator.setFirstOperand(1);
            calculator.setOperator('/');
            calculate();
        }
        
        // When square button clicked
        if (btn.value == '2√x') {
            calculator.setFirstOperand(displayInput.value);
            calculator.setSecondOperand(2);
            calculator.setOperator('√');
            displayInput.value = calculator.selectCommand();
        }
        
        // When pow button clicked
        if (btn.value == 'x^2') {
            calculator.setFirstOperand(displayInput.value);
            calculator.setSecondOperand(2);
            calculator.setOperator('^');
            displayInput.value = calculator.selectCommand();
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
        calculate();
        calculator.setFirstOperand(displayInput.value);
        calculator.setSecondOperand(0);
    }

    calculator.setOperator(operator);
    renderBuffer();
    calculator.setWaitingFlag(true);
}

function calculate() {
    if(calculator.error) {
        clearResults ();
        return;
    }
    
    if (!calculator.operator) {
        return;
    }
    
    console.log(calculator.getExpression());
    
    if (calculator.secondOperand != 0) {
        calculator.setFirstOperand(displayInput.value);
    } else {
        calculator.setSecondOperand(displayInput.value);
    }

    renderBuffer();
    displayInput.value = calculator.selectCommand();
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
    console.log(base + " " + exponent)
  let result = 1;
  for (let i = 0; i < exponent; i++) {
    result *= base;
  }
  return result;
}

function root(value, root) {
  return value ** (1/root);
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
            case "^":
              this.execute(PowerCommand());
              break
            case "√":
                this.execute(RootCommand());
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
