import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { useState, button } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useNavigate, Link, useParams } from 'react-router-dom';

import { Cookies } from 'react-cookie';

/* eslint-disable */
import jwt_decode from 'jwt-decode';

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

const classButtonStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '200px',
  height: '80px',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  transition: 'transform 0.3s',
  background: 'linear-gradient(to right, #ff5722, #f50057)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
};

const classButtonHoverStyles = {
  transform: 'scale(1.05)',
};

const handleMouseEnter = (e) => {
  e.target.style.transform = classButtonHoverStyles.transform;
}; 

const handleMouseLeave = (e) => {
  e.target.style.transform = 'scale(1)';
};

const cookies = new Cookies();




export default function Classes() {

const navigate = useNavigate();





const [selectedClass, setSelectedClass] = useState(null);
const { subjectID } = useParams(); // extracting subject id from url
let classID=null;


const handleSelectClass = (className) => {
  
  axios.get(`http://localhost:3000/class/className/${className}`)
    .then(response => {
      classID = response.data;
      setSelectedClass(classID);
    // navigate('/dashboard/user');
    //  navigate(`/subject/subjectID/classes/${classID}/units`);
    // navigate(`/subject/${subjectID}/class/${classID}/units`);

      const accessToken = cookies.get('accessToken');

      if (accessToken) {
        try {
          // Decode the access token to extract user ID
          const decodedToken = jwt_decode(accessToken);
          const userId = decodedToken.userId;
          console.log("USER ID ",userId)
          
          console.log("sub id ", subjectID)

          console.log("class id ", classID)
          // Make the POST request with the user ID
          axios.put(`http://localhost:3000/progress/user/${userId}/subject/${subjectID}/class`, {
            class_id: classID
          })
            .then(response => {
              // Handle the response
              console.log(response.data);
              navigate(`/subject/${subjectID}/class/${classID}/units`);
            })
            .catch(error => {
              // Handle the error
              console.error(error);
            });
        } catch (error) {
          // Handle decoding error
          console.error('Error decoding access token:', error);
        }
      }

    })
    .catch(error => {
      console.error(error);
    });

  }
  return (
    <>
      <Helmet>
        <title> Classes </title>
      </Helmet>
      <div style={{
          backgroundImage: 'url(https://img.freepik.com/free-vector/watercolor-feather-frame-vector-boho-style_53876-170528.jpg?size=626&ext=jpg&ga=GA1.2.2091757336.1680171558&semt=ais)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 80%',
          minHeight: '100vh',
        }}>
      <Container maxWidth="xl">
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Crimson Text',
              display: 'inline-block',
              color: '#CF0000',
              fontWeight: '600',
              textAlign: 'center',
              letterSpacing: '2px',
              marginBottom: '40px',
              marginLeft: '200px',
              marginTop: '20px',
              background:'linear-gradient(45deg, rgba(254, 98, 68, 1), rgba(153, 204, 255, 1))',
              padding: '10px 20px',
              borderRadius: '25px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            SELECT A CLASS
          </Typography>

        <Grid container spacing={3}>
         
          <Grid item xs={12} sm={6} md={3}>
             <button  onClick={() => handleSelectClass('KG')}
              style={{ ...classButtonStyles }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>KG</button>
              </Grid>

          <Grid item xs={12} sm={6} md={3}>
          <button  onClick={() => handleSelectClass('CLASS 1')}
              style={{ ...classButtonStyles }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>CLASS 1</button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
          <button  onClick={() => handleSelectClass('CLASS 2')}
              style={{ ...classButtonStyles }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>CLASS 2</button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
          <button  onClick={() => handleSelectClass('CLASS 3')}
              style={{ ...classButtonStyles }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>CLASS 3</button>
          </Grid>


        </Grid>
      </Container>
      </div>
    </>
  );
}
