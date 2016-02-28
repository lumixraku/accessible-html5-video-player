var fs = require('fs');
var Promise = require('bluebird');
var exec = require('child_process').exec;


function existsSync(filePath) {
  return new Promise(function(resolve, reject) {
    try {
      fs.statSync(filePath);
    } catch (err) {
      console.log(filePath, ' not exists');
      reject();
    }
    resolve();
  })
}

function generateThumbnail(path, name, thumbnailFolder) {
  existsSync(thumbnailFolder + name + '.png').then(function() {
    //没有报错  文件已存在
    return Promise.resolve();
  }, function() {

    return new Promise(function(resolve, reject) {

      var from = "\""+path+"\""; //执行CMD命令  带有空格的文件名要用引号包裹
      var dest = thumbnailFolder + "\"" + name +"\"" + ".png";
      console.log(from , dest);
      var cmd = ["ffmpeg -i ", from, " -ss 00:00:01.000 -vframes 1 ", dest].join('');
      exec(cmd, function(err) {
        console.log(err, name, 'ffmeg err');
        resolve();
      });
    });


  });
}

/*得到一个文件夹下的所有文件(包括子文件夹)  并返回文件路径*/
function getFiles(dir, traverse, _files) {
  var _files = _files || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var path = dir + '/' + files[i];
    var name = files[i];
    if (fs.statSync(path).isDirectory()) {
      if (traverse) { getFiles(path, true, _files); }
    } else {
      if (/\.DS_Store$/.test(name)) {

      } else {
        _files.push(name);
      }
    }
  }
  return _files;
}

var folder = __dirname + '/media/';
var files = getFiles(folder);
var promises = [];
files.forEach(function(name) {
  promises.push(generateThumbnail(folder + name, name , folder + 'thumbnails/'));
});

module.exports = Promise.all(promises).then(function() {
  var list = files.map(function(name) {
    return {
      name: name,
      pic: '/media/thumbnails/' + name + '.png',
      src: '/media/' + name
    }
  });
  return {
    src: list[0].src,
    pic: list[0].pic,
    name: list[0].name,
    list: list
  };
}, function(err) {
  console.log('WRONG!!!!!!!!!', err);
})
