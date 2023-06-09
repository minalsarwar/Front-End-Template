import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate, Link, useParams } from 'react-router-dom';

import { Cookies } from 'react-cookie';
/* eslint-disable */
import jwt_decode from 'jwt-decode';
import Confetti from 'react-confetti';

// components
import Iconify from '../components/iconify';

// NEW
const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [tryCounter, setTryCounter] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const { subjectID, classID, unitID, lessonID } = useParams();

  // const shuffleAnswers = () => {
  //   const shuffledAnswers = [...currentQuestion.answers];
  //   for (let i = shuffledAnswers.length - 1; i > 0; i -= 1) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
  //   }
  //   return shuffledAnswers;
  // };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/question/lesson/${lessonID}`);
        setQuestions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [lessonID]);

  useEffect(() => {
    if (questions.length > 0) {
      setShuffledAnswers(shuffleAnswers());
    }
  }, [questions, currentQuestionIndex]);

  const shuffleAnswers = () => {
    if (!currentQuestion) {
      return []; // Return an empty array if there are no more questions
    }
  
    const shuffledAnswers = [...currentQuestion.answers];
    for (let i = shuffledAnswers.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
    }
    return shuffledAnswers;
  };
  
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setTryCounter(0);
    setIsAnswerCorrect(false);
    setSelectedAnswer(null);
    setDisabledOptions([]);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    const congratsContainerStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'url(https://img.freepik.com/premium-vector/happy-cute-kids-boy-girl-celebrate-win_97632-1313.jpg?w=1060) center/cover',
      padding: '20px',
      boxSizing: 'border-box',
    };

    const congratsMessageStyle = {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: '20px',
      background:'linear-gradient(45deg, rgba(255, 107, 107, 0.7), rgba(153, 204, 255, 0.6))',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.3s ease, background 0.3s ease',
      cursor: 'default',
    };
    
    // Add hover effect
    congratsMessageStyle[':hover'] = {
      transform: 'scale(1.05)',
       background: 'linear-gradient(45deg, rgba(255, 107, 107, 1), rgba(153, 204, 255, 1))', // Change the gradient colors for hover effect
    };
    

    const goBackButtonStyle = {
      padding: '10px 20px',
      backgroundColor: '#41D1C6',
      border: 'none',
      borderRadius: '4px',
      opacity: '0.85',
      color: '#ffffff',
      textDecoration: 'none',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      cursor: 'pointer',
    };

    const confettiConfig = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  

    return (
      <div style={congratsContainerStyle}>
        <Typography variant="h3" style={congratsMessageStyle}>
          Congratulations! You have completed the lesson! 🌟🌟🌟
        </Typography>
        <Link to={`/subject/${subjectID}/class/${classID}/unit/${unitID}/lessons`} style={goBackButtonStyle}>
          Go back to Lessons
        </Link>
      </div>
    );
  }

  const handleAnswerSelect = (selectedAnswer) => {
    const correctAnswer = currentQuestion.answers[0]; // db has correct ans on the first index of the ans array
    console.log(selectedAnswer);
    console.log(correctAnswer);
  
    const isCorrect = selectedAnswer === correctAnswer;
    setIsAnswerCorrect(isCorrect);
  
    if (isCorrect) {
      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    } else {
      setTryCounter((prevCounter) => prevCounter + 1);
      setDisabledOptions((prevDisabledOptions) => [...prevDisabledOptions, selectedAnswer]);
    }
  
    setSelectedAnswer(selectedAnswer);
    makeApiCall(isCorrect);
  };
  
  const makeApiCall = (isCorrect) => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
  
    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        const userId = decodedToken.userId;
  
        const questionID = currentQuestion._id.toString();
        const numTries = tryCounter.toString();
  
        axios.put(`http://localhost:3000/progress/user/${userId}/subject/${subjectID}/class/${classID}/unit/${unitID}/lesson/${lessonID}/answer_status`, {
          question_id: questionID,
          is_correct: isCorrect.toString(),
          tries: numTries
        })
          .then(response => {
            console.log("API call successful");
            console.log(response.data);
          })
          .catch(error => {
            console.error("API call error:", error);
          });
      } catch (error) {
        console.error('Error decoding access token:', error);
      }
    }
  };
  

  const styles = {
    // buttonContainer: {
    //   display: 'flex',
    //   flexDirection: 'column',
    //   alignItems: 'flex-start',
      
    // },
    button: {
      padding: '10px',
      margin: '5px',
      backgroundColor: '#41D1C6',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    correctButton: {
      backgroundColor: 'green',
      color: 'white',
    },
    incorrectButton: {
      backgroundColor: 'grey',
      color: 'white',
    },
  };

  const containerStyle = {
    backgroundImage: `url(https://img.freepik.com/premium-vector/girl-her-friend-talking-with-blank-bubble-speech_33070-5611.jpg?w=740)`,
    backgroundSize: 'cover',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundPosition: 'center 50%',
    justifyContent: 'center',
  };


  
  return (
    <div style={containerStyle}>
     <Typography
        variant="h1"
        sx={{
          fontSize: '50px',
          fontFamily: 'Lato',
          color: '#890596',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          letterSpacing: '2px',
          marginBottom: '40px'
        }}
      >
        {currentQuestion.question_details}
      </Typography>
      <div>
        {currentQuestion.question_image && (
          <img
            src={currentQuestion.question_image}
            alt={`Question ${currentQuestionIndex + 1}`}
            style={{ width: '300px', height: 'auto', marginBottom: '20px'}}
          />
        )}
        
        {/* <div style={ styles.buttonContainer }> */} 
        {shuffledAnswers.map((answer, index) => {
          const isCorrectAnswer = answer === currentQuestion.answers[0];
          const isClickedIncorrectAnswer = selectedAnswer === answer && !isCorrectAnswer;
          const isDisabled = disabledOptions.includes(answer);

          let buttonStyle = styles.button;
          if (isAnswerCorrect && isCorrectAnswer) {
            buttonStyle = { ...buttonStyle, ...styles.correctButton };
          } else if (isClickedIncorrectAnswer) {
            buttonStyle = { ...buttonStyle, ...styles.incorrectButton };
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              style={isDisabled ? { ...buttonStyle, ...{ backgroundColor: 'grey', cursor: 'not-allowed' } } : buttonStyle}
              disabled={isAnswerCorrect || isDisabled}
            >
              {answer}
            </button>
          );
        })}
        {/* </div> */}
        {tryCounter > 0 && !isAnswerCorrect && (
          <p>You have tried {tryCounter} time(s). Try again!</p>
        )}
        {isAnswerCorrect && (
          <p>Correct! The answer is {currentQuestion.answers[0]}.</p>
        )}
      </div>
    </div>
  );
};

export default Questions;