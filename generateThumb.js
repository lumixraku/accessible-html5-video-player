var fs = require('fs');
var Promise = require('bluebird');
var exec = require('child_process').exec;


function existsSync(filePath) {
  try {
    console.log(filePath, 'exists');
    fs.statSync(filePath);
  } catch (err) {
    if (err.code == 'ENOENT') return false;
  }
  return true;
}

function generateThumbnail(path, name, thumbnailFolder) {
  return new Promise(function(resolve, reject) {
      if (existsSync(thumbnailFolder + name + '.png')) {
        resolve();
    } else {
      var cmd = ["ffmpeg -i ", path, " -ss 00:00:01.000 -vframes 1 ", thumbnailFolder + name + ".png"].join('');
      exec(cmd, function(err) {
        console.log(name, ' done');
        resolve();
      });

    }
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
        _files.push(['/media/'+name, name]);
      }
    }
  }
  return _files;
}

var folder = __dirname + '/media';
var files = getFiles(folder);
var promises = [];
files.forEach(function(file) {
  promises.push(generateThumbnail(file[0], file[1], folder + '/thumbnails/'));
});

module.exports = Promise.all(promises).then(function() {
  console.log('All DONE');
  var list = files.map(function(file) {
    return {
      name: file[1],
      pic: '/media/thumbnails/' + file[1] + '.png',
      src: file[0]
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
