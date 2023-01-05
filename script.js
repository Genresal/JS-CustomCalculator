// This function clear all the values
function clearScreen() {
        document.getElementById("result").value = "";
    }

    function backspace() {
        var p = document.getElementById("result").value;
        document.getElementById("result").value = p.str.slice(0, -1);
    }
     
    // This function display values
    function display(value) {
        document.getElementById("result").value += value;
    }
     
    // This function evaluates the expression and returns result
    function calculate() {
        var p = document.getElementById("result").value;
        var q = eval(p);
        document.getElementById("result").value = q;
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
