const db = require('../models');
const Apartment = db.apartments;


exports.findAll = async (req, res) => {
  try {
    //query params
    const match = {
      rooms: req.query.rooms || {$gte: 0},
      // rooms: req.query.rooms1 ? { $in: req.query.rooms} : {$lte:Infinity}, // filtering to multiple room choice (1 and 3 rooms, for example)
      floor: {
        $gte: req.query.floorMin || 0,
        $lte: req.query.floorMax || Infinity
      },
      price: {
        $gte: req.query.priceMin || 0,
        $lte: req.query.priceMax || Infinity
      },
      area_total: {
        $gte: req.query.area_totalMin || 0,
        $lte: req.query.area_totalMax || Infinity
      }
    }

    const getSortType = () => {
      const sortTypes = {
        0: '',
        1: 'price',
        2: '-price',
        3: 'area_total',
        4: '-area_total'
      }
      return sortTypes[req.query.sortType]
    }
    
    //total number of doc counter
    const qtyOfAps = await Apartment
    .find(match)
    .countDocuments();
    //pagination consts
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || qtyOfAps
    const skip = (page - 1) * pageSize
    // the search itself
    const query = await Apartment
    .find(match)
    .skip(skip)
    .limit(pageSize)
    .sort(getSortType())
    if(!query) {
      res.status(404).send({ message: 'Could not find apartments, 404'})
    } else {
    res.send({
      query,
      qtyOfAps
    })}
  } catch(err) {
    res.status(500).send({
      message:
      err.message || 'Some error occured while retrieving apartments'
    })
  }
}

exports.findOne = async (req, res) => {
  try {
    const data = await Apartment.find({id: `${req.params.id}`})
    if(!data) {
    res.status(404).send({ message: 'Not found apartment with id' + req.params.id})
    } else {
      res.send(data)
    }
  } catch(err) {
    res.status(500).send({
      message:
      err.message || 'Some error occured while retrieving apartment by id'
    })
  }
}

exports.floorList = async (req, res) => {
  try {
    const data = await Apartment
    .find({id: 101})
    .select({ floorList: 1})
    if(!data) {
    res.status(404).send({ message: 'Not found floorList'})
    } else {
      res.send(data)
    }
  } catch(err) {
    res.status(500).send({
      message:
      err.message || 'Some error occured while retrieving floorList'
    })
  }
}

// Create and save Apartment
exports.create = (req, res) => {
  //Validate req
  if(!req.body.id) {
      res.status(400).send({ message: 'Content can not be empty'})
       return
  }
  //Create an Apartment
  const apartment = new Apartment({
    id: req.body.id,
    floor: req.body.floor,
    pos_on_floor: req.body.pos_on_floor,
    price: req.body.price,
    rooms: req.body.rooms,
    area_total: req.body.area_total,
    area_kitchen: req.body.area_kitchen,
    area_live: req.body.area_live,
    layout_image: req.body.layout_image,
    coordinates: req.body.coordinates
  })
  //Save it in the DB
  Apartment
  .save(apartment)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || 'Some error occured while creating the Apartment'
    })
  })
}

// Update a Apartment by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Apartment.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Apartment with id=${id}. Maybe Apartment was not found!`
        });
      } else res.send({ message: "Apartment was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Apartment with id=" + id
      });
    });
};

// Delete a Apartment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Apartment.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Apartment with id=${id}. Maybe Apartment was not found!`
        });
      } else {
        res.send({
          message: "Apartment was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Apartment with id=" + id
      });
    });
};
