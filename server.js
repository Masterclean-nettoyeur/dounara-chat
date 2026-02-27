const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = [];

io.on("connection", (socket) => {
  socket.on("join", (name) => {
    if (users.length < 2) {
      users.push({ id: socket.id, name });
      socket.emit("joined", name);
    } else {
      socket.emit("full");
    }
  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  socket.on("disconnect", () => {
    users = users.filter(u => u.id !== socket.id);
  });
});
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("DouNara lancé sur le port " + PORT);
});