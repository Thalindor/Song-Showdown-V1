import React, { useState, useEffect } from 'react'
import { Link, useLocation,useNavigate } from "react-router-dom";
import './lobby.css'
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpIcon from '@mui/icons-material/Help';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import io from "socket.io-client";
import CircularProgress from '@mui/material/CircularProgress';
import LoadingScreen from '../../components/game/loadingScreen/LoadingScreen';



const socket = io.connect("http://localhost:3001");


export default function Lobby({createdRoomNumber, roomInfo, setLobbyStart, setIsHost, setIsSinglePlayer, isHost}) {

    const navigate = useNavigate();

    
    const [roomNumber, setRoomNumber] = useState('')
    
    const [toggleValue, setToggleValue] = useState(false);
    const [toggle, setToggle] = useState(true)
    
    const [buttonToggle, setButtonToggle] = useState(false)

    const [ secondUser, setSecondUser] = useState({ 
        secondUsername: null, 
        secondUserPng: null,
        roomNumber: null
    })

    const [ firstUser, setFirstUser] = useState({ 
        firstUsername: null, 
        firstUserPng: null,
        roomNumber: null
    })

    const [bothUserReady, isBothUserReady] = useState(false)
    const [gameStartSend, setGameStartSend] = useState(false)
    const [loadingScreens, setLoadingScreens] = useState(false)

    /* ilk oyuncu  */
    const [sendLink, setSendLink] = useState(false)



    const lobbyStart = () => {
        if(bothUserReady){
            setGameStartSend(true)
            setIsHost(true)
            setLoadingScreens(true)
        }else if(!bothUserReady){
            setLobbyStart(true)
            setIsSinglePlayer(true)
            setLoadingScreens(true)
        }
    
    }
    
    const leaveRoom = () => {
        socket.emit("leave_room", {roomNumber});
    }

    
    useEffect(() => {
        
        if(createdRoomNumber !== ''){
            socket.emit("send_user", { roomNumber: createdRoomNumber, isMulti: bothUserReady,
                 gameStartSend: gameStartSend, isReady: sendLink });
        }
        
        if(createdRoomNumber == ''){
            navigate(`/`);
        }

        socket.on("is-multi", (data) => {
            isBothUserReady(data)
        })
        
        
        socket.on("is-players-ready", (data) => {
            setGameStartSend(data)
            setSendLink(data)
        })

        if(sendLink || gameStartSend){
            setLobbyStart(true)
        }
        

        socket.on("user-info", (data) => {
            /* console.log(data) */
            setFirstUser({
                firstUsername: data.username, 
                firstUserPng: data.userPng,
                roomNumber: data.roomNumber
            })
        })

        socket.on("second-user-info", (data) => {
            /* console.log(data) */
            setSecondUser({
                secondUsername: data.username, 
                secondUserPng: data.userPng,
                roomNumber: data.roomNumber
            })
        })

      }, [socket,toggleValue,buttonToggle]);


      useEffect(() => {
        let interval;
    
        if (toggle) {
            interval = setInterval(() => {
                setToggleValue((prevToggleValue) => !prevToggleValue);
            }, 1000);
        }
        
        return () => {
            clearInterval(interval);
        };

    }, [toggle]);
    
      

    /* Code Copied */
    const [copied, setCopied] = useState(false)
    function codeCopied() {
        setCopied(true)

    }

    useEffect(() => {

        if(copied == true){
            const timeout = setTimeout(() => {
                setCopied(false);
              }, 3000);
              return () => clearTimeout(timeout);
        }
    
      }, [copied]);

/*       useEffect(() => {
        
      }) */
    
    /*- Code Copied -*/
  return (
    <>
    <div className="lobby-container">
            
        { (!isHost && firstUser.firstUserPng == null && secondUser.secondUserPng == null) ? <LoadingScreen/> :
            ( loadingScreens ? <LoadingScreen/> :

                <div className="lobby-container-content">
            <div className="lobby-container-top">
                <ul>
                    <Link to='/' style={{ textDecoration: 'none'}}>
                    <li className='lobby-top-back' onClick={leaveRoom}>B A C K</li>
                    </Link>
                    <li className='lobby-top-configure'>CONFIGURE GAME</li>
                    <li>
                        <img src="/images/wwe.png" alt="" />
                    </li>
                </ul>
            </div>

            <div className="lobby-container-center">
                <div className="lobby-container-center-content">

                    <div className="lobby-container-center-left">
                        <div className="players">
                            <div className="lobby-player1-container">
                            {roomInfo.firstUsername !== '' ? (
                                <>
                                    <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='lobby-player-img player1-img'/>
                                    <h3>{roomInfo.firstUsername}</h3>
                                </>
                                ) : (
                                    <>
                                    <img src={`/images/${
                                        firstUser.firstUserPng !== null ? firstUser.firstUserPng  : 'unknow.png'
                                    }`} alt="" className='lobby-player-img player1-img'/>
                                    <h3>{
                                        firstUser.firstUsername !== null ? firstUser.firstUsername  : '?'
                                    }</h3>
                                </>
                                )}
                            </div>
                            <div className="lobby-player2-container">
                             <img src={`/images/${
                                 secondUser.secondUserPng !== null ? secondUser.secondUserPng  : 'unknow.png'
                                }`} alt="" className='lobby-player-img player2-img'/>
                                <h3>{
                                    secondUser.secondUsername !== null ? secondUser.secondUsername  : '?'
                                }</h3>
                            </div>
                        </div>
                        <div className="invateCode">
                            <div className="invateCodeh3">
                                <h3>Your invite code: </h3>
                            </div>
                            <button onClick={codeCopied}>
                                <InsertLinkIcon style={{fontSize: '34px'}}/>

                                {roomInfo.roomNumber !== '' && 
                                <h3>{roomInfo.roomNumber}</h3>
                                
                            }

                                {roomInfo.roomNumber === '' && 
                                    <h3>{secondUser.roomNumber}</h3>
                                    
                                }

                            </button>
                            <div className={ copied ? "invateCode-copy active" : "invateCode-copy"}>
                                <ContentCopyIcon style={{fontSize: '20px'}}/>
                                <p>Code copied!</p>
                            </div>

                        </div>
                    </div>

                    <div className="lobby-container-center-right-container">
                        <div className="lobby-container-center-right">

                            <div className="game-rules-container">
                                <div className="game-rules-top">
                                    <h2>GAME RULES</h2>
                                </div>
                                <div className="game-rules-center">
                                    <ul>
                                        <li>You have 15 seconds to guess which wrestler the music you hear belongs to.</li>
                                        <li>After answering each question, 30 to 60 seconds of the wrestler's enterance video appears.</li>
                                        <li>After all questions have been answered, the player with the most correct answers wins the game.</li>
                                        <li>If the players have the same number of correct answers, the one who gives the correct answers in the shortest time wins.</li>
                                        <li>You can also play alone if you wish. Enjoy!</li>
                                    </ul>
                                </div>
                                <div className="game-rules-bottom">
                                    <div className="game-rules-bottom-content">
                                        <div className="game-rules-speed-choice">
                                            <h4>Speed</h4>
                                            <HelpIcon/>
                                            <div className="games-rules-speed">
                                                <span className='slow-span'>SLOW</span>
                                                <span className='normal-span'>NORMAL</span>
                                                <span className='fast-span'>FAST</span>
                                            </div>
                                        </div>
                                        <div className="games-rules-question">
                                            <h4>Number of questions</h4>
                                            <HelpIcon/>
                                            
                                            <div className="question-counter">
                                            <RemoveCircleIcon style={{color: '#0072CE'}}/>
                                            <p>10</p>
                                            <AddCircleIcon style={{color: '#0072CE'}}/>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            { roomInfo.roomNumber !== '' && <div className="lobby-container-center-button">
                                <button onClick={lobbyStart}> <PlayArrowIcon style={{fontSize: '34px'}}/>  <h3>Start</h3> </button>
                            </div>}

                     </div>
                     {roomInfo.roomNumber === '' && 
                        <div className="guest">
                            <div className="guestIcon">
                                <CircularProgress size={25} style={{ color: '#fff'}} />
                            </div>
                            <h1>WAITING THE HOST TO START THE GAME</h1>
                        </div>
                      }


                    </div>
                    
                </div>

            </div>
        </div>)}

</div>
</>
)
}
