module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      id: String,
      floor: Number,
      pos_on_floor: Number,
      price: Number,
      rooms: Number,
      area_total: Number,
      area_kitchen: Number,
      area_live: Number,
      layout_image: String,
      coordinates: Array,
      floorsArray: Array,
    }
  )
  // Так как у квартир в базе уже были присвоенные
  // айди 101-124, то для работы сервера (поиска по айди)
  // уникальный айди MongoDB был удалён из виртуальных
  // параметров модели
  schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
    }
  });


  return Apartment = mongoose.model('Apartment', schema, 'esoft_apartments')

}