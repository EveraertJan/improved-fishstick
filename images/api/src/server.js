const http = require('http');
const express = require('express');
const cors = require("cors")
const routes = require("./routes");

const app = express();
http.Server(app);
// Increase body size limit to handle large article content
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

const port = 3000;

// CORS configuration - allow Firefox plugin and frontend
const allowedOrigins = [
  'http://localhost:3001',
  /^moz-extension:\/\/.*$/
];

// Add production frontend URL if DOMAIN env variable is set
if (process.env.DOMAIN && process.env.DOMAIN !== 'localhost') {
  allowedOrigins.push(`https://notes.${process.env.DOMAIN}`);
  allowedOrigins.push(`http://notes.${process.env.DOMAIN}`);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(routes);

module.exports = app;
