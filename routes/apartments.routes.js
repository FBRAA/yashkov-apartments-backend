module.exports = app => {
  const apartments = require('../controllers/apartmentsController')
  const router = require('express').Router()
  
  
  // GET request for getting all apartments.
  router.get('/', apartments.findAll);

  // GET request for getting floors array.
  router.get('/floorList', apartments.floorList);
  
  // GET request for one flat.
  router.get('/:id', apartments.findOne);
  
  // POST request for creating flat.
  router.post('/', apartments.create);

  // GET request to update flat.
  router.put('/:id', apartments.update);

  // GET request to delete flat.
  router.delete('/:id', apartments.delete);

  app.use('/api/apartments', router)
};