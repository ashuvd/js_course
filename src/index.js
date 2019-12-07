require('./main.scss');
ymaps.ready(init);

let geoObjects = [];

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
  let placemark = geoObjects.push(new ymaps.Placemark([55.32, 42.18], {
      hintContent: "Это хинт",
      balloonContent: "Это балун"
    },
    // {
    //   iconLayout: "default#image",
    //   iconImageHref: "",
    //   iconImageSize: [46, 57],
    //   iconImageOffset: [-23, -57]
    // }
  ))
  // map.geoObjects.add(placemark);

  let clusterer = new ymaps.Clusterer({
    clusterIcons: [
      {
        href: "",
        size: [100, 100],
        offset: [-50, -50]
      }
    ],
    clusterIconContentLayout: null
  })

  map.geoObjects.add(clusterer);
  clusterer.add(geoObjects)
}