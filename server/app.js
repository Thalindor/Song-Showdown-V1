const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const roomJoinedUser = {};
const rooms = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let roomInviteCode = '';

app.get('/play/:roomNumber', (req, res) => {
  const roomNumber = req.params.roomNumber;
  res.json({ "users": ["userOne", "userTwo"]})

  if (roomJoinedUser[roomNumber]) {
    const yourValueToSendToFrontend = "Merhaba Frontend!";
    res.status(200).send({ roomNumber, message: yourValueToSendToFrontend });
  } else {
    res.status(404).send('Oda bulunamadı.');
  }
});


io.on("connection", (socket) => {
  /* Her Kullanıcının Kendisine Ait Özel Oda Numarası */
  const randomRoomCode = Math.floor(100000 + Math.random() * 900000); 
  console.log(`User Connected: ${socket.id}, User Room Number: ${randomRoomCode}`); 
  /*- Her Kullanıcının Kendisine Ait Özel Oda Numarası -*/

  socket.on("join_room", (data) => {
    isRoomFounded = false;
    isRoomFull = false;

    if(data.roomType == 'create'){
      roomInviteCode = randomRoomCode.toString()

      socket.emit('roomNumber', roomInviteCode)
      
      roomJoinedUser[roomInviteCode] = [{
        socketId: socket.id,
        userPng: data.firstUserInfo,
        username: data.username,
        roomNumber: roomInviteCode
      }];
      
      console.log('Yeni oda oluşturuldu');
      
      socket.join(roomInviteCode);
      console.log(`${data.username} odaya katıldı: ${roomInviteCode}`);

    }else if(data.roomType == 'join'){

      roomInviteCode = data.room
      if(data.room !== ''){
        /* Is the entered room number valid? */
        const keys = Object.keys(roomJoinedUser);
        for(let i = 0; keys.length>i ; i++){
          if(keys[i] == roomInviteCode){
            console.log('Room Found')
            isRoomFounded = true;
          }
        }
        /*- Is the entered room number valid? -*/

        /* Is Room Full? If Not Join Room */
        if(isRoomFounded){
          console.log(roomJoinedUser[data.room].length)
          if(roomJoinedUser[data.room].length > 1){
            console.log('ALERT! ALERT! ALERT! ROOM IS FULL!')
            socket.emit('room_full', 'failed')
          }else{
            socket.join(roomInviteCode)
            console.log(`${data.username} odaya katıldı: ${roomInviteCode}`);
            
            roomJoinedUser[roomInviteCode].push({
              socketId: socket.id,
              userPng: data.firstUserInfo,
              username: data.username,
              roomNumber: roomInviteCode
            });
            socket.emit('room_full', 'joined')
          }
        }else{
          socket.emit('room_not_found', 'roomNotFound')
          console.log('room not found')
        }
        /*- Is Room Full? If Not Join Room -*/
      }
    }else{
      console.log('failed to create/join room')
    }
    console.log(roomJoinedUser);
  });

  socket.on('leave_room', (data) =>{
    socket.leave(data.roomNumber)
    delete roomJoinedUser[data.roomNumber] /* SORUN VAR!!!  */
    console.log(roomJoinedUser)
  })

socket.on("send_user", (data) => { 
  
  socket.join(data.roomNumber)

  if(roomJoinedUser[data.roomNumber]){
    socket.to(data.roomNumber).emit("user-info", {
      username : roomJoinedUser[data.roomNumber][0].username,
      userPng: roomJoinedUser[data.roomNumber][0].userPng,
      roomNumber : roomJoinedUser[data.roomNumber][0].roomNumber
    })
  }

  if(roomJoinedUser[data.roomNumber].length > 1){
    socket.to(data.roomNumber).emit("second-user-info", {
      username : roomJoinedUser[data.roomNumber][1].username,
      userPng: roomJoinedUser[data.roomNumber][1].userPng,
      roomNumber : roomJoinedUser[data.roomNumber][1].roomNumber
    })
  }

  socket.to(data.roomNumber).emit("is-multi", true)

  if(data.gameStartSend){
    socket.to(data.roomNumber).emit("is-players-ready", true)
  }

});

socket.on("game", (data) => {
  socket.join(data.roomNumber);
  socket.to(data.roomNumber).emit("waiting-players", true);

  if (!rooms[data.roomNumber]) {
    rooms[data.roomNumber] = {
      players: [],
    };
  }

  const existingPlayer = rooms[data.roomNumber].players.find(
    (player) => player.isHost === data.isHost
  );

  if (!existingPlayer) {
    rooms[data.roomNumber].players.push({
      isHost: data.isHost,
    });
  }

  if(rooms[data.roomNumber].players.length === 2){
    socket.to(data.roomNumber).emit("start-game", true);
  }

  if(roomJoinedUser[data.roomNumber]){
    socket.to(data.roomNumber).emit("user-info", {
      username : roomJoinedUser[data.roomNumber][0].username,
      userPng: roomJoinedUser[data.roomNumber][0].userPng,
      roomNumber : roomJoinedUser[data.roomNumber][0].roomNumber
    })
  }

  if(roomJoinedUser[data.roomNumber].length > 1){
    socket.to(data.roomNumber).emit("second-user-info", {
      username : roomJoinedUser[data.roomNumber][1].username,
      userPng: roomJoinedUser[data.roomNumber][1].userPng,
      roomNumber : roomJoinedUser[data.roomNumber][1].roomNumber
    })
  }


  socket.to(data.roomNumber).emit("other-user-answer", data.hostsAnswers)
  socket.to(data.roomNumber).emit("other-user-scoreboard", data.leaderboard)
  socket.to(data.roomNumber).emit("question-data", data.questionData)
  socket.to(data.roomNumber).emit("other-user-correct-answer-counter", data.correctAnswerCounter)

  if(data.firstUserReady){
    socket.to(data.roomNumber).emit('set-first-user-ready', true)
  }
  if(data.secondUserReady){
    socket.to(data.roomNumber).emit('set-second-user-ready', true)
  }

  if(data.firstUserReady && data.secondUserReady){
    socket.to(data.roomNumber).emit("o", true)
  }

  console.log(data)

  setInterval(() => {
    const start = Date.now();
  
    socket.emit("ping", () => {
      const duration = Date.now() - start;
      console.log(duration);
    });
  }, 1000);

});



  socket.on("room-url", (data) => {
  
    for(let i = 0; roomJoinedUser[i] > i; i++){
      console.log(Object.keys(roomJoinedUser) + data)
    }

  });
  
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});