const path = require('path');
const port = 1500;

const app = require('express')();
const express = require('express');

// socket.io code
const http = require('http').createServer(app);

app.use(express.static("public"));
app.use('/js',express.static(__dirname + '/js'));

app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.sendFile('/views/index.html',{ root: __dirname });
})

//heroku deployment
http.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
  