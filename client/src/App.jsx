import { nameList, questionList, answerList } from './data';
import './App.css';
import Home from './pages/home/Home.jsx'
import Lobby from './pages/lobby/lobby';
import Game from './pages/game/Game';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { useEffect, useState } from 'react';
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");


function App() {
  
  const [url, setUrl] = useState([])

  const [lobbyStart, setLobbyStart] = useState(false)
  const [isHost, setIsHost] = useState(false)

  const [isSinglePlayer, setIsSinglePlayer] = useState(false)


  const [createdRoomNumber, setCreatedRoomNumber] = useState('')
  const [roomInfo, setRoomInfo] = useState({
    firstUsername: '',
    firstUserPng: '',
    roomNumber: '',
  });

  useEffect(() => {
    socket.emit("room-url", url)
    
  }, [socket,url])

  return (
    <Router>
    <Routes >
      <Route path="/" element={<Home 
      url={url} setUrl={setUrl}
      createdRoomNumber = {createdRoomNumber}
      setCreatedRoomNumber ={setCreatedRoomNumber}
      setRoomInfo = {setRoomInfo} roomInfo = {roomInfo}
      isHost = {isHost}  setIsHost = {setIsHost}


      />} />
      <Route
        path="/play/:roomId"
        element={
          !lobbyStart ? (
            <Lobby
              url={url}
              setUrl={setUrl}
              createdRoomNumber={createdRoomNumber}
              setRoomInfo={setRoomInfo}
              roomInfo={roomInfo}
              setLobbyStart = {setLobbyStart}
              isHost = {isHost}  setIsHost = {setIsHost}

              isSinglePlayer = {isSinglePlayer} setIsSinglePlayer = {setIsSinglePlayer}

            />
          ) : (
            <Game 
              createdRoomNumber={createdRoomNumber}
              isHost = {isHost}  setIsHost = {setIsHost}
              isSinglePlayer = {isSinglePlayer} setIsSinglePlayer = {setIsSinglePlayer}
              roomInfo={roomInfo}


            />
          )
        }
      />

    </Routes >
  </Router>
  );
}

export default App;
