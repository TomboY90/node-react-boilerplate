const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');

const config = require('./config/key');

// Models
const { User } = require('./models/User');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then(() => console.log('Mongoose Connected...'));

app.get('/', (req, res) => {
  res.send('Nodemon!')
})

app.post('/user', (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({
      success: true
    })
  });
})




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})