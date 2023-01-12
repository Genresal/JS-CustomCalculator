// Variables

let displayInput = document.querySelector('#displayInput');
let displayBuffer = document.querySelector('#displayBuffer');

let buttons = document.querySelectorAll('button');
let eraseBtn = document.querySelector('#erase');
let clearBtn = document.querySelector('#clear');
let evaluate = document.querySelector('#evaluate');

displayInput.value = 0;

// Clear

clearBtn.addEventListener("click", () => {
    clearResults();
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

/*function onError(value) {
  error = value;
  displayInput.value = value;
}*/

function inputNumber(value) {
    /*if (error) {
      clearResult();
      error = null;
    }*/
    if (value == ".") {
        if (!displayInput.value.includes('.')) {
            displayInput.value += value;
        }
        
        return;
    }
    
    if (calculator.waitingForSecondOperand || displayInput.value === 0) {
        displayInput.value = value;
        calculator.waitingForSecondOperand = false;
        calculator.secondOperand = 0;
        return;
    }
    displayInput.value += value;
}

function inputOperator(operator) {
    /*if(error) {
    return;*/
  if (calculator.firstOperand == 0) {
      calculator.firstOperand = displayInput.value;
  } else if (calculator.operator && !calculator.waitingForSecondOperand) {
    calculate();
    calculator.firstOperand = displayInput.value;
  }

  calculator.operator = operator;
  displayBuffer.value = `${calculator.firstOperand} ${calculator.operator}`;
  calculator.waitingForSecondOperand = true;
}

function calculate() {
      /*if(error) {
    return;
  }*/
    
    console.log(`${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand}`);
    if (calculator.operator == null || calculator.operator == '=') {
        calculator.firstOperand = displayInput.value;
        inputOperator('=');
        return;
    } else if (calculator.secondOperand != 0) {
        calculator.firstOperand = displayInput.value;
    } else {
        calculator.secondOperand = displayInput.value;
    }

  displayBuffer.value = `${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand}`;

  calculator.selectCommand();

  //if(!error) {
        displayInput.value = calculator.current;
        calculator.firstOperand = calculator.current;
        calculator.waitingForSecondOperand = true;
  //}
}

function clearResults () {
    displayBuffer.value = '';
    displayInput.value = 0;
    
    calculator.clear();
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
    onError("Cannot divide by zero");
    return;
  }

  return x / y;
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
        this.commands.push(command);
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
    }
}

// Listen keyboard keys

document.addEventListener("keydown", function (event) {
  var key = event.key;
  console.log(key)
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
