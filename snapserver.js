var http = require('http');
var url = require('url');
var path = require('path');
var cdn = "https://nztkidhkb.qnssl.com/";
var bucket = "mengwa";
var baseDir = "snap/images/";

http.createServer(function(req, res) {
    var path = url.parse(req.url, true);
    var file = "";
    var result = {
        "file": file
    };

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    switch (path.pathname) {
        case "/snap":
            var pageurl = path.query.url;
            var id = path.query.id;
            var pic = path.query.pic;

            var spawn = require('child_process').spawn;

            snap = spawn('phantomjs', ['snap.js', pageurl + "&id=" + id, pic]);

            snap.on('exit', function(code, signal) {
                console.log("截图" + code + "  " + signal);
                //qrsctl del ${BUCKET} ${KEYPREFIX}$file
                var del = spawn('qrsctl', ['del', bucket, baseDir + pic]);
                del.on('exit', function(code, signal) {
                    console.log("删除七牛" + code + "  " + signal);
                    console.log("- 删除:" + baseDir + pic);
                    //qrsctl put ${BUCKET} ${KEYPREFIX}$file $DATADIR$file
                    console.log("qrsctl put " + bucket + " " + baseDir + pic + " " + pic);
                    var put = spawn('qrsctl', ['put', bucket, baseDir + pic, pic]);
                    put.on('exit', function(code, signal) {
                        console.log("上传七牛" + code + "  " + signal);
                        console.log("+ 上传:" + baseDir + pic);
                        result = {
                            "file": cdn + baseDir + pic
                        };
                        //删除本地文件
                        spawn('rm', ['-rf', pic]);
                        console.log("- 删除本地:" + pic);

                        res.end(JSON.stringify(result));
                    });

                    put.stderr.on('data', function(error) {
                        console.log("error" + JSON.stringify(error));
                        res.end({
                            error: error
                        });
                    });
                });

            });
            snap.stderr.on('data', function(error) {
                console.log("error" + JSON.stringify(error));
                res.end({
                    error: error
                });
            });

            // snap.stdout.on('data', function(data) {
            //   //res.end(JSON.stringify(result));
            // });

            break;
        case "/":
        default:
            res.end("hello");
            break;
    }
}).listen(9615);
