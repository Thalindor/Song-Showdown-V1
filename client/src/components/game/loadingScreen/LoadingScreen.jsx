import React from 'react'
import './loadingScreen.css'
import CircularProgress from '@mui/material/CircularProgress';


export default function LoadingScreen() {
  return (
    <div className="loading-screen-1">
          <div className="loading-screen-1-top">
            <CircularProgress size={40} style={{ color: '#fff'}} />
          </div>
          <div className="loading-screen-2-bottom">
            <h1 style={{ color: '#fff'}} className='create-game' >Creating Game</h1>
            <h1 style={{ color: '#fff'}} className='dot' >...</h1>
          </div>
    </div>
  )
}
