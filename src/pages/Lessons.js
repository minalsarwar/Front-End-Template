
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import axios from 'axios';

import { Cookies } from 'react-cookie';
/* eslint-disable */
import jwt_decode from 'jwt-decode';

import { useState, button, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Button} from '@mui/material';
import { useNavigate, Link, useParams } from 'react-router-dom';

import { CheckCircle } from '@mui/icons-material';


// components
import Iconify from '../components/iconify';

// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
// import React from 'react';

const lessonButtonStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '200px',
  height: '80px',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  transition: 'transform 0.3s',
  background: 'linear-gradient(to right, #330B88, #880B1C)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
};

const lessonButtonHoverStyles = {
  transform: 'scale(1.05)',
};

const CompletedStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '200px',
  height: '60px',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  background: 'linear-gradient(to right, #000000, #ED50F1)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
  marginTop: '10px',
  marginLeft: '150px'
};

const handleMouseEnter = (e) => {
  e.target.style.transform = lessonButtonHoverStyles.transform;
}; 

const handleMouseLeave = (e) => {
  e.target.style.transform = 'scale(1)';
};

export default function Lessons() {
  const navigate = useNavigate();
  const { subjectID, classID, unitID } = useParams();
  const [lessons, setLessons] = useState([]);
  let completed_lessons=null;
  
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  let lessonID=null;
  let userId=null;
  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');
  if (accessToken) {
    try {
      // Decode the access token to extract user ID
      const decodedToken = jwt_decode(accessToken);
      userId = decodedToken.userId;

    } catch (error) {
      // Handle decoding error
      console.error('Error decoding access token:', error);
    }
  }

  const handleSelectLesson = (lessonName) => {
  
    axios.get(`http://localhost:3000/lesson/lessonName/${lessonName}`)
      .then(response => {
        console.log('I am Minal')
        const lessonID = response.data;
        setSelectedLesson(lessonID);
      // navigate(`/subject/${subjectID}/class/${classID}/unit/${unitID}/lesson/${lessonID}/lesson-details`);

        console.log("USER ID ",userId)
        console.log("lesson ID ",lessonID)
        // Make the POST request with the user ID
        axios.put(`http://localhost:3000/progress/user/${userId}/subject/${subjectID}/class/${classID}/unit/${unitID}/lesson`, {
          lesson_id: lessonID
        })
        .then(response => {
          // Handle the response
          console.log(response.data);
          navigate(`/subject/${subjectID}/class/${classID}/unit/${unitID}/lesson/${lessonID}/lesson-details`);
        })
        .catch(error => {
          // Handle the error
          console.error(error);
        });
      })
      .catch(error => {
        console.error(error);
      });


  }

  
  useEffect(() => {
    const fetchLessons = async () => {
      const response = await axios.get(`http://localhost:3000/lesson/unit/${unitID}`);
      setLessons(response.data);
    };
    fetchLessons();

    const fetchCompletedLessons = async () => {
      const response = await axios.get(`http://localhost:3000/progress/user/${userId}/unit/${unitID}/completed-lessons`);
      completed_lessons=response.data;
      console.log("Completed Lessons", completed_lessons)
      setCompletedLessons(completed_lessons);
    };
    fetchCompletedLessons();
    // console.log("Progress", progress)
  }, []);

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId) => {
    console.log("check", lessonId, completedLessons.includes(lessonId))
    return completedLessons.includes(lessonId);
  };
  
  // Check if all lessons are completed
  const areAllLessonsCompleted = completedLessons.length === lessons.length;
  console.log(completedLessons.length)
  console.log("LESSON COMPLETED ", areAllLessonsCompleted)

  const handleCongratsButtonClick = () => {
    navigate(`/subject/${subjectID}/class/${classID}/units`);
  };


  return (
    <div style={{
      backgroundImage: 'url(https://img.freepik.com/premium-vector/girl-her-friend-talking-with-blank-bubble-speech_33070-5611.jpg?w=740)',
      backgroundSize: 'cover',
      opacity: '0.85',
      backgroundPosition: 'center 50%',
      overflow: 'hidden',
      minHeight: '100vh',
    }}>
  
      <Helmet>
        <title>Select a Lesson</title>
      </Helmet>
  
      <Typography
        variant="h2"
        sx={{   
          fontFamily: 'Crimson Text',
          display: 'inline-block',
          color: '#890596',
          fontWeight: '600',
          textAlign: 'center',
          letterSpacing: '2px',
          marginBottom: '40px',
          marginLeft: '200px',
          marginTop: '20px',
          background:'linear-gradient(45deg, rgba(255, 107, 107, 0.75), rgba(153, 204, 255, 0.75))',
          padding: '10px 20px',
          borderRadius: '25px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        }}
      >
        SELECT A LESSON
      </Typography>
      <Grid container spacing={3} style={{ marginLeft: '10px'}}>
        {lessons.map((lesson) => (
          <Grid item xs={12} sm={6} md={3} key={lesson._id}>
            <Button
              onClick={() => handleSelectLesson(lesson.lesson_name)}
              style={{ ...lessonButtonStyles }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {lesson.lesson_name} {isLessonCompleted(lesson._id) && <CheckCircle sx={{ color: 'green', marginLeft: '5px' }} />}
            </Button>
          </Grid>
        ))}
      </Grid>
  
      {/* Conditional rendering for the button and congratulatory message */}
      {areAllLessonsCompleted && (
        <div>
          <Typography variant="h4" sx={{ mt: 3, fontSize: '15px',
      fontWeight: 'bold',
      display: 'inline-block',
      color: '#FFFFFF',
      padding: '10px',
      marginLeft: '15px',
      background:'linear-gradient(45deg, rgba(185, 131, 255, 0.95), rgba(255, 93, 162, .95))',
      borderRadius: '8px'}}>
            Congratulations on completing all lessons!
          </Typography>
          <Button onClick={handleCongratsButtonClick} style={{ ...CompletedStyle }}>
            Complete another unit
          </Button>
        </div>
      )}
    </div>
  );
  

  // return (
  //   <div style={{
  //     backgroundImage: 'url(https://img.freepik.com/free-vector/kids-playing-school-compound-park_1308-32285.jpg?w=1380&t=st=1685786732~exp=1685787332~hmac=3601958f512a2ba63a700a74c5c9f5d74a877b2aaead64002498d421447e427b)',
  //     backgroundSize: 'cover',
  //     opacity: '0.85',
  //     backgroundPosition: 'center bottom',
  //     overflow: 'hidden',
  //     minHeight: '100vh',
  //   }}>

  //     <Typography
  //       variant="h1"
  //       sx={{
  //         fontSize: '64px',
  //         fontFamily: 'Noto Serif',
  //         color: '#890596',
  //         fontStyle: 'italic',
  //         fontWeight: 'bold',
  //         textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  //         textAlign: 'center',
  //         letterSpacing: '2px',
  //         marginBottom: '40px'
  //       }}
  //     >
  //       SELECT A LESSON
  //     </Typography>
  //     <Grid item xs={12} sm={6} md={3} key={lesson._id}>
  //       {lessons.map((lesson) => {
  //         return (
  //           <Grid item xs={12} sm={6} md={3} key={lesson._id}>
  //             <button
  //               onClick={() => handleSelectLesson(lesson.lesson_name)}
  //               style={{ ...lessonButtonStyles }}
  //               onMouseEnter={handleMouseEnter}
  //               onMouseLeave={handleMouseLeave}
  //             >
  //               {lesson.lesson_name} {isLessonCompleted(lesson._id) && <CheckCircle sx={{ color: 'green', marginLeft: '5px' }} />}
  //             </button>
  //           </Grid>
  //         );
  //       })}
  //     </Grid>

  //     {/* Conditional rendering for the button and congratulatory message */}
  //     {areAllLessonsCompleted && (
  //       <div>
  //         <button onClick={handleCongratsButtonClick} style={{ ...lessonButtonStyles }}>
  //           Complete another unit
  //         </button>
  //         <Typography variant="h4" sx={{ mt: 3 }}>
  //           Congratulations on completing all lessons!
  //         </Typography>
  //       </div>
  //     )}
  //   </div>
  // );

  // return (
  //   <div>
  //     <Typography variant="h3" sx={{ mb: 5 }}>
  //       Lessons for Subject {subjectID}, Class {classID}, and Unit {unitID}
  //     </Typography>
  //     <Grid container spacing={3}>
  //       {lessons.map((lesson) => {
  //         return (
  //           <Grid item xs={12} sm={6} md={3} key={lesson._id}>
  //             <button
  //               onClick={() => handleSelectLesson(lesson.lesson_name)}
  //               style={{ ...lessonButtonStyles }}
  //               onMouseEnter={handleMouseEnter}
  //               onMouseLeave={handleMouseLeave}
  //             >
  //               {lesson.lesson_name} {isLessonCompleted(lesson._id) && <CheckCircle sx={{ color: 'green', marginLeft: '5px' }} />}
  //             </button>
  //           </Grid>
  //         );
  //       })}
  //     </Grid>
  //   </div>
  // );
  

  // return (
  //   <div>
  //     <Typography variant="h3" sx={{ mb: 5 }}>
  //     Lessons for Subject {subjectID}, Class {classID} and Unit {unitID}
  //       </Typography>
  //     <Grid container spacing={3}>
  //       {lessons.map(lesson => (
  //         <Grid item xs={12} sm={6} md={3} key={lesson._id}>
  //           <button onClick={() => handleSelectLesson(lesson.lesson_name)} style={{ ...lessonButtonStyles }}
  //             onMouseEnter={handleMouseEnter}
  //             onMouseLeave={handleMouseLeave}>{lesson.lesson_name}    
  //           </button>
  //         </Grid>
  //       ))}
  //     </Grid>
  //   </div>
  // );
  
  }