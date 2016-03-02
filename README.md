# phantomjs 安装

```js
//npm 版本
npm install phantomjs --phantomjs_cdnurl=http://cnpmjs.org/downloads

//shell 版本
https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2

```

# 目录结构

```
├── README.MD           //说明
├── deploy.json         //部署文件
├── node_modules        //库
├── package.json        //依赖配置
├── snap.js             //截图处理
├── snapserver.js       //截图服务
└── uploads             //缓存目录
```

# 截图服务

```
    pm2 start deploy.json
    //查看处理日志
    pm2 logs snapserver
```

# 调用方法

```
    按下面url规则发送请求
    http://yourdomain:9615/snap?url=http://baidu.com&pic=uploads/test.png
    format：http://yourdomain:9615/snap?url=(待截图的网页url)&pic=(服务器图片暂存路径，可以统一用uploads/*.png)
```