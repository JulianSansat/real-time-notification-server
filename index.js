var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const Redis = require("ioredis");

const redis = new Redis();
var pub = new Redis();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

redis.subscribe("notifications", function(err, count) {
  // Now we are subscribed to both the 'news' and 'music' channels.
  // `count` represents the number of channels we are currently subscribed to.

  pub.publish("notifications", "Hello world!");
});

redis.on("message", function(channel, message) {
  // Receive message Hello world! from channel news
  // Receive message Hello again! from channel music
  console.log("Receive message %s from channel %s", message, channel);
  io.emit(channel + ":" + message);
});

io.on("connection", function(socket) {
  socket.on("chat message", function(msg) {
    console.log("message: " + msg);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
