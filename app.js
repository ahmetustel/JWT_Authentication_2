const express = require('express');
const bodyParser = require('body-parser');

const UserRoutes = require('./routes/route');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* This is the root route. It is used to check if the server is running. */
app.get("/", (req, res) => {
    res.status(200).json({ alive: "True" });
  });

/* Telling the server to use the routes in the UserRoutes file. */
app.use("/", UserRoutes);


module.exports = app;