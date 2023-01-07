const calculator = {
  value: null,
  firstOperand: null,
  secondOperand: null,
  operator: null,
waitingForSecondOperand: false,
};

const displayValue = document.getElementById('displayValue');
const displayOperator = document.getElementById('displayOperator');

function add(x, y) { return x + y; }
function sub(x, y) { return x - y; }
function mul(x, y) { return x * y; }
function div(x, y) { return x / y; }

var Command = function (execute, undo, value) {
    this.execute = execute;
    this.undo = undo;
    this.value = value;
}

var AddCommand = function (value) {
    return new Command(add, sub, value);
};

var SubCommand = function (value) {
    return new Command(sub, add, value);
};

var MulCommand = function (value) {
    return new Command(mul, div, value);
};

var DivCommand = function (value) {
    return new Command(div, mul, value);
};


function clearScreen() {
    displayValue.value = "";
    displayOperator.value = "";
    calculator = null;
    }

function moveToOperator(operator) {
    if (calculator.firstOperand == null) {
        calculator.firstOperand = displayValue.value;
    }
        calculator.operator = operator;
        displayOperator.value = `${calculator.firstOperand} ${calculator.operator}`;
    calculator.waitingForSecondOperand = true;
}

    function backspace() {
        var p = document.getElementById("result").value;
        document.getElementById("result").value = p.str.slice(0, -1);
    }

    function display(value) {
        if (calculator.waitingForSecondOperand) {
            displayValue.value = value;
            calculator.waitingForSecondOperand = false;
        } else {
            displayValue.value += value;
        }
    }

    // This function evaluates the expression and returns result
    function calculate() {
        if (calculator.secondOperand != null) {
            calculator.firstOperand = displayValue.value
        } else {
            calculator.secondOperand = displayValue.value;
}
        
        displayOperator.value = `${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand}`;
        var q = eval(displayOperator.value);
        displayValue.value = q;
    }

  document.addEventListener('keydown', function(event) {
      console.log('pressedButton ' + event.code)
    if (event.code.startsWith('Digit')) {
        document.getElementById(event.code.at(-1)).click();
    } else if (event.code.startsWith('Numpad') && event.code.length == 7) {
        document.getElementById(event.code.at(-1)).click();
    } else if (event.code === 'Backspace') {
        console.log('fires Backspace')
        document.getElementById('backspace').click();
    } else if (['Equal', 'Enter', 'NumpadEnter'].includes(event.code)) {
        console.log('fires result')
        document.getElementById('enter').click();
    } else if (event.code === 'NumpadAdd') {
        console.log('fires add')
        document.getElementById('add').click();
    } else if (['NumpadSubtract', 'Minus'].includes(event.code)) {
        console.log('fires minus')
        document.getElementById('subtract').click();
    } else if (event.code === 'NumpadDivide') {
        console.log('fires divide')
        document.getElementById('divide').click();
    } else if (event.code === 'NumpadMultiply') {
        console.log('fires mul')
        document.getElementById('multiply').click();
    } else if (event.code === 'Period') {
        console.log('fires per')
        document.getElementById('period').click();
    } else if (event.code === 'NumpadDecimal') {
        console.log('fires ce')
        document.getElementById('ce').click();
    } 
      else if (event.code === 'Digit9') {
        console.log('pressed9')
      document.getElementById('9').click();
    }
});
