const http = require('http');
const express = require('express');
const cors = require("cors")
const routes = require("./routes");

const app = express();
http.Server(app);
app.use(express.json())

const port = 3000;

// CORS configuration - allow Firefox plugin and frontend
const corsOptions = {
  origin: [
    'http://localhost:3001',
    /^moz-extension:\/\/.*$/
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(routes);

module.exports = app;
