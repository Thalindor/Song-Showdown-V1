import { nameList, questionList, answerList } from '../../data';
import { Link, useLocation,useNavigate } from "react-router-dom";


import React, { useEffect, useState } from 'react'
import './game.css'
import io from "socket.io-client";
import LoadingScreen from "../../components/game/loadingScreen/LoadingScreen"
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import VideoPlayer from '../../components/VideoPlayer';

import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';


const socket = io.connect("http://localhost:3001");

export default function Game({ createdRoomNumber, isHost, isSinglePlayer, roomInfo }) {
  const navigate = useNavigate();



  const [toggle, setToggle] = useState(true)
  const [toggleValue, setToggleValue] = useState(false);

  const [isPlayersReady, setIsPlayersReady] = useState(false)
  const [gameStart, setGameStart] = useState(false)

  const [volume, setVolume] = useState(.1);
  

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };


  const [secondUser, setSecondUser] = useState({
    secondUsername: null,
    secondUserPng: null,
    roomNumber: null
  })

  const [firstUser, setFirstUser] = useState({
    firstUsername: null,
    firstUserPng: null,
    roomNumber: null
  })




  // Game Status //  // Game Status //  // Game Status //  // Game Status //  // Game Status //
  const [answerArray, setAnswerArray] = useState([''])
  const [questionListArray, setQuestionListArray] = useState([''])
  useEffect(() => {
    if (isHost || isSinglePlayer) {
      setAnswerArray(answerList)
      setQuestionListArray(questionList)
    }
  })

/*     const [seconds, setSeconds] = useState(0);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
  
      return () => clearInterval(intervalId);

    }, [gameStart,seconds]);

    useEffect(() => {
      if(gameStart){
      }
    }, [gameStart,seconds]); */

  

  const [launchCounter, setLaunchCounter] = useState(3);
  const [beforeQuestionCounter, setBeforeQuestionCounter] = useState(1);
  const [questionCounter, setQuestionCounter] = useState(10);
  const [questionResultCounter, setQuestionResultCounter] = useState(2);
  const [questionAnswerCounter, setQuestionAnswerCounter] = useState(29);

  const [questionNumber, setQuestionNumber] = useState(0);
  const [corretAnswer, setCorrectAnswer] = useState('');

  const [launch, setLaunch] = useState(true)
  const [beforeQuestion, setBeforeQuestion] = useState(false)
  const [question, setQuestion] = useState(false)

  const [questionResult, setQuestionResult] = useState(false)

  const [questionAnswer, setQuestionAnswer] = useState(false)

  const [gameResult, setGameResult] = useState(false)

  const [leaderboard, setLeaderboard] = useState([])
  const [otherUsersLeaderboard, setOtherUsersLeaderboard] = useState([])

  const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0)
  const [otherUserCorrectAnswerCounter, setOtherUserCorrectAnswerCounter] = useState(0)


  // Answer Status // // Answer Status // 
  const [answered, setAnswered] = useState(false)

  const [answers, setAnswers] = useState([])

  const [answer, setAnswer] = useState('');

  const [otherUserAnswer, setOtherUserAnswer] = useState('')

  const [isAnswerCorret, setIsAnswerCorret] = useState(false)
  const [isAnswerWrong, setIsAnswerWrong] = useState(false)
  const [correctButton, setCorrectButton] = useState('')

  const [emgStart, setEmgStart ] = useState(false);
  const [otherEmgStart, setOtherEmgStart] = useState(false)

  const [firstUserReady, setFirstUserReady] = useState(false)
  const [secondUserReady, setSecondUserReady] = useState(false)


  const answerButton = (value) => {
    setAnswer(value)
    if (value !== '') {
      setAnswered(true)
    }

  }

  useEffect(() => {
    if (answerArray[questionListArray[questionNumber]] !== undefined) {
      if (answerArray[questionListArray[questionNumber]].a == Object.keys(answerArray)[questionNumber]) {
        setCorrectButton('a')
      }
      if (answerArray[questionListArray[questionNumber]].b == Object.keys(answerArray)[questionNumber]) {
        setCorrectButton('b')
      }
      if (answerArray[questionListArray[questionNumber]].c == Object.keys(answerArray)[questionNumber]) {
        setCorrectButton('c')
      }
      if (answerArray[questionListArray[questionNumber]].d == Object.keys(answerArray)[questionNumber]) {
        setCorrectButton('d')
      }
    }
  }, [questionNumber, toggle, toggleValue])

  useEffect(() => {
    <VideoPlayer
      width={775}
      height={435}
      questionNumber={questionNumber}
      questions={questionListArray}
    />
  }, [questionNumber, questionListArray, toggleValue, toggle])

  useEffect(() =>{
    if(gameStart){
      setLaunch(true)
    }
  }, [gameStart])

  useEffect(() => {

    if(!isSinglePlayer &&  isHost && firstUser.firstUsername !== null && secondUser.secondUsername !== null && isPlayersReady ){
      setFirstUserReady(true)
    }
    if(!isSinglePlayer && !isHost && firstUser.firstUsername !== null && secondUser.secondUsername !== null && isPlayersReady ){
      setSecondUserReady(true)
    }

  },[gameStart,isSinglePlayer,firstUser,secondUser, socket,otherEmgStart])

  useEffect(() => {
    if(!isSinglePlayer && isHost && secondUserReady ){
      setGameStart(true)
    }
    if(!isSinglePlayer && !isHost && firstUserReady ){
      setGameStart(true)
    }
  })

  //- Answer Status -// //- Answer Status -// 

  useEffect(() => {
    const interval = setInterval(() => {

      if (launchCounter >= 0 && launch) {
        setLaunchCounter(launchCounter - 1);
      }

      if (launchCounter == 0) {
        setLaunch(false)
        setBeforeQuestion(true)
      }

      if (beforeQuestionCounter > 0 && beforeQuestion) {
        setBeforeQuestionCounter(beforeQuestionCounter - 1)
      }
      if (beforeQuestionCounter == 0) {
        setBeforeQuestion(false)
        setQuestion(true)
      }

      if (questionCounter > 0 && question) {
        setQuestionCounter(questionCounter - 1)
      }

      if (questionCounter == 0) {
        setQuestionResult(true)
        setQuestion(false)
        setAnswered(true)
      }

      if (questionResultCounter > 0 && questionResult) {
        setQuestionResultCounter(questionResultCounter - 1)
      }

      if (questionResultCounter == 0) {
        setQuestionAnswer(true)
        setQuestionResult(false)
      }

      if (questionAnswerCounter > 0 && questionAnswer) {
        setQuestionAnswerCounter(questionAnswerCounter - 1)
      }

      if (questionAnswerCounter == 0) {
        setBeforeQuestion(true)
        setQuestion(false)
        setQuestionResult(false)
        setQuestionAnswer(false)

        if (questionNumber < 4) {

          setQuestionNumber(questionNumber + 1)
          setAnswer('')
          setOtherUserAnswer('')
          setAnswered(false)
          setIsAnswerCorret(false)
          setIsAnswerWrong(false)

          setBeforeQuestionCounter(1)
          setQuestionCounter(10)
          setQuestionResultCounter(2)
          setQuestionAnswerCounter(30)
        } else {
          setGameResult(true)
        }

      }

    }, 1000);

    setCorrectAnswer(questionListArray[questionNumber])


    if (answered) {

      if (answerArray[questionListArray[questionNumber]][answer] !== undefined &&
        answerArray[questionListArray[questionNumber]][answer] == corretAnswer) {
        setIsAnswerCorret(true)
      }

      if (answerArray[questionListArray[questionNumber]][answer] !== undefined &&
        answerArray[questionListArray[questionNumber]][answer] !== corretAnswer) {
        setIsAnswerWrong(true)
      }

    }

    return () => clearInterval(interval);
  }, [launchCounter, beforeQuestionCounter,
    questionCounter, question, questionCounter, questionAnswer, questionResultCounter,
    questionNumber, questionAnswerCounter, questionAnswer, questionResult,launch, gameStart]);

  useEffect(() => {
    if (questionResult) {
      if (isAnswerCorret) {
        if (leaderboard[questionNumber] == '') {
          setLeaderboard(true)
          setCorrectAnswerCounter(correctAnswerCounter + 1)
        } else {
          setLeaderboard((prevHistory) => [...prevHistory, true]);
          setCorrectAnswerCounter(correctAnswerCounter + 1)
        }

      } else if (isAnswerWrong) {
        if (leaderboard[questionNumber] == '') {
          setLeaderboard(false)

        } else {
          setLeaderboard((prevHistory) => [...prevHistory, false]);
        }
      } else {
        if (leaderboard[questionNumber] == '') {
          setLeaderboard(false)

        } else {
          setLeaderboard((prevHistory) => [...prevHistory, false]);
        }
      }
    }
  }, [questionResult, questionNumber])

  const audio = new Audio(`/assets/${corretAnswer}.mp3`)

  useEffect(() => {
    audio.volume = volume

  }, [audio, volume])

  useEffect(() => {
    if (question && !answered) {
      audio.play();
    }
  
    if (answered) {
      audio.pause();  // Duraklat veya durdur sesi
      audio.currentTime = 0;  // Sesin başa sarmasını sağla
      setQuestionCounter(0);
    }

    return () => {
      audio.pause();  // Component unmount olduğunda sesi durdur
    };

  }, [question, corretAnswer, answered])

/*   useEffect(() => {
    // Sesi oynat
    if(question){
      audio.play().catch(error => console.error("Ses çalınırken hata oluştu: ", error));
    }

    // answered true olduğunda sesi durdur
    if (answered) {
      audio.pause();
    }

    // Clean up
    return () => {
      audio.pause();  // Component unmount olduğunda sesi durdur
    };
  }, [audio, answered,corretAnswer]); */

  //- Game Status -// //- Game Status -// //- Game Status -// //- Game Status -// //- Game Status -//

  useEffect(() => {
/*     console.log(secondUser)
    console.log(firstUser) */
  })

  useEffect(() => {

    if (roomInfo.firstUsername !== '') {
      if (isSinglePlayer) {
        setGameStart(true)
      }
      setFirstUser({
        firstUsername: roomInfo.username,
        firstUserPng: roomInfo.userPng,
      })
    }

    socket.emit("game", {
      roomNumber: createdRoomNumber, isMultiReady: isPlayersReady, isHost: isHost,
      hostsAnswers: answer, questionData: { questionList, answerList }, leaderboard: leaderboard, correctAnswerCounter: correctAnswerCounter,
      firstUserReady: firstUserReady, secondUserReady: secondUserReady
    });

    socket.on("waiting-players", (data) => {
      setIsPlayersReady(data)
    })

/*     socket.on("start-game", (data) => {
      setGameStart(true)
        }) */

    socket.on("user-info", (data) => {
      setFirstUser({
        firstUsername: data.username,
        firstUserPng: data.userPng,
        roomNumber: data.roomNumber
      })
    })

    socket.on("second-user-info", (data) => {
      setSecondUser({
        secondUsername: data.username,
        secondUserPng: data.userPng,
        roomNumber: data.roomNumber
      })

    })

    socket.on('other-user-answer', (data) => {
      setOtherUserAnswer(data)
    })

    socket.on('question-data', (data) => {
      if (!isHost && !isSinglePlayer && !questionListArray[questionNumber] !== '') {
        setAnswerArray(data.answerList)
        setQuestionListArray(data.questionList)
      }

    })

    socket.on('other-user-scoreboard', (data) => {
      setOtherUsersLeaderboard(data)
    })

    socket.on('other-user-correct-answer-counter', (data) => {
      setOtherUserCorrectAnswerCounter(data)
    })

    socket.on('other-emg-start', (data) => {
      setOtherEmgStart(data)
    })

    socket.on('set-second-user-ready', (data) => {

      if(!isSinglePlayer && isHost && firstUser.firstUsername !== null && secondUser.secondUsername !== null && isPlayersReady ){
        setSecondUserReady(data) 
        console.log(data)
      }

    })

    socket.on('set-second-user-ready', (data) => {

      if(!isSinglePlayer && !isHost && firstUser.firstUsername !== null && secondUser.secondUsername !== null && isPlayersReady ){
        setFirstUserReady(data) 
        console.log(data)
      }
      
    })
/*     socket.on('o', (data) => {
      setGameStart(true)
      
    }) */

    if(createdRoomNumber == ''){
      navigate(`/`);
  }

  }, [socket, toggleValue, answer, toggle])

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

  const [isScaled, setIsScaled] = useState(false);


  useEffect(() => {
    if (questionResult) {
      setIsScaled(true);
    }

  }, [questionResult])

  useEffect(() => {

    setTimeout(() => {
      setIsScaled(false);
    }, 2000);

  }, [isScaled, questionResult])





  return (
    <>
      <div className="game-container">
        {!gameStart && <LoadingScreen/> }

        {/* GAME TOP CONTAINER */}
        <div className="volume">

          <div className="volume-box">


            <div className="volumeOff">
              <VolumeOffIcon style={{ fontSize: '32px', color: '#fff' }} />
            </div>

            <div className="volume-slider">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>


            <VolumeUpIcon style={{ fontSize: '32px', color: '#fff' }} />

          </div>
        </div>

        {gameStart && <div className="game-container-top">
          <ul>
            <li className='game-container-top-img'> <img src="/images/wwe.png" alt="" /> </li>
            {!gameResult ?

              <li className='game-container-top-box'>
                <div className="box-left-triangle"></div>
                <div className="box-center">
                  <div className="box-center-text">
                    {launch && <> <h4>GAME START</h4> <h2>LAUNCH</h2> </>}
                    {beforeQuestion && <> <h4>ROUND {questionNumber + 1}/5:</h4> <h2>QUESTION</h2></>}
                    {question && <> <h4>ROUND {questionNumber + 1}/5:</h4> <h2>QUESTION</h2></>}
                    {questionResult && <> <h4>ROUND {questionNumber + 1}/5:</h4> <h2>SOLUTION</h2></>}
                    {questionAnswer && <> <h4>ROUND {questionNumber + 1}/5:</h4> <h2>QUESTION LEADERBOARD</h2></>}
                  </div>
                  <div className="box-center-spin"></div>
                  <div className="box-center-counter">
                    <p>
                      {launch && launchCounter}
                      {question && questionCounter}

                    </p>

                  </div>
                </div>
                <div className="box-right-triangle"></div>
              </li>
              :
              <li style={{
                fontSize: "40px",
                fontFamily: "monospace",
                fontWeight: "bold",
                color: '#fff',
                display: 'flex',
                alignItems: 'center'

              }}>RESULT</li>
            }
            <li className='game-container-top-bottom'><CancelRoundedIcon style={{ color: '#fff' }} /></li>
          </ul>
        </div>}
        {/*- GAME TOP CONTAINER -*/}

          { gameStart &&         
            <div className="game-container-center">
          <div className="game-container-left">

            {
              !gameResult &&

              <div className="user1">
                {isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='player-img player1-img' />}
                {isHost && !isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='player-img player1-img' />}
                {!isSinglePlayer && !isHost && <img src={`/images/${firstUser.firstUserPng}`} alt="" className='player-img player1-img' />}

                <div className="user-information-box">
                  <h1>1</h1>
                  {isSinglePlayer && <h1>YOU</h1>}
                  {isHost && !isSinglePlayer && <h1>YOU</h1>}
                  {!isHost && !isSinglePlayer && <h1>{firstUser.firstUsername}</h1>}
                  {isHost && <h3>{correctAnswerCounter} </h3>}
                  {!isHost && <h3>{otherUserCorrectAnswerCounter} </h3>}
                </div>

                {
                  !isSinglePlayer && !isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[0] === true ? <CheckIcon /> : otherUsersLeaderboard[0] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[0] === true ? <CheckIcon /> : leaderboard[0] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }

                {
                  !isSinglePlayer && !isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[1] === true ? <CheckIcon /> : otherUsersLeaderboard[1] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[1] === true ? <CheckIcon /> : leaderboard[1] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }
                {
                  !isSinglePlayer && !isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[2] === true ? <CheckIcon /> : otherUsersLeaderboard[2] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[2] === true ? <CheckIcon /> : leaderboard[2] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }
                {
                  !isSinglePlayer && !isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[3] === true ? <CheckIcon /> : otherUsersLeaderboard[3] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[3] === true ? <CheckIcon /> : leaderboard[3] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }
                {
                  !isSinglePlayer && !isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[4] === true ? <CheckIcon /> : otherUsersLeaderboard[4] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[4] === true ? <CheckIcon /> : leaderboard[4] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }
              </div>
            }



          </div>
          {gameResult &&
            <div className="game-container-result">
              <div className="result">

                <div className="winner-box" >
                  <div className="boxIMG">
                    {isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='resultIcon' />}
                    {isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='resultIcon' />}
                    {isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='resultIcon' />}
                    {isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='resultIcon' />}
                    {!isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='resultIcon' />}
                    {!isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='resultIcon' />}
                    {!isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <img src={`/images/${firstUser.firstUserPng}`} alt="" className='resultIcon' />}



                  </div>
                  <div className="boxInfos">
                    {isSinglePlayer && <h3>{roomInfo.firstUsername}</h3>}
                    {isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>{roomInfo.firstUsername}</h3>}
                    {isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>{roomInfo.firstUsername}</h3>}
                    {isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>{secondUser.secondUsername}</h3>}
                    {!isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>{secondUser.secondUsername}</h3>}
                    {!isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>{secondUser.secondUsername}</h3>}
                    {!isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>{firstUser.firstUsername}</h3>}

                    {isSinglePlayer && <h3>{correctAnswerCounter}/5</h3>}
                    {isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>{correctAnswerCounter}/5</h3>}
                    {isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>{correctAnswerCounter}/5</h3>}
                    {isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>{otherUserCorrectAnswerCounter}/5</h3>}
                    {!isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>{correctAnswerCounter}/5</h3>}
                    {!isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>{correctAnswerCounter}/5</h3>}
                    {!isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>{otherUserCorrectAnswerCounter}/5</h3>}

                    {isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>WINNER</h3>}
                    {isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>WINNER</h3>}
                    {isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>DRAW</h3>}
                    {!isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>DRAW</h3>}
                    {!isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>WINNER</h3>}
                    {!isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>WINNER</h3>}
                    {isSinglePlayer && <h3>WINNER</h3>}

                  </div>
                </div>

                {
                  !isSinglePlayer &&
                  <div className="winner-box">
                    <div className="boxIMG">
                      {isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='resultIcon' />}
                      {isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='resultIcon' />}
                      {isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='resultIcon' />}
                      {!isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <img src={`/images/${firstUser.firstUserPng}`} alt="" className='resultIcon' />}
                      {!isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <img src={`/images/${firstUser.firstUserPng}`} alt="" className='resultIcon' />}
                      {!isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='resultIcon' />}

                    </div>
                    <div className="boxInfos">
                      {isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>{secondUser.secondUsername}</h3>}
                      {isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>{secondUser.secondUsername}</h3>}
                      {isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>{roomInfo.firstUsername}</h3>}
                      {!isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>{firstUser.firstUsername}</h3>}
                      {!isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>{firstUser.firstUsername}</h3>}
                      {!isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>{secondUser.secondUsername}</h3>}

                      {isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>{otherUserCorrectAnswerCounter}/5</h3>}
                      {isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>{otherUserCorrectAnswerCounter}/5</h3>}
                      {isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>{correctAnswerCounter}/5</h3>}
                      {!isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>{otherUserCorrectAnswerCounter}/5</h3>}
                      {!isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>{otherUserCorrectAnswerCounter}/5</h3>}
                      {!isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>{correctAnswerCounter}/5</h3>}


                      {isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>LOSER</h3>}
                      {isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>LOSER</h3>}
                      {isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>DRAW</h3>}
                      {!isHost && !isSinglePlayer && correctAnswerCounter == otherUserCorrectAnswerCounter && <h3>DRAW</h3>}
                      {!isHost && !isSinglePlayer && correctAnswerCounter < otherUserCorrectAnswerCounter && <h3>LOSER</h3>}
                      {!isHost && !isSinglePlayer && correctAnswerCounter > otherUserCorrectAnswerCounter && <h3>LOSER</h3>}
                    </div>
                  </div>
                }
              </div>

              <button className='continue-button'>CONTINUE</button>
            </div>
           }
           {
            !gameResult &&

            <div className="game-container-rigth">
              {launch &&
                <div className="before-game">
                  <h1>ARE YOU READY ?</h1>
                </div>
              }

              {
                beforeQuestion && !gameResult &&
                <div className="before-game">
                  <h1>QUESTION {questionNumber + 1}</h1>
                </div>
              }

              {
                (question || questionResult) &&
                <div className="question-container">
                  {question && <h2>What's the artist ?</h2>}
                  {questionResult && <h2>TIME IS UP!</h2>}
                  <div className="boxs">

                    <div className="single-box">

                      <button className={(answer === 'a' && isScaled && isAnswerWrong || (otherUserAnswer === 'a' && questionResult && correctButton !== 'a')) ? "middle-box box activeBox Wshake"
                        : (answer === 'a' && isScaled && isAnswerCorret) ? "middle-box box activeBox shake"
                          : (answer === 'a') ? "middle-box box activeBox"
                            : (correctButton === 'a' && questionResult) ? 'middle-box box correct shake' : 'middle-box box '}
                        onClick={() => answerButton('a')}
                        disabled={answered}
                        style={{
                          backgroundColor: questionResult ? (isAnswerCorret && answer === 'a' ? '#3FDBA3' : (isAnswerWrong && answer === 'a' || (otherUserAnswer === 'a' && correctButton !== 'a')) ? '#DC4110' : null) : null,

                          color: ((questionResult && answer === 'a') || (otherUserAnswer === 'a' && questionResult && correctButton !== 'a')) ? '#fff' : ''


                        }}
                      >
                        {answerArray[questionListArray[questionNumber]].a}
                      </button>

                      {answer === 'a' &&

                        <div className="answerIcon1">
                          {isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='asnwerIcon' />}
                          {isHost && !isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='asnwerIcon' />}
                          {!isSinglePlayer && !isHost && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='asnwerIcon' />}
                        </div>
                      }

                      {otherUserAnswer === 'a' &&

                        <div className="answerIcon2">
                          {isHost && !isSinglePlayer && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='asnwerIcon' />}
                          {!isSinglePlayer && !isHost && <img src={`/images/${firstUser.firstUserPng}`} alt="" className='asnwerIcon' />}
                        </div>
                      }

                    </div>

                    <div className="middle-boxs">
                      <div className="single-box">

                        <button className={(answer === 'b' && isScaled && isAnswerWrong || (otherUserAnswer === 'b' && questionResult && correctButton !== 'b')) ? "middle-box box activeBox Wshake"
                          : (answer === 'b' && isScaled && isAnswerCorret) ? "middle-box box activeBox shake"
                            : (answer === 'b') ? "middle-box box activeBox"
                              : (correctButton === 'b' && questionResult) ? 'middle-box box correct shake' : 'middle-box box '}
                          onClick={() => answerButton('b')}
                          disabled={answered}
                          style={{
                            backgroundColor: questionResult ? (isAnswerCorret && answer === 'b' ? '#3FDBA3' : (isAnswerWrong && answer === 'b' || (otherUserAnswer === 'b' && correctButton !== 'b')) ? '#DC4110' : null) : null,
                            color: ((questionResult && answer === 'b') || (otherUserAnswer === 'b' && questionResult && correctButton !== 'b')) ? '#fff' : ''


                          }}

                        >
                          {answerArray[questionListArray[questionNumber]].b}
                        </button>

                        {answer === 'b' &&

                          <div className="answerIcon1">
                            {isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='asnwerIcon' />}
                            {isHost && !isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='asnwerIcon' />}
                            {!isSinglePlayer && !isHost && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='asnwerIcon' />}
                          </div>
                        }

                        {otherUserAnswer === 'b' &&

                          <div className="answerIcon2">
                            {isHost && !isSinglePlayer && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='asnwerIcon' />}
                            {!isSinglePlayer && !isHost && <img src={`/images/${firstUser.firstUserPng}`} alt="" className='asnwerIcon' />}
                          </div>
                        }

                      </div>

                      <div className="single-box">

                        <button className={(answer === 'c' && isScaled && isAnswerWrong || (otherUserAnswer === 'c' && questionResult && correctButton !== 'c')) ? "middle-box box activeBox Wshake"
                          : (answer === 'c' && isScaled && isAnswerCorret) ? "middle-box box activeBox shake"
                            : (answer === 'c') ? "middle-box box activeBox"
                              : (correctButton === 'c' && questionResult) ? 'middle-box box correct shake' : 'middle-box box '}
                          onClick={() => answerButton('c')}
                          disabled={answered}
                          style={{
                            backgroundColor: questionResult ? (isAnswerCorret && answer === 'c' ? '#3FDBA3' : (isAnswerWrong && answer === 'c' || (otherUserAnswer === 'c' && correctButton !== 'c')) ? '#DC4110' : null) : null,

                            color: ((questionResult && answer === 'c') || (otherUserAnswer === 'c' && questionResult && correctButton !== 'c')) ? '#fff' : ''


                          }}


                        >
                          {answerArray[questionListArray[questionNumber]].c}


                        </button>

                        {answer === 'c' &&

                          <div className="answerIcon1">
                            {isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='asnwerIcon' />}
                            {isHost && !isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='asnwerIcon' />}
                            {!isSinglePlayer && !isHost && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='asnwerIcon' />}
                          </div>
                        }

                        {otherUserAnswer === 'c' &&

                          <div className="answerIcon2">
                            {isHost && !isSinglePlayer && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='asnwerIcon' />}
                            {!isSinglePlayer && !isHost && <img src={`/images/${firstUser.firstUserPng}`} alt="" className='asnwerIcon' />}
                          </div>
                        }
                      </div>

                    </div>
                    <div className="single-box">

                      <button className={(answer === 'd' && isScaled && isAnswerWrong || (otherUserAnswer === 'd' && questionResult && correctButton !== 'd')) ? "middle-box box activeBox Wshake"
                        : (answer === 'd' && isScaled && isAnswerCorret) ? "middle-box box activeBox shake"
                          : (answer === 'd') ? "middle-box box activeBox"
                            : (correctButton === 'd' && questionResult) ? 'middle-box box correct shake' : 'middle-box box '}
                        onClick={() => answerButton('d')}
                        disabled={answered}
                        value={answerArray[questionListArray[questionNumber]].d}
                        style={{
                          backgroundColor: questionResult ? (isAnswerCorret && answer === 'd' ? '#3FDBA3' : (isAnswerWrong && answer === 'd' || (otherUserAnswer === 'd' && correctButton !== 'd')) ? '#DC4110' : null) : null,
                          color: ((questionResult && answer === 'd') || (otherUserAnswer === 'd' && questionResult && correctButton !== 'd')) ? '#fff' : ''
                        }}

                      >
                        {answerArray[questionListArray[questionNumber]].d}


                      </button>

                      {answer === 'd' &&

                        <div className="answerIcon1">
                          {isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='asnwerIcon' />}
                          {isHost && !isSinglePlayer && <img src={`/images/${roomInfo.firstUserPng}`} alt="" className='asnwerIcon' />}
                          {!isSinglePlayer && !isHost && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='asnwerIcon' />}
                        </div>
                      }

                      {otherUserAnswer === 'd' &&

                        <div className="answerIcon2">
                          {isHost && !isSinglePlayer && <img src={`/images/${secondUser.secondUserPng}`} alt="" className='asnwerIcon' />}
                          {!isSinglePlayer && !isHost && <img src={`/images/${firstUser.firstUserPng}`} alt="" className='asnwerIcon' />}
                        </div>
                      }
                    </div>
                  </div>

                </div>



              }

            </div>
          }
          <div className="x">

            {
              !isSinglePlayer && !gameResult &&
              <div className="user1 right">
                <img src={`/images/${secondUser.secondUserPng}`} alt="" className='player-img player2-img' />
                <div className="user-information-box">
                  <h1>2</h1>
                  {isHost && <h1>{secondUser.secondUsername}</h1>}
                  {!isHost && <h1>YOU</h1>}
                  {!isHost && <h3>{correctAnswerCounter} </h3>}
                  {isHost && <h3>{otherUserCorrectAnswerCounter} </h3>}
                </div>

                {
                  isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[0] === true ? <CheckIcon /> : otherUsersLeaderboard[0] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[0] === true ? <CheckIcon /> : leaderboard[0] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }
                {
                  isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[1] === true ? <CheckIcon /> : otherUsersLeaderboard[1] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[1] === true ? <CheckIcon /> : leaderboard[1] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }
                {
                  isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[2] === true ? <CheckIcon /> : otherUsersLeaderboard[2] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[2] === true ? <CheckIcon /> : leaderboard[2] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }
                {
                  isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[3] === true ? <CheckIcon /> : otherUsersLeaderboard[3] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[3] === true ? <CheckIcon /> : leaderboard[3] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }
                {
                  isHost ? (
                    <div className="question-boxs">
                      <h1>
                        {otherUsersLeaderboard[4] === true ? <CheckIcon /> : otherUsersLeaderboard[4] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  ) : (
                    <div className="question-boxs">
                      <h1>
                        {leaderboard[4] === true ? <CheckIcon /> : leaderboard[4] === false ? <ClearIcon /> : '?'}
                      </h1>
                    </div>
                  )
                }
              </div>
            }

          </div>

        </div>}
        {questionAnswer &&
          <div className="video-player">
            <VideoPlayer
              width={774}
              height={435}
              questionnumber={questionNumber}
              questions={questionListArray}
            />
          </div>
        }

      </div>
    </>
  )
}
