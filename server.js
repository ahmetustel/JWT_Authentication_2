const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 3000;

require('dotenv').config(); // .env dosyasının heryerden kullaılması için

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, console.log("Server started on port: ", PORT));
    }).catch((err) => {
        console.log(err);
    });