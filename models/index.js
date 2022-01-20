const dbConfig = require('../config/db.config')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {
  mongoose,
  url: dbConfig.url,
  apartments: require('../models/apartmentmodel')(mongoose)
};

module.exports = db
