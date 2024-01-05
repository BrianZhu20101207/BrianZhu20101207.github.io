const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const CryptoJS = require('crypto-js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// 提供静态文件
app.use(express.static('public'));

// 路由：获取公钥
app.get('/publickey', function(req, res) {
  const privateKey = req.query.privateKey;
  const publicKey = CryptoJS.SHA256(privateKey).toString();
  res.send(publicKey);
});

// Socket.IO连接事件
io.on('connection', function(socket) {
  // 监听发送消息事件
  socket.on('sendMessage', function(encryptedMessage) {
    io.emit('newMessage', encryptedMessage);
  });
});

// 启动服务器
const port = 3000;
server.listen(port, function() {
  console.log('服务器运行在 http://localhost:' + port);
});