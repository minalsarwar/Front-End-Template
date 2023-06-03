import { useState, useEffect } from 'react';
import { Grid, Icon, Container, Typography } from '@mui/material'; 
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Cookies } from 'react-cookie';
/* eslint-disable */
import jwt_decode from 'jwt-decode';

import { CheckCircle } from '@mui/icons-material';

import Iconify from '../components/iconify';
import {
  AppWidgetSummary,
} from '../sections/@dashboard/app';

const unitButtonStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '200px',
  height: '80px',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  transition: 'transform 0.3s',
  background: 'linear-gradient(to right, #583DDC, #3DA5F1)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
};

const unitButtonHoverStyles = {
  transform: 'scale(1.05)',
};

const handleMouseEnter = (e) => {
  e.target.style.transform = unitButtonHoverStyles.transform;
}; 

const handleMouseLeave = (e) => {
  e.target.style.transform = 'scale(1)';
};

export default function Units() {
  const navigate = useNavigate();
  const { subjectID, classID } = useParams();
  const [units, setUnits] = useState([]);

  
  // const [setSelectedUnit] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [completedUnits, setCompletedUnits] = useState([]);

  let unitID=null;
  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');
  let userId=null;
  if (accessToken) {
    try {
      // Decode the access token to extract user ID
      const decodedToken = jwt_decode(accessToken);
      userId = decodedToken.userId;
      console.log("USER ID now",userId)
    } catch (error) {
      // Handle decoding error
      console.error('Error decoding access token:', error);
    }
  }

  const handleSelectUnit = (unitName) => {
    axios.get(`http://localhost:3000/unit/unitName/${unitName}`)
      .then(response => {
        unitID = response.data;
        setSelectedUnit(unitID);
      // navigate(`/subject/${subjectID}/class/${classID}/unit/${unitID}/lessons`);
      
      // Make the POST request with the user ID
      axios.put(`http://localhost:3000/progress/user/${userId}/subject/${subjectID}/class/${classID}/unit`, {
        unit_id: unitID
      })
        .then(response => {
          // Handle the response
          console.log(response.data);
          navigate(`/subject/${subjectID}/class/${classID}/unit/${unitID}/lessons`);
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
    const fetchUnits = async () => {
      const response = await axios.get(`http://localhost:3000/unit/subject/${subjectID}/class/${classID}`);
      setUnits(response.data);
    };
    fetchUnits();

    console.log("WHATT ",userId)
    const fetchCompletedUnits = async () => {
      const response = await axios.get(`http://localhost:3000/progress/user/${userId}/completed-units`);
      const completed_units=response.data;
      console.log(completed_units)
      setCompletedUnits(completed_units);
    };
    fetchCompletedUnits();
  }, []);

  // Check if a unit is completed
  const isUnitCompleted = (unitId) => {
    console.log("check", unitId, completedUnits.includes(unitId))
    return completedUnits.includes(unitId);
  };
  
  // Check if all units are completed
  const areAllUnitsCompleted = completedUnits.length === units.length;

  const handleCongratsButtonClick = () => {
    navigate(`/subject/${subjectID}/classes`);
  };

  return (
      <div style={{
          backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/013/549/621/original/nature-landscape-illustration-with-a-cute-and-colorful-design-suitable-for-kids-background-free-vector.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          overflow: 'hidden',
          minHeight: '100vh',
        }}>

          <Typography
            variant="h1"
            sx={{
              fontSize: '64px',
              fontFamily: 'Noto Serif',
              color: '#143F6B',
              fontStyle: 'italic',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              letterSpacing: '2px',
              marginBottom: '40px'
            }}
          >
            SELECT A UNIT
          </Typography>

      <Grid container spacing={3} style={{ marginLeft: '10px'}}>
        {units.map(unit => (
          <Grid item xs={12} sm={6} md={3} key={unit._id}>
            <button onClick={() => handleSelectUnit(unit.unit_name)} style={{ ...unitButtonStyles }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {unit.unit_name} {isUnitCompleted(unit._id) && <CheckCircle sx={{ color: 'green', marginLeft: '5px' }} />}
            </button>
          </Grid>
        ))}
      </Grid>
      
      {/* Conditional rendering for the button and congratulatory message */}
      {areAllUnitsCompleted && (
        <div>
          <button onClick={handleCongratsButtonClick} style={{ ...lessonButtonStyles }}>
            Go to another class
          </button>
          <Typography variant="h4" sx={{ mt: 3 }}>
            Congratulations on completing all units!
          </Typography>
        </div>
      )}

    </div>
  );
  
}
