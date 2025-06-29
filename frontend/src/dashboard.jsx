import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import useUserLocation from './Components/useUserLocation';
import "./hours.css";
import pattern from "./assets/pattern.png";

const Hours = () => {
  const [resp, setresp] = useState([]);
  const [resp2, setresp2] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [distance, setDistance] = useState(5);
  const { userLocation, getUserLocation } = useUserLocation();
  const [events, setEvents] = useState([]);
  const [signedUpEvents, setsignedUpEvents] = useState([]);
  const [err, seterr] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
    const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"type":"Student"}');
  const history = useNavigate();

  if (usrData["Id"] === -999) {
    history("/");
  }
  const getNearby = async ( dist) => {
    try {
      
      const response = await fetch(`http://127.0.0.1:8000/04D2430AAFE10AA4/nearby/${userLocation.latitude}/${userLocation.longitude}/${dist}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setEvents(data["Events"])
      setDistances(data["Distances"])
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  async function fetchData() {
    try {
        const token = localStorage.getItem("token");

        const participantsResponse = await axios.get(
            `http://127.0.0.1:8000/04D2430AAFE10AA4/participants/${usrData["Id"]}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        setEvents(response2.data);
        setResp(response.data);
        setParticipants(participantsResponse.data);
        console.log(response.data)
    } catch (error) {
        console.log(error);
    }
}

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation !== null) {
      getNearby(5);
    }
  }, [userLocation]);

  const handleRange = (event) => {
    
    setDistance(Number(document.getElementById("range").value));

    if(userLocation !== null){
      getNearby(Number(document.getElementById("range").value));
    }
  } 



  

  return (
    <>
      <img src={pattern} style={{ height: "100vh" }} className="absolute top-0 z-50 hue-rotate-[-250deg] right-0 img" />
      <Navbar />
      <div className="w-screen h-screen bg-[--background]">
        <div className="w-1/3 mt-[20vh]">
          <div className=" inline">
      <label for="range"  class="nostyle text-white">Events within </label>
      <select name="range" className="mx-auto text-center text-[1vw] ml-[40%] mt-[2vh]" id="range" onChange={handleRange}>
        <option value="5">5 miles</option>
        <option value="15">15 miles</option>
        <option value="25">25 miles</option>
        <option value="50">50 miles</option>
      </select>
      <label for="range" class="nostyle mx-auto"></label>
      </div>
      <div className="centered relative mb-[40vw]">
      <div className="absolute left-10 w-2/5 top-20 mt-20 scrollable-container">
        {events.map((obj, key) => (
          <div className="notification mb-3 border border-4 border-green-200" onClick={(e) => setIndex(key)} key={key}>
            <div className="notiglow"></div>
            <div className="notiborderglow"></div>
            <div className="notititle">{obj["Event_Name"]}</div>
            <div className="notibody">{obj["Event_Description"]}</div>
            <div className="notibody">{obj["Event_Goal"]}</div>
            <div className="notibody">{obj["Event_Location"]}</div>
          </div>
        ))}
      </div>
      </div>
      </div>

      </div>
    </>
  );
};

export default Hours;
