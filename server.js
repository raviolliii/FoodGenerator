var express = require("express");
var app = express();
var http = require("http").Server(app);
var path = require("path");

app.use(express.static(path.resolve(__dirname)));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

http.listen(8080, function() {
  console.log("Magic happens on port 8080");
});
