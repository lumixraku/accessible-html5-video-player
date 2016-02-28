(function(){
  window.doc = document;
  var pageWidth = doc.body.offsetWidth;
  video.width = pageWidth;
  video.height = pageWidth/2;
  doc.documentElement.style.fontSize = 20 * (pageWidth / 320) + "px";

  this.addEvent = function(elem, type, fn){
    elem.addEventListener(type, fn, false);
  }
})();