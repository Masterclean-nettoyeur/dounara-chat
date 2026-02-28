const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = [];
let images = []; // stocke les images pour l'album

io.on("connection", (socket) => {
  socket.on("join", (name) => {
    if (users.length < 2) {
      users.push({ id: socket.id, name });
      socket.emit("joined", name);
      socket.emit("album", images); // envoyer l'album existant
    } else {
      socket.emit("full");
    }
  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  socket.on("image", (imgData) => {
    images.push(imgData); // sauvegarde dans l'album
    socket.broadcast.emit("image", imgData);
    io.emit("album", images); // mise à jour album pour tous
  });

  socket.on("disconnect", () => {
    users = users.filter(u => u.id !== socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("DouNara lancé sur le port " + PORT);
});
