const db = require('../models');
const Apartment = db.apartments;


exports.findAll = async (req, res) => {
  try {
    //Параметры поиска
    const match = {
      rooms: req.query.rooms || {$gte: 0},
      // Фильтрация возможна и по множественным вариантам квартир
      // одновременно, например однушки и двушки, но я решил 
      // отложить разработку этого варианта на другое время
      // чтобы уложиться в поставленные сроки.
      // rooms: req.query.rooms1 ? { $in: req.query.rooms} : {$lte:Infinity}, 
      floor: {
        $gte: req.query.floorMin || -Infinity, // На случай наличия подвалов и иных негативных этажей
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
    
    // Счётчик общего числа отобранных документов для пагинации
    const qtyOfAps = await Apartment
    .find(match)
    .countDocuments();
    // Константы пагинации
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || qtyOfAps
    const skip = (page - 1) * pageSize
    // Непосредственный поиск
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

exports.create = (req, res) => {
  //Валидация запроса
  if(!req.body.id) {
      res.status(400).send({ message: 'Content can not be empty'})
       return
  }
  //Создание документа по модели
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
  //Сохранение в базе
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

// Обновление квартиры по запросу с указанием её айди
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

// Удаление квартиры по айди
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
