
// Initialize
new InitPxVideo({
    "videoId": "myvid",
    "captionsOnDefault": true,
    "seekInterval": 20,
    "videoTitle": "PayPal Austin promo",
    "debug": true
});

list = doc.querySelector('.list');
addEvent(list, 'click', function(e){
  function isInItem(elem){
    var node = elem;
    while(node){
      node = node.parentNode;
      if(node.classList.contains('list') != -1){
        return node;
      }
    }
    return false;
  }
  var target = e.target;
  var node = isInItem(target);
  video.pause();
  if(node){
    video.querySelector('source').src = node.getAttribute('data-src');
    video.poster = node.getAttribute('data-pic');
    video.load();
  }

});