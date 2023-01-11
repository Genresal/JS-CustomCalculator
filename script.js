const displayElement = document.getElementById('displayElement');
const displayBuffer = document.getElementById('displayBuffer');
displayElement.value = 0;

var current = 0;
var firstOperand = 0;
var secondOperand = 0;
var operator = null;
var waitingForSecondOperand = false;
const commands = [];
var error = null;

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

function execute(command) {
  current = command.execute(firstOperand, secondOperand);
  commands.push(command);
}

function undo () {
  const command = commands.pop();
  current = command.undo(current, secondOperand);
}

function inputOperator(operator) {
  if(error) {
    return;
  } else if (operator == '=') {
    displayBuffer.value = `${firstOperand} ${operator}`;
    return;
  } else if (firstOperand == 0) {
    firstOperand = displayElement.value;
  } else if (this.operator && !waitingForSecondOperand) {
    calculate();
    firstOperand = displayElement.value;
  }

  this.operator = operator;
  displayBuffer.value = `${firstOperand} ${operator}`;
  waitingForSecondOperand = true;
}

function inputDigit(value) {
    if(error) {
        clearResult();
        error = null;
    }

  if (waitingForSecondOperand || displayElement.value == 0) {
    displayElement.value = value;
    waitingForSecondOperand = false;
    secondOperand = 0;
  } else {
    displayElement.value += value;
  }
}

function inputDecimalPoint(value) {
    if (displayElement.value.charAt(displayElement.value.length-1) == '.') {
        return;
    }
    
    inputDigit(value);
}

function onError(value) {
  error = value;
  displayElement.value = value;
}

function calculate() {
  if(error) {
    return;
  }

    console.log(`${firstOperand} ${operator} ${secondOperand}`);
    if (operator == null || operator == '=') {
      firstOperand = displayElement.value;
      inputOperator('=');
      return;
    } else if (secondOperand != 0) {
    firstOperand = displayElement.value;
  } else {
    secondOperand = displayElement.value;
  }

  displayBuffer.value = `${firstOperand} ${operator} ${secondOperand}`;

  selectCommandByOperator(operator)

  if(!error) {
    displayElement.value = current;
    firstOperand = current;
      waitingForSecondOperand = true;
  }

}

function backspace() {
  displayBuffer.value = "";
  firstOperand = 0;
  secondOperand = 0;
  operator = 0;
}

function clearResult() {
  displayElement.value = 0;
  displayBuffer.value = "";

  firstOperand = 0;
  secondOperand = 0;
  operator = null;
  waitingForSecondOperand = false;
}

function selectCommandByOperator(operator) {
  switch (operator) {
    case "+":
      execute(AddCommand());
      break
    case "-":
      execute(SubCommand());
      break
    case "*":
      execute(MulCommand());
      break
    case "/":
      execute(DivCommand());
      break
    case "=":
        execute(DivCommand());
        break
    default:
      console.log("Unexpected opration.");
  }
}

document.addEventListener("keydown", function (event) {
  var key = event.key;
  console.log(key)
  var parsed = parseInt(key);
  if (Number.isInteger(parsed)) {
    inputDigit(key);
  } else {
    switch (key) {
      case '.':
        inputDecimalPoint(key);
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
