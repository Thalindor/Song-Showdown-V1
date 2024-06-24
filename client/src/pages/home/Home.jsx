import React from 'react'
import './Home.css'
import Navbar from '../../components/home/navbar/Navbar'
import Body from '../../components/home/body/Body'
import { useState } from 'react'

export default function Home({ url, setUrl, 
  createdRoomNumber, setCreatedRoomNumber, setRoomInfo , roomInfo, isHost, setIsHost}) {

  
  return (
    <>
    <Navbar/>
    <Body 
    url={url} setUrl={setUrl}
    createdRoomNumber = {createdRoomNumber}
    setCreatedRoomNumber ={setCreatedRoomNumber}

    setRoomInfo = {setRoomInfo} roomInfo = {roomInfo}
    isHost = {isHost}  setIsHost = {setIsHost}

     />
    </>
  )
}
