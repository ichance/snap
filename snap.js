//  Usage:  snapshot.js URL PNGFile
//  Ex:     phantomjs snapshot.js http://www.baidu.com ~/Desktop/snapshot.png
var system = require('system');
var page = require('webpage').create(),
    address, output, size;

address = system.args[1];
output = system.args[2];
page.viewportSize = { width: 320, height: 568};

var bb = page.evaluate(function () { 
  return document.getElementsByTagName('html')[0].getBoundingClientRect(); 
});

page.clipRect = {
  top:    bb.top,
  left:   bb.left,
  width:  bb.width,
  height: bb.width
};

page.open(address, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
    } else {
        window.setTimeout(function () {
            page.render(output);
            phantom.exit();
        }, 1000);
    }
});
