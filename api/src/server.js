const http = require('http');
const express = require('express');
const cors = require("cors")
const routes = require("./routes");

const app = express();
http.Server(app); 
app.use(express.json())

const port = 3000;

app.use(cors());
app.use(routes);

module.exports = app;
