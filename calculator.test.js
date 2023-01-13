document.body.innerHTML =
    '<div>' +
    ' <button id="сlear" />' +
    ' <button id="сlearEntry" />' +
    '</div>';

const funcs = require('./script');

test("add function should add two numbers", () => {
    expect(funcs.add(2, 3)).toBe(5);
  });
  
  test("sub function should subtract two numbers", () => {
    expect(funcs.sub(5, 3)).toBe(2);
  });

  test("mul function should multiple two numbers", () => {
    expect(funcs.mul(5, 3)).toBe(15);
  });

  test("div function should divide two numbers", () => {
    expect(funcs.div(6, 3)).toBe(2);
  });

  test("div with 0 function should return message", () => {
    expect(funcs.div(5, 0)).toBe("Cannot divide by zero");
  });


  //npm run test