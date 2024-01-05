const socket = io(); // 连接Socket.IO服务器

// 监听新消息事件
socket.on('newMessage', function(encryptedMessage) {
  const privateKey = localStorage.getItem('privateKey'); // 获取本地存储的私钥
  const decryptedMessage = decryptMessage(encryptedMessage, privateKey);
  displayMessage(decryptedMessage, false); // 显示接收到的消息
});

// 监听表单提交事件
document.getElementById('sendButton').addEventListener('click', function(event) {
  event.preventDefault();
  const message = document.getElementById('messageInput').value;
  const publicKey = localStorage.getItem('publicKey'); // 获取本地存储的公钥
  const encryptedMessage = encryptMessage(message, publicKey);
  socket.emit('sendMessage', encryptedMessage);
  displayMessage(message, true); // 显示已发送的消息
  document.getElementById('messageInput').value = '';
});

// 加密函数
function encryptMessage(message, publicKey) {
  const encryptedMessage = CryptoJS.AES.encrypt(message, publicKey).toString();
  return encryptedMessage;
}

// 解密函数
function decryptMessage(encryptedMessage, privateKey) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, privateKey);
  const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

// 显示消息
function displayMessage(message, isSent) {
  const chatLog = document.getElementById('chatLog');
  const messageElement = document.createElement('p');
  if (isSent) {
    messageElement.textContent = "我：" + message;
  } else {
    messageElement.textContent = "对方：" + message;
  }
  chatLog.appendChild(messageElement);
}