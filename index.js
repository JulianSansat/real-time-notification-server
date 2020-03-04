var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const Redis = require("ioredis");

const redis = new Redis();
var pub = new Redis();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

redis.psubscribe('laravel_database_notifications', function(err, count) {
  console.log('Subscribed');
});

io.on("connection", function(socket) {
  console.log('A client connected');
});

redis.on('pmessage', function(subscribed, channel, data) {
  console.log(channel);
  data = JSON.parse(data);
  console.log(new Date);
  console.log(data);
  io.emit(channel + ':' + data.event, data.data);
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
