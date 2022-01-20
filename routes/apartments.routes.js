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

  // find all athletes that play tennis
  // var query = Athlete.find({ 'sport': 'Tennis' });
  // // selecting the 'name' and 'age' fields
  // query.select('name age');
  // // limit our results to 5 items
  // query.limit(5);
  // // sort by age
  // query.sort({ age: -1 });
  // // execute the query at a later time
  // query.exec(function (err, athletes) {
    //   if (err) return handleError(err);
    //   // athletes contains an ordered list of 5 athletes who play Tennis
    // })
    // // same as
    // Athlete.
    //   find().
    //   where('sport').equals('Tennis').
    //   where('age').gt(17).lt(50).  //Additional where query
    //   limit(5).
    //   sort({ age: -1 }).
    //   select('name age').
    //   exec(callback); // where callback is the name of our callback function.
    
