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
};
