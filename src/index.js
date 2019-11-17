/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
  for(let i = 0; i<array.length; i++) {
    fn(array[i], i, array);
  }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
  let newArray = [];
  for(let i = 0; i<array.length; i++) {
    newArray[i] = fn(array[i], i, array);
  }
  return newArray;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
  let i = 0;
  if (!initial) {
    initial = array[0];
    i = 1;
  }
  while (i<array.length) {
    initial = fn(initial, array[i], i, array);
    i++;
  }
  return initial;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
//1 вариант решения
// function upperProps(obj) {
//   let array = [];
//   for(let key in obj) {
//       array.push(key.toUpperCase());
//   }
//   return array;
// }
//2 вариант решения более элегантный
const upperProps = (obj) => Object.keys(obj).map(item => item.toUpperCase());
/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from=0, to=array.length) {
  let newArray = [];
  if (to>array.length) {
    to = array.length;
  }
  if (to<0) {
    if (-to>array.length) {
      to = 0;
    } else {
      to = array.length + to;
    }
  }
  if (from<0) {
    if (-from>array.length) {
      from = 0;
    } else {
      from = array.length + from;
    }
  }
  for(let i = from; i<to; i++) {
    newArray.push(array[i]);
  }
  return newArray;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
const createProxy = (obj) => new Proxy(obj, {
  set(target, prop, value) { // для перехвата записи свойства
    if (typeof value == 'number') {
      target[prop] = value*value;
      return true;
    } else {
      return false;
    }
  }
});

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
