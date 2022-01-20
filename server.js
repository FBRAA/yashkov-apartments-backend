var express = require('express');
var mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const corsOptions = {
  origin: 'https://yashkov-apartments-backend.herokuapp.com'
}
app.use(cors())
    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
      
      

const db = require('./models');
const { config } = require('nodemon');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('Connected to DB!')
  })
  .catch(err => {
    console.log('Cannot connect to the DB', err)
    process.exit()
  })
// simple route
app.get("/", (req, res) => {
   res.json({ message: "Welcome to Artyom's server." });
});

require('./routes/apartments.routes')(app)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
