const dotenv = require('dotenv');
dotenv.config();

const username = process.env.MONGO_USERNAME
const password = process.env.MONGO_PASSWORD


module.exports = {
  url: `mongodb+srv://${username}:${password}@sandbox.r769y.mongodb.net/esoft_data?retryWrites=true&w=majority`
}