var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var thumbnails = require('./generateThumb.js');


var app = express();
app.set('view engine', 'jade');
//静态资源请求
app.use(express.static(__dirname));

//访问根目录时
app.get('/', function(req, res){
  thumbnails.then(function(data){
    console.log(data);
    res.render('index', data);
  })
})

app.listen(3000, function() {
  console.log('Server started: http://localhost:3000');
});
