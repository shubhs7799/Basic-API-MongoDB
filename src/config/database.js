const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://rshubham928:5d0X7x2NUO9QUiFL@learnbackend.ubacu.mongodb.net/devTinder');
}

module.exports = connectDB
