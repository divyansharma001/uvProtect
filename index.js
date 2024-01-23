import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import 'dotenv/config'

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const openCageAPI = process.env.OPEN_CAGE_KEY;
const yourApiKey = process.env.OPEN_UV_KEY;
const formattedTimesIST = [];
var place;

let lat = null;
let lng = null;
var uvEjsZero;
var uvEjsOne;
var uvEjsTwo;
var uvEjsThree;
var uvEjsFour;
var uvEjsFive;
var uvEjsSix;
var uvEjsSeven;
var uvEjsEight;
var uvEjsNine;
var uvEjsTen;

var dateZero;
var dateOne;
var dateTwo;
var dateThree;
var dateFour;
var dateFive;
var dateSix;
var dateSeven;
var dateEight;
var dateNine;
var dateTen;

var cityEjs;
var stateEjs;
var countryEjs;


var formattedTimeZero;
var formattedTimeOne;
var formattedTimeTwo;
var formattedTimeThree;
var formattedTimeFour;
var formattedTimeFive;
var formattedTimeSix;
var formattedTimeSeven;
var formattedTimeEight;
var formattedTimeNine;
var formattedTimeTen;


app.get('/', (req,res)=>{
  res.render('index', {
    city : cityEjs,
    state : stateEjs,
    country : countryEjs,
    uvZero : uvEjsZero,
    uvOne : uvEjsOne,
    uvTwo : uvEjsTwo,
    uvThree : uvEjsThree,
    uvFour : uvEjsFour,
    uvFive : uvEjsFive,
    uvSix : uvEjsSix,
    uvSeven : uvEjsSeven,
    uvEight : uvEjsEight,
    uvNine : uvEjsNine,
    uvTen : uvEjsTen,
    timeZero : formattedTimeZero,
    timeOne : formattedTimeOne,
    timeTwo : formattedTimeTwo,
    timeThree: formattedTimeThree,
    timeFour : formattedTimeFour,
    timeFive : formattedTimeFive,
    timeSix : formattedTimeSix,
    timeSeven : formattedTimeSeven,
    timeEight : formattedTimeEight,
    timeNine : formattedTimeNine,
    timeTen : formattedTimeTen,
  }
  );
})




        


app.post('/', async (req, res) => {
  const { latitude, longitude } = req.body.user;

  if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
    lat = Math.round(latitude*100)/100;
    lng = Math.round(longitude*100)/100;

    console.log('Received latitude:', lat);
    console.log('Received longitude:', lng);

    try {
      const geocodingResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${openCageAPI}`);
      cityEjs = geocodingResponse.data.results[0].components.city || geocodingResponse.data.results[0].components.state_district;
      stateEjs = geocodingResponse.data.results[0].components.state;
      countryEjs = geocodingResponse.data.results[0].components.country;
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const alt = '100';
    const dateobj = new Date();
    const dt = dateobj.toISOString();
    

    if (lat !== null && lng !== null) {
      try {
        const uvResponse = await axios.get(
          `https://api.openuv.io/api/v1/forecast?lat=${latitude}&lng=${longitude}&alt=${alt}&dt=${dt}`,
          {
            headers: {
              'x-access-token': yourApiKey,
            },
          }
        );

        uvEjsZero = uvResponse.data.result[0].uv;
        uvEjsOne = uvResponse.data.result[1].uv;
        uvEjsTwo = uvResponse.data.result[2].uv;
        uvEjsThree = uvResponse.data.result[3].uv;
        uvEjsFour = uvResponse.data.result[4].uv;
        uvEjsFive = uvResponse.data.result[5].uv;
        uvEjsSix = uvResponse.data.result[6].uv;
        uvEjsSeven = uvResponse.data.result[7].uv;
        uvEjsEight = uvResponse.data.result[8].uv;
        uvEjsNine = uvResponse.data.result[9].uv;
        uvEjsTen = uvResponse.data.result[10].uv;

      console.log(cityEjs);

      for (let i = 0; i < 11; i++) {
        const dateUTC = new Date(uvResponse.data.result[i].uv_time);
        const offsetIST = 5.5 * 60 * 60 * 1000; // 5.5 hours ahead of UTC for Indian Standard Time
        const dateIST = new Date(dateUTC.getTime() + offsetIST);
    
        const formattedTime = `${dateIST.getHours().toString().padStart(2, '0')}:${dateIST.getMinutes().toString().padStart(2, '0')}`;
        formattedTimesIST.push(formattedTime);
    }
    
   formattedTimeZero = formattedTimesIST[0];
   formattedTimeOne = formattedTimesIST[1];
   formattedTimeTwo = formattedTimesIST[2];
   formattedTimeThree = formattedTimesIST[3]; 
   formattedTimeFour = formattedTimesIST[4];
   formattedTimeFive = formattedTimesIST[5];
   formattedTimeSix = formattedTimesIST[6];
   formattedTimeSeven = formattedTimesIST[7];
   formattedTimeEight = formattedTimesIST[8];
   formattedTimeNine = formattedTimesIST[9];
   formattedTimeTen = formattedTimesIST[10];

     console.log(JSON.stringify(formattedTimesIST[0]));


      } catch (error) {
        res.status(404).send(error.message);
        return;
      }
    } else {
      res.status(400).send('Invalid latitude or longitude');
      return;
    }

    res.send('Location received by the server');
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});