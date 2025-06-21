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
  const [participants, setParticipants] = useState([]);
  const [err, seterr] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
    const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"type":"Student"}');
  const history = useNavigate();

  if (usrData["Id"] === -999) {
    history("/");
  }
  const isUserRegistered = (event) => {
    return event.participants.includes(usrData["Id"]);
  };
  const usersDict = resp.reduce((acc, user) => {
    acc[user.id] = user.username;
    return acc;
  }, {});
  async function EventSubmit(id) {
    console.log(id)
    try {
      const token = localStorage.getItem("token");
      const response2 = await axios.post(
        `http://127.0.0.1:8000/04D2430AAFE10AA4/registerevent/`,{
          user_id:usrData["Id"],
          event_id:id
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      alert(response2.data.message)
      fetchData();
    }catch(error){
      console.log(error)
      if(error === "AxiosError: Request failed with status code 400"){
        alert("You have already signed up for that event");
      } else {
        alert(error);
      }
      
    }

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
      console.log(data)
      setEvents(data["Events"])
      setDistance(data["Distances"])
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


        setParticipants(participantsResponse.data);
        console.log(participantsResponse.data)
    } catch (error) {
        console.log(error);
    }
}

  useEffect(() => {
    fetchData();
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
      <div className="w-screen h-screen bg-[--background] overflow-hidden flex">
        <div className="w-1/3 mt-[10vh]">
          <div className="inline">
            <label htmlFor="range" className="nostyle text-white">Events within </label>
            <select name="range" className="mx-auto text-center text-[1vw] ml-[40%] mt-[2vh]" id="range" onChange={handleRange}>
              <option value="5">5 miles</option>
              <option value="15">15 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
            </select>
            <label htmlFor="range" className="nostyle mx-auto"></label>
          </div>
          <div className="centered relative mb-[10vw]">
            <div className="ml-[1vw] w-screen !h-[30vw] scrollable-container">
              {events.map((obj, key) => (
                <div className="notification mb-3 border border-4 border-white relative"  key={key}>
                  <div className="notiglow"></div>
                  <div className="notiborderglow"></div>
                  <div className="notititle">{obj["Event_Name"]}</div>
                  <div className="notibody">{obj["Event_Description"]}</div>

                  <div className="notibody flex">{obj["Event_Location"]}{!isUserRegistered(events[key]) ? (
                  <div className="ml-[20%]">
                    <button type="button" className=" px-[0.5vw] py-[0.5vh] rounded-[0.5vw] bg-green-400 text-white" onClick={(e) => EventSubmit(obj["id"])}>Register</button>
                  </div>
                ) : (
                  <div className="success-button-container ml-[20%] text-red-600 font-black">
                    <p>You are already registered for this event.</p>
                  </div>
                )}</div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-1/3 ml-[10vw] mt-[10vh]">
        <div className="inline">
            <label htmlFor="range" className="nostyle text-white ">Signed Up Events: </label>
            
          </div>
          <div className="centered relative mt-[10vh]">
            <div className="ml-[1vw] w-screen !h-[30vw] scrollable-container">
            {participants["events_participated"]?.map((obj, key) => (
    <div className="notification mb-3 border border-4 border-white"  key={key}>
      <div className="notiglow"></div>
      <div className="notiborderglow"></div>
      <div className="notititle">{obj["Event_Name"]}</div>
      <div className="notibody">{obj["Event_Description"]}</div>
      <div className="notibody flex">{obj["Event_Location"]} @ {obj["Event_Time"]}, Link: {"    "} <a className="!text-blue-400 underline ml-[4w]" href={`/call?roomID=`+obj["Meet_Code"]}>{"    "}Meeting Link</a> </div>

    </div>
  ))}
            </div>
          </div> </div>
      </div>

    </>
  );
};

export default Hours;
