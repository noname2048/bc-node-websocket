import WebSocket from "ws";
import express from "express";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// app.listen(3000, handleListen);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const onSocketClose = () => {
  console.log("Disconnected from the Browser ❌");
};

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (message) => {
    console.log(message.toString("utf-8"));
    sockets.forEach((aSocket) => aSocket.send(message.toString("utf-8")));
  });
  socket.send(`hello!`);
});

server.listen(3000, handleListen);
