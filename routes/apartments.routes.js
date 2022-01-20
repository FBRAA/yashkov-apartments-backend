module.exports = app => {
  const apartments = require('../controllers/apartmentsController')
  const router = require('express').Router()
  
  // В приложении созданы стандартные CRUD руты
  // и контроллеры только визуально, функционал
  // не дорабатывался и не проверялся, так как сильно
  // выходил за пределы ТЗ.
  
  // GET на поиск апартаментов
  router.get('/', apartments.findAll);

  // GET на получение списка этажей, который был
  // вручную занесен в первый документ вместо парсинга 
  // по документам и сопоставления этажей, так как это
  // по затратам ресурсов нецелесообразно.
  router.get('/floorList', apartments.floorList);
  
  // GET на поиск одной квартиры.
  router.get('/:id', apartments.findOne);
  
  // POST на создание квартиры.
  router.post('/', apartments.create);

  // GET на изменение квартиры.
  router.put('/:id', apartments.update);

  // GET на удаление квартиры.
  router.delete('/:id', apartments.delete);

  app.use('/api/apartments', router)
};