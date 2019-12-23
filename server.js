'use strict';

require('dotenv').config();
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const cors = require('cors');
const bodyParser = require('body-parser');

const urlHandler = require('./controllers/urlHandler.js');

const app = express();

// Basic Configuration for Heroku
const mongoURL = process.env.DB_URI;
const port = process.env.PORT || 3000;

mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoURL, { useNewUrlParser: true });

app.use(cors());
app.use(bodyParser.urlencoded({'extended': false}));
app.use(require('body-parser').json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', urlHandler.addUrl);
  
app.get('/api/shorturl/:shurl', urlHandler.processShortUrl);


// Answer not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

module.exports = app; // for testing
