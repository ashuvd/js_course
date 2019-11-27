/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
 const newDiv = document.createElement('div');
 homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
 const newDiv = createDiv();
 homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
  function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
  }
  function generateColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  let element = document.createElement('div');
  element.classList.add('draggable-div');
  let styleWidth = randomNumber(15, 200);
  let styleHeight = randomNumber(15, 200);
  element.style.width = styleWidth + 'px';
  element.style.height = styleHeight + 'px';
  element.style.backgroundColor = generateColor();
  element.style.position = 'absolute';
  element.style.top = randomNumber(0, homeworkContainer.offsetHeight - styleHeight) + 'px';
  element.style.left = randomNumber(0, homeworkContainer.offsetWidth - styleWidth) + 'px';
  return element;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
 const newDiv = createDiv();
 homeworkContainer.appendChild(newDiv);
 addListeners(newDiv);
 */
function addListeners(target) {
  function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
      top: box.top,
      left: box.left,
      width: box.width,
      height: box.height
    };
  }

  target.addEventListener('mousedown', (e) => {
    let shiftX = e.pageX - getCoords(target).left; // смещение от левой стены фигуры до курсора, нужно чтобы при нажатии на фигуру она не дергалась
    let shiftY = e.pageY - getCoords(target).top; // смещение от верхней стены фигуры до курсора, нужно чтобы при нажатии на фигуру она не дергалась
    let borderRight = getCoords(homeworkContainer).width - getCoords(target).width; // для того чтобы не вылезала фигура за контейнер
    let borderBottom = getCoords(homeworkContainer).height - getCoords(target).height; // для того чтобы не вылезала фигура за контейнер

    move(e);

    function move(e) {
      let coordX = e.pageX - getCoords(homeworkContainer).left - shiftX; // левая стена фигуры
      let coordY = e.pageY - getCoords(homeworkContainer).top - shiftY; // верхняя стена фигуры

      // при нажатии на фигуру и при движении мышкой мы обновляем координаты фигуры - получается drag and drop
      target.style.left = coordX + 'px';
      target.style.top = coordY + 'px';

      // условия нужны чтобы не вылезти за пределы контейнера
      if (coordX < 0) {
        target.style.left = 0 + 'px';
      }

      if (coordX > borderRight) {
        target.style.left = borderRight + 'px';
      }

      if (coordY < 0) {
        target.style.top = 0 + 'px';
      }

      if (coordY > borderBottom) {
        target.style.top = borderBottom + 'px';
      }
    }

    document.onmousemove = function (e) {
      move(e);
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };

    target.ondragstart = function () { // отменяем втсроенный drag and drop чтобы не было конфликтов
      return false;
    };

  })
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  // создать новый div
  const div = createDiv();

  // добавить на страницу
  homeworkContainer.appendChild(div);
  // назначить обработчики событий мыши для реализации D&D
  addListeners(div);
  // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
  // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
  createDiv
};
