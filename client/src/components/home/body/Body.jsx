import React, { useEffect, useState } from 'react'
import './Body.css'
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate   } from "react-router-dom";
import io from "socket.io-client";


const socket = io.connect("http://localhost:3001");


export default function Body({ setUrl, setCreatedRoomNumber , setRoomInfo , isHost, setIsHost}) {

  const navigate = useNavigate();

  /* SOCKET IO */
    //Room State
    const [firstUserInfo, setFirstUserInfo] = useState('')
    const [secondUserInfo, setSecondUserInfo] = useState('')
    const [room, setRoom] = useState('');
  
    // Messages States
    const [messageReceived, setMessageReceived] = useState("");
    // Error States
    const [emptyInput, setEmptyInput] = useState('')
    const [enterCode, setEnterCode] = useState(false)
    const [roomNotFound, setRoomNotFound] = useState(true)
    const [isRoomFull, setIsRoomFull] = useState('');

    const [loading , setLoading] = useState(false);
    const [roomNumber, setRoomNumber] = useState('');
    const [currentRooms, setCurrentRooms] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    
    const createRoom = () => {

        socket.emit("join_room", {firstUserInfo, username, roomType: 'create'});
        socket.on("roomNumber", (data) => {
          setRoomNumber(data)
        });
      setIsLoading(true)
      setIsHost(true)
    };
  
    useEffect(() => {
        if (roomNumber !== '' && isLoading) {
          setUrl((prevHistory) => [...prevHistory, roomNumber]);
          setCreatedRoomNumber(roomNumber)

          setRoomInfo({
            firstUsername: username, 
            firstUserPng: firstUserInfo,
            roomNumber: roomNumber
          })

          navigate(`/play/${roomNumber}`);
          
        }
    }, [roomNumber, isLoading]);

    const secondUserJoinGame = async () => {
      if(room == ''){
        setEnterCode(true)
      }else{
        setLoading(true)
        await socket.emit("join_room", {firstUserInfo, username, roomType: 'join', room});

        await socket.on("room_full", (data) => {
          if(data == 'failed'){
            setLoading(false)
            setIsRoomFull(true)
          }else if(data == 'joined'){
            setIsRoomFull(false)
            setLoading(false)
            setCreatedRoomNumber(room)
            navigate(`/play/${room}`);
          }else{
            console.log(data)
            console.log('problem on room_full socket')
          }
        });
      }
    }

    
    
    useEffect(() => {
      if(room !== ''){
        setEmptyInput('/play')
      }
    }, [room])
  
    useEffect(() => {
      socket.on("receive_message", (data) => {
        setMessageReceived(data.message);
      });
      socket.on("room_not_found", (data) => {
        setRoomNotFound(false)
      });
        socket.on("roomNumber", (data) => {
          setRoomNumber(data)
      });

    }, [socket,roomNumber]);
  
  /*- SOCKET IO -*/


  /* Popups */ 
  const [joinGamePopup, setJoinGamePopup] = useState(false)
  const [aboutPopup, setAboutPopup] = useState(false)

  function joinGame() {
    setJoinGamePopup(true)
  }
  function closeJoinGamePopup() {
    setJoinGamePopup(false)
  }

  function about() {
    setAboutPopup(true)
  }

  function closeAboutPopup() {
    setAboutPopup(false)
  }
  /*- Popups -*/

  /* Avatar + Username + User Info's */
  const [avatarCounter, setAvatarCounter] = useState(1)
  const [avatar, setAvatar] = useState('cena.png')
  const avatars = ['cena.png', 'female.png', 'sting.png','jeffhardy.png','drew.png']
  const randomUsername = ['OhaDiyorumMelih', 'Baldwin IV', 'Michael Jackson', 'Kieślowski', 'György Pálfi', 'Quorthon', 'Johan Andersson', 'BrownieConnoisseur', 'Toezilla', 'HolyGrail' ]
  const randomIndex = Math.floor(Math.random() * randomUsername.length);
  const [username, setUsername] = useState(randomUsername[randomIndex])

  function changeAvatar() {
    setAvatarCounter(prevCounter => prevCounter + 1);
    setAvatar(avatars[avatarCounter % 5])
  }

  useEffect(() => {
    setFirstUserInfo(avatar)
  }, [avatar])
  
  function secondUserJoin() {
    setSecondUserInfo(avatar)
  }
  /*- Avatar + Username + User Info's -*/ 


  return (
    <div className="home-body-container">
      <div className="home-body-container-content">
        <div
          className={joinGamePopup ? "home-body-container-content-body activePopup" : "home-body-container-content-body"}
          style={aboutPopup ? { filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' } : {}}
        >    
          <div className="home-body-container-top">
            <h1>Song Showdown</h1>
            <p>Ready to test your wrestling knowledge?</p>
          </div>

          <div className="home-body-container-center">
            <div className="home-body-container-center-img">
               <img src={`/images/${avatar}`} alt="" />
             <ReplayCircleFilledIcon className='replayIcon' onClick={changeAvatar} />
            </div>

            <p className='centerDesc'>Pick an avatar and a nickname</p>

            <div className="center-input">
              <div className="inputHR"></div>
              <input type="text"
              placeholder='Your Username'
              className='nicknameInput' 
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              value={username}
              maxLength={20}
              />
            </div>

            <div className="center-buttons" onClick={secondUserJoin}>
              <button className='homePlayButton joinButton' onClick={joinGame}>
                <PlayArrowIcon className='homePlayIcon' style={{ fontSize: '34px', fontWeight: 'bold', borderRadius: '8px' }} />
                <span style={{ fontWeight: 'bold' }}>JOIN A ROOM</span>
              </button>
              <button className='homePlayButton createButton' onClick={createRoom}>
                <PlayArrowIcon className='homePlayIcon ' style={{ fontSize: '34px', fontWeight: 'bold', borderRadius: '8px' }} />
                <span style={{ fontWeight: 'bold' }}>CREATE A ROOM</span>
              </button>
            </div>

          </div>
          
          <div className="home-body-container-bottom">
            <ul>
              <li>
                <div className="home-bottom-icons">
                  <GitHubIcon className='icon-home-bottom'/>
                  <h3>Github</h3>
                </div>
              </li>

              <li>
                <div className="home-bottom-icons" onClick={about}>
                  <InfoIcon className='icon-home-bottom'/>
                  <h3>About</h3>
                </div>
              </li>
            </ul>


          </div>
        </div>

        {/* Popups */}
        {/* Join Game Popup */}
        <div className={joinGamePopup ? "join-popup active" : "join-popup"} style={{ visibility: joinGamePopup ? 'visible' : 'hidden' }}>
          <div className="join-popup-content">
            <div className="join-popup-content-top">
                <CloseIcon className='join-popup-closeIcon'
                  onClick={closeJoinGamePopup}
                  />
              <h2>Song Showdown</h2>
              <p>To join a game, enter the invitation code you received from your friend.</p>
            </div>

            <div className="join-game-popup-center">
              <h4>INVITE CODE:</h4>
              <div className="join-game-popup-buttonContainer">

                <input type="text" placeholder='Your Invite Code'
                className='join-game-input'
                onChange={(event) => {
                  setRoom(event.target.value)
                }} />
               </div>
                
                <button className='join-game-button ' style={{backgroundColor: '#0072CE'}}
                onClick={secondUserJoinGame}
                >{ loading ? 'loading...' : 'Join a Game'}</button>
                


               {enterCode && <p>You must enter a code</p> }
               {!roomNotFound && <p>Game not found</p>}
               {isRoomFull && <p>Room is full</p> }
              <div className="join-game-popup-input-hr">
                <hr />
                <p>or</p>
                <hr />
              </div>
                <button className='join-game-button' style={{backgroundColor: '#c31818'}}>Create A Game</button>

              <p className='join-game-popup-p'>If you dont have invitation code, you can create a game.</p>
            </div>
            
          </div>
        
        </div>
        {/*- Join Game Popup -*/}

        {/* About Popup */}
          <div className={aboutPopup ? "info-popup active" : "info-popup"}>
            <CloseIcon className='join-popup-closeIcon'  onClick={closeAboutPopup}/>
            <div className="info-popup-top">
              <p>I made this game to learn Socket.io, and you can find the sites I inspired while making this game below.</p>
              <ul>
                <li><a href="https://songtrivia2.io/">Songtrivia</a></li>
                <li><a href="https://songl.io/">Songlio</a></li>
              </ul>
            </div>
            <div className="info-popup-center">
              <h3>Contact: </h3>
              <ul>
                <li>Gmail: tynansylvester23999@gmail.com</li>
                <li>Github: tynansylvester</li>
              </ul>
            </div>
          </div>
        {/*- About Popup -*/}

      </div>
    </div>
  )
}
