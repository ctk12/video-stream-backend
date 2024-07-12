const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webrtc = require("wrtc");
const cors = require('cors');

const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

let senderStream = {};

app.use(cors({
    origin: '*'
}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("https://video-stream-frontend-five.vercel.app");
});

app.get("/users", (req, res) => {
  res.json(senderStream);
});

app.get("/resetusers", (req, res) => {
  senderStream = {};
  res.json({msg: "ok"});
});

app.get("/all", (req, res) => {
    if (Object.keys(senderStream).length > 0) {
     res.status(200).json({msg: "streams available", data: Object.keys(senderStream) });
    } else {
     res.status(200).json({msg: "no streams available", data: []});
    }
 });
 
 io.on('connection', (socket) => {
     socket.on('USER_ADDED', (data) => {
         io.emit("USER_ADDED_USERNAME", data);
     });
 
     socket.on('USER_REMOVED', (data) => {
         io.emit("USER_REMOVED_USERNAME", data);
     });
    
     socket.on('WATCHING', (data, type, ip) => {
         io.emit("WATCHING_UPDATE", data, type, ip);
     });
 });
 
 app.post("/close", ({ body }, res) => {
     const newObject = {};
     Object.keys(senderStream).filter(item => item !== body.username).map(item => {
       newObject[item] = senderStream[item];
     });
     senderStream = newObject;
     io.emit("USER_REMOVED_USERNAME", body.username);
     res.json({msg: "ok"});
  });
 
 app.post("/view", async ({ body }, res) => {
     const peer = new webrtc.RTCPeerConnection({
         iceServers: [
             {
                 urls: "stun:stun.stunprotocol.org"
             }
         ]
     });
     const desc = new webrtc.RTCSessionDescription(body.sdp);
     const myStream = senderStream[body.username];
     await peer.setRemoteDescription(desc);
     if (myStream) {
       myStream.getTracks().forEach(track => peer.addTrack(track, myStream));
     }
     const answer = await peer.createAnswer();
     await peer.setLocalDescription(answer);
     const payload = {
         sdp: peer.localDescription
     }
 
     res.json(payload);
 });
 
 app.post('/validate', async ({ body }, res) => {
     if (senderStream[body.username]) {
         res.json({msg: false});
     } else {
         res.json({msg: true});
     }
 });
 
 app.post('/broadcast', async ({ body }, res) => {
     const peer = new webrtc.RTCPeerConnection({
         iceServers: [
             {
                 urls: "stun:stun.stunprotocol.org"
               },
         ]
     });
     peer.ontrack = (e) => handleTrackEvent(e, peer, body.username);
     const desc = new webrtc.RTCSessionDescription(body.sdp);
     await peer.setRemoteDescription(desc);
     const answer = await peer.createAnswer();
     await peer.setLocalDescription(answer);
     const payload = {
         sdp: peer.localDescription
     }
 
     io.emit("USER_ADDED_USERNAME", body.username);
     res.json(payload);
 });
 
 function handleTrackEvent(e, peer, username) {
     senderStream[username] = e.streams[0];
 };
 
 server.listen(3000, () => console.log('server started'));