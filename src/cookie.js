/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };
  if (options.expires && options.expires.toUTCString) {
    options.expires = options.expires.toUTCString();
  }
  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {'max-age': -1});
}

function addCookieInTable(cookieName, cookieValue) {
  let tr = document.createElement('tr');
  let tdName = document.createElement('td');
  tdName.textContent = cookieName;
  tr.append(tdName);
  let tdValue = document.createElement('td');
  tdValue.textContent = cookieValue;
  tr.append(tdValue);
  let tdButton = document.createElement('td');
  let button = document.createElement('button');
  button.textContent = "Удалить";
  button.addEventListener('click', function() {
    tr.remove();
    deleteCookie(cookieName);
  })
  tdButton.append(button);
  tr.append(tdButton);
  listTable.append(tr);
}

function showCookies(filter = "") {
  listTable.innerHTML = "";
  let cookies = document.cookie.split('; ');
  cookies.forEach(function(cookie) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName && (cookieName.indexOf(filter) !== -1 || cookieValue.indexOf(filter) !== -1)) {
      addCookieInTable(cookieName, cookieValue);
    }
  })
}

function addCookie(cookieName, cookieValue) {
  let isExists = false;
  let trForDelete = null;
  for(const tr of listTable.children) {
    for(const td of tr.children) {
      if (td.textContent === cookieName) {
        td.nextElementSibling.textContent = cookieValue;
        isExists = true;
        trForDelete = tr;
      }
    }
  }
  if(!isExists && (cookieValue.indexOf(filterNameInput.value) !== -1 || !filterNameInput.value)) {
    addCookieInTable(cookieName, cookieValue);
  } else if (trForDelete && cookieValue.indexOf(filterNameInput.value) === -1) {
    trForDelete.remove();
  }
}

filterNameInput.addEventListener('keyup', function(e) {
  // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
  showCookies(e.target.value);
});

addButton.addEventListener('click', (e) => {
  // здесь можно обработать нажатие на кнопку "добавить cookie"
  const [cookieName, cookieValue] = [addNameInput.value, addValueInput.value];
  document.cookie = `${cookieName}=${cookieValue}`;
  addCookie(cookieName, cookieValue);
});

showCookies();
