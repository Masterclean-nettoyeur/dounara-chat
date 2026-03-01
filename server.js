const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

app.use(express.static("public"));

// 🔗 MongoDB
mongoose.connect("TON_LIEN_MONGODB_ICI");

// Message schema
const Message = mongoose.model("Message", {
  user: String,
  text: String,
  date: { type: Date, default: Date.now }
});

io.on("connection", async (socket) => {

  // envoyer historique
  const messages = await Message.find().sort({ date: 1 });
  socket.emit("history", messages);

  // chat
  socket.on("message", async (data) => {
    const msg = new Message(data);
    await msg.save();
    socket.broadcast.emit("message", data);
  });

  // 📹 WebRTC signalling
  socket.on("call-user", (signal) => {
    socket.broadcast.emit("incoming-call", signal);
  });

  socket.on("answer-call", (signal) => {
    socket.broadcast.emit("call-answered", signal);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("DouNara v2 lancé sur " + PORT);
});
