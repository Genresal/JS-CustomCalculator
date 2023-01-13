import { add, sub, mul, div, calculator } from './script';

test("add function should add two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
  
  test("sub function should subtract two numbers", () => {
    expect(sub(5, 3)).toBe(2);
  });

  /*
  test('My first test', () => {
    expect(Math.max(1, 5, 10)).toBe(10);
});

test('My first test222', () => {
    expect(Math.max(1, 6, 10)).toBe(10);
});
*/

  //npm run test