import express from "express";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY_APOD = process.env.API_KEY_APOD;
const API_KEY_TOMTOM = process.env.API_KEY_TOMTOM;

const app = express();
const port = 3000;

const apodPath = "https://api.nasa.gov/planetary/apod";

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await axios.get(apodPath, {
      params: {
        api_key: API_KEY_APOD,
        date: today,
      },
    });
    const imageOfTheDay = response.data.hdurl || response.data.url;
    const title = JSON.stringify(response.data.title);
    const date = response.data.date;
    res.render("main.ejs", {
      background: imageOfTheDay,
      title: title,
      date: date,
    });
  } catch (error) {
    const message = "Oops, something went wrong!";
    res.render("error.ejs", { error: message });
  }
});

app.get("/apod", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const response = await axios.get(apodPath, {
      params: {
        api_key: API_KEY_APOD,
        date: today,
      },
    });
    const image = response.data.hdurl || response.data.url;
    const title = response.data.title;
    const description = response.data.explanation;
    res.render("apod.ejs", {
      date: today,
      image: image,
      title: title,
      description: description,
    });
  } catch (error) {
    const message = "Fetch error, try again";
    res.render("error.ejs", { error: message });
  }
});

app.post("/get-date", async (req, res) => {
  const selectedDate = req.body.date;
  try {
    const response = await axios.get(apodPath, {
      params: {
        api_key: API_KEY_APOD,
        date: selectedDate,
      },
    });
    const image = response.data.hdurl || response.data.url;
    const title = response.data.title;
    const description = response.data.explanation;
    res.render("apod.ejs", {
      date: selectedDate,
      image: image,
      title: title,
      description: description,
    });
  } catch (error) {
    const message = "Fetch error, try again";
    res.render("error.ejs", { error: message });
  }
});

const astroPath = 'https://f-api.ir/api/facts/category/astronomy';
const tempoPath = 'https://f-api.ir/api/facts/random'

app.get('/astroFacts', async (req, res)=>{
  try{
    const response = await axios.get(tempoPath);
    // const limit = response.data.length;
    // const selected = response.data[Math.floor(Math.random() * limit)];
    const selected = response.data;
    const title = selected.title;
    const fact = selected.fact;
    const isVerified = selected.verified;
    const source = selected.source;
    res.render('astroFacts.ejs',{title:title,fact:fact,isVerified: isVerified,source:source});
  }catch(error){
    const message = "Fetch error, try again";
    res.render("error.ejs", { error: message });
  }
});

const pplPath = 'http://api.open-notify.org/astros.json';

app.get('/ppl', async(req,res)=>{
  try{
const response = await axios.get(pplPath);
  const number = response.data.number;
  const people = response.data.people;
  res.render('ppl.ejs',{number:number, people:people});
  }catch(error){
     const message = "Fetch error, try again";
    res.render("error.ejs", { error: message });
  }

})

const issPath = 'http://api.open-notify.org/iss-now.json';


app.get('/iss',async(req,res)=>{
  try{
    const response = await axios.get(issPath);
  const lat = response.data.iss_position.latitude;
  const long = response.data.iss_position.longitude;
  res.render('iss.ejs',{key: API_KEY_TOMTOM ,lat:lat, long:long});
  }catch(error){
 const message = "Fetch error, try again";
    res.render("error.ejs", { error: message });
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
