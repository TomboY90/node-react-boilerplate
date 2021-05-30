const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:qwer1234@cluster0.qnqs9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then(() => console.log('Mongoose Connected...'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})