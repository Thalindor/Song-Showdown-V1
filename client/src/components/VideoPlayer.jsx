import { nameList, questionList, answerList } from '../data';

import React , {useEffect, useRef, useState} from 'react'

export default function VideoPlayer(props) {
  const [ questions, setQuestions] = useState([])

    const { width, height } = props;
    
    const cloudinaryRef = useRef();
    const videoRef = useRef();
    
    useEffect(() => {
      if (props.questions && props.questions.length > 0) {
        setQuestions(props.questions);
      }
    }, [props.questions]);


    useEffect(() => {
        if( cloudinaryRef.current ) return;
        cloudinaryRef.current = window.cloudinary;
        cloudinaryRef.current.videoPlayer( videoRef.current, {
            cloud_name: ' ', // cloud name // 
            autoplay: true,
        })
    }, []);
  return (
    <video
        ref = {videoRef}
        data-cld-public-id = {`wwe/${props.questions[props.questionnumber]}`}
        width={width}  height={height}
        {... props}
    />
  )
}
