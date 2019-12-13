require('./main.scss');
const Handlebars = require('handlebars');
const template = document.querySelector('#balloon-template').textContent;
const render = Handlebars.compile(template);
const placemarkGrey = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjN2I3YjdhIiBkPSJNMTcyLjI2OCA1MDEuNjdDMjYuOTcgMjkxLjAzMSAwIDI2OS40MTMgMCAxOTIgMCA4NS45NjEgODUuOTYxIDAgMTkyIDBzMTkyIDg1Ljk2MSAxOTIgMTkyYzAgNzcuNDEzLTI2Ljk3IDk5LjAzMS0xNzIuMjY4IDMwOS42Ny05LjUzNSAxMy43NzQtMjkuOTMgMTMuNzczLTM5LjQ2NCAwek0xOTIgMjcyYzQ0LjE4MyAwIDgwLTM1LjgxNyA4MC04MHMtMzUuODE3LTgwLTgwLTgwLTgwIDM1LjgxNy04MCA4MCAzNS44MTcgODAgODAgODB6Ij48L3BhdGg+PC9zdmc+";
// const placemarkOrange = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjZmY4MjUzIiBkPSJNMTcyLjI2OCA1MDEuNjdDMjYuOTcgMjkxLjAzMSAwIDI2OS40MTMgMCAxOTIgMCA4NS45NjEgODUuOTYxIDAgMTkyIDBzMTkyIDg1Ljk2MSAxOTIgMTkyYzAgNzcuNDEzLTI2Ljk3IDk5LjAzMS0xNzIuMjY4IDMwOS42Ny05LjUzNSAxMy43NzQtMjkuOTMgMTMuNzczLTM5LjQ2NCAwek0xOTIgMjcyYzQ0LjE4MyAwIDgwLTM1LjgxNyA4MC04MHMtMzUuODE3LTgwLTgwLTgwLTgwIDM1LjgxNy04MCA4MCAzNS44MTcgODAgODAgODB6Ij48L3BhdGg+PC9zdmc+";
const circleOrange = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDM4NCAzODQiPg0KPHBhdGggZmlsbD0iI0ZGODI1MyIgZD0iTTE5MywwQzg3LDAsMSw4NiwxLDE5MnM4NiwxOTIsMTkyLDE5MnMxOTItODYsMTkyLTE5MlMyOTkuMSwwLDE5MywweiBNMTkzLDI1NC40Yy0zNC40LDAtNjIuNC0yNy45LTYyLjQtNjIuNA0KCXMyNy45LTYyLjQsNjIuNC02Mi40YzM0LjQsMCw2Mi40LDI3LjksNjIuNCw2Mi40UzIyNy41LDI1NC40LDE5MywyNTQuNHoiLz4NCjwvc3ZnPg0K";

let reviewsMap = new Map();

ymaps.ready(init);

function init() {
  // Создание карты.
  let map = new ymaps.Map("map", {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [55.33, 42.19],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 12,
    // controls: ['zoomControl'],
    behaviors: ['drag']
  });

  const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
    '<div style="color: #000000; font-weight: bold;">{{ properties.geoObjects.length }}</div>'
  )
  // Создаем собственный макет с информацией о выбранном геообъекте.
  var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
    '<div class="balloon__place">{{ properties.balloonContentPlace }}</div>' +
    '<a href="" class="balloon__address">{{ properties.balloonContentAddress }}</a>' +
    '<div class="balloon__message">{{ properties.balloonContentMessage }}</div>' +
    '<div class="balloon__datetime">{{ properties.balloonContentDatetime }}</div>',
    {
      build: function () {
        // Сначала вызываем метод build родительского класса.
        customItemContentLayout.superclass.build.call(this);
        // А затем выполняем дополнительные действия.
        this.linkBalloonButton = document.querySelector('.balloon__address');
        this.linkBalloonListener = this.linkBalloonListener.bind(this);
        this.linkBalloonButton.addEventListener('click', this.linkBalloonListener);
      },
      clear: function () {
        // Выполняем действия в обратном порядке - сначала снимаем слушателя,
        // а потом вызываем метод clear родительского класса.
        this.linkBalloonButton.removeEventListener('click', this.linkBalloonListener);
        customItemContentLayout.superclass.clear.call(this);
      },
      linkBalloonListener: function(e) {
        e.preventDefault();
        let coords = this.events.params.context._data.properties.get('balloonContentCoords');
        let address = this.events.params.context._data.properties.get('balloonContentAddress');
        const BalloonContentLayout = renderBalloon(coords, address);
        map.balloon.open(coords, null, {
          layout: BalloonContentLayout
        });
      },
    }
  );

  let clusterer = new ymaps.Clusterer({
    gridSize: 128,
    clusterIcons: [
      {
        href: circleOrange,
        size: [44, 44],
        offset: [-22, -22]
      }
    ],
    clusterIconContentLayout: MyIconContentLayout,
    // Устанавливаем стандартный макет балуна кластера "Карусель".
    clusterBalloonContentLayout: 'cluster#balloonCarousel',
    // Устанавливаем собственный макет.
    clusterBalloonItemContentLayout: customItemContentLayout,
    // В данном примере балун никогда не будет открываться в режиме панели.
    clusterBalloonPanelMaxMapArea: 0,
    // Устанавливаем размеры макета контента балуна (в пикселях).
    clusterBalloonContentLayoutWidth: 300,
    clusterBalloonContentLayoutHeight: 200,
    // Устанавливаем максимальное количество элементов в нижней панели на одной странице
    clusterBalloonPagerSize: 5,
    disableClickZoom: true,
    hideIconOnBalloonOpen: false
  })

  map.geoObjects.add(clusterer);

  function renderBalloon(coords, address) {
    let reviews = reviewsMap.get(address);
    if (!reviews) {
      reviews = []
    }
    const html = render({ cond: reviews.length === 0, address, reviews })
    const BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      html,
      {
        build: function () {
          // Сначала вызываем метод build родительского класса.
          BalloonContentLayout.superclass.build.call(this);
          // А затем выполняем дополнительные действия.
          this._$element = document.querySelector('.geo');
          this.closeBalloonButton = document.querySelector('.geo__close');
          this.form = document.querySelector('.review');
          this.submitForm = document.querySelector('.review__button');
          this.addReviewListener = this.addReviewListener.bind(this);
          this.submitForm.addEventListener('click', this.addReviewListener);
          this.closeBalloonButton.addEventListener('click', this.closeBalloonListener);
        },
        clear: function () {
          // Выполняем действия в обратном порядке - сначала снимаем слушателя,
          // а потом вызываем метод clear родительского класса.
          this.closeBalloonButton.removeEventListener('click', this.closeBalloonListener);
          this.submitForm.removeEventListener('click', this.addReviewListener);
          BalloonContentLayout.superclass.clear.call(this);
        },
        getShape: function () {
          return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
            [0, 0], [
              this._$element.offsetWidth,
              this._$element.offsetHeight
            ]
          ]));
        },
        closeBalloonListener: e => {
          e.preventDefault();
          map.balloon.close();
        },
        getCurrentDate: () => {
          let newDate = new Date();
          let day = parseInt(newDate.getDate()) < 10 ? `0${newDate.getDate()}` : newDate.getDate();
          let month = parseInt(newDate.getMonth() + 1) < 10 ? `0${parseInt(newDate.getMonth()) + 1}` : parseInt(newDate.getMonth()) + 1;
          return `${month}/${day}/${newDate.getFullYear()}`;
        },
        addReviewListener: function (e) {
          e.preventDefault();
          let review = {
            author: this.form.elements.name.value,
            place: this.form.elements.place.value,
            date: this.getCurrentDate(),
            message: this.form.elements.message.value
          }
          let reviews = reviewsMap.get(address);
          if (reviews) {
            reviews.push(review);
          } else {
            reviews = [review];
          }
          //обновляем данные в Map
          reviewsMap.set(address, reviews);
          //обновляем балун, делаем перерендер
          this._renderedTemplate.text = render({ cond: reviews.length === 0, address, reviews });
          this.clear();
          this.build();

          let placemark = new ymaps.Placemark(coords, {
              balloonContentCoords: coords,
              balloonContentPlace: review.place,
              balloonContentAddress: address,
              balloonContentMessage: review.message,
              balloonContentDatetime: review.date
            },
            {
              iconLayout: "default#image",
              iconImageHref: placemarkGrey,
              iconImageSize: [44, 66],
              iconImageOffset: [-22, -66]
            }
          )
          placemark.events.add('click', function() {
            const BalloonContentLayout = renderBalloon(coords, address);
            map.balloon.open(coords, null, {
              layout: BalloonContentLayout
            });
          })
          clusterer.add(placemark);
        }
      });
    return BalloonContentLayout;
  }

  map.events.add('click', async function (e) {
    try {
      // Получение координат щелчка
      const coords = e.get('coords');
      let geocoder = await ymaps.geocode(coords);
      let firstGeoObject = geocoder.geoObjects.get(0);
      let address = firstGeoObject.getAddressLine();
      const BalloonContentLayout = renderBalloon(coords, address);
      await map.balloon.open(coords, null, {
        layout: BalloonContentLayout
      });
    } catch (error) {
      console.log(error)
    }
  });
}