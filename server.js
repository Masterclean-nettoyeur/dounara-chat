const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

app.use(express.static("public"));

// 🔗 Connexion MongoDB
mongoose.connect("mongodb+srv://doukingmbaye232_db_user:<6dixSWuceAQ6BnAC>@cluster0.zqcaytj.mongodb.net/?appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 📦 Schéma Message
const Message = mongoose.model("Message", {
  user: String,
  text: String,
  date: { type: Date, default: Date.now }
});

io.on("connection", async (socket) => {

  // envoyer anciens messages
  const messages = await Message.find().sort({ date: 1 });
  socket.emit("history", messages);

  socket.on("message", async (data) => {
    const msg = new Message(data);
    await msg.save(); // sauvegarde en base
    socket.broadcast.emit("message", data);
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("DouNara lancé sur le port " + PORT);
});
