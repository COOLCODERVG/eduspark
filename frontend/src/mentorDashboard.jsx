import React, { useState, useEffect } from "react";
import axios from "axios";
import pattern from "./assets/pattern.png";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";

export default function MentorDashboard () {
    const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"type":"Student"}');

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState("");
  const history = useNavigate();

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/04D2430AAFE10AA4/events/?user_id=${usrData.Id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setEvents(response.data);
    } catch (error) {

      console.log(error);
    }
  }
  useEffect(() => {
    if (usrData["type"] === "Volunteer") {
      history("/");
    }

    

    fetchData();
  }, []);
  const handleEvent = async (e) => {
    e.preventDefault();

    if ( !name || !description || !location || !date) {
      setErr("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/04D2430AAFE10AA4/mentor/session/",
        {
          user_id: usrData.Id, 
          Event_Name: name,
          Event_Description: description,
          Event_Location: location,
          Event_Time: date,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      fetchData();
      setErr("");
    } catch (error) {
      if (error["response"].data.error === "Mentor No Exist") {
        alert("Please Create a Mentor Account First")
        history("/mentor/")
      }
      console.log(error["response"].data.error);
      setErr("Error occurred while signing up event.");
    }
  };
    return (
        <div className="w-screen h-screen !overflow-hidden bg-[--background]">
           <img src={pattern} style={{ height: "100vh" }} className="absolute right-0 hue-rotate-[-250deg]" />
            <Navbar />
            <div className="w-screen h-[90vh]  mt-[10vh] flex">
                <div className="w-[35%] h-full pl-[4vh]">
                <div className="signup ">
          <form onSubmit={handleEvent} className="mb-20 mt-[13vh] ml-[4vh] form bg-white pb-[10vh] pt-[1vh] rounded-[5vh]">
            <label className="text-black !text-[2vw] !leading-[36px]">Create a Tutoring Session</label>
            <p className="text-red-600 font-bold text-center mb-5">{err}</p>
            
            <input
              className="py-5 m-auto mb-5 placeholder-black"
              type="text"
              name="name"
              value={name}
              placeholder="Event Name"
              required=""
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="py-5 m-auto mb-5 placeholder-black"
              type="text"
              name="description"
              value={description}
              placeholder="Event Description"
              required=""
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="py-5 m-auto mb-5 placeholder-black"
              type="street-address"
              name="text"
              value={location}
              placeholder="Event Location"
              required=""
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              className="py-5 m-auto mb-5 placeholder-black"
              type="datetime-local"
              name="pswd"
              value={date}
              placeholder="Event Time"
              required=""
              rows={5}
              onChange={(e) => setDate(e.target.value)}
            />
            <button className="m-auto button w-[70%]" type="submit">
              Post Event
            </button>
          </form>
        </div>
                </div>
                <div className="w-[50%] ml-[6%] h-full">
                  <h1 className="text-white text-[3vw] mt-[6vh] font-extrabold"><span className="text-[--accent]">Your{" "}</span>Events</h1>
                  <div className="relative w-full h-full">
                  <div className="absolute  tmt-20 scrollable-container">
        {events.map((obj, key) => (
          <div className="notification  mb-3 border border-4 border-[--accent]" onClick={(e) => setIndex(key)} key={key}>
            <div className="notiglow "></div>
            <div className="notiborderglow "></div>
            <div className="notititle">{obj["Event_Name"]}</div>
            <div className="notibody">{obj["Event_Description"]} </div>
            
            <div className="notibody">{obj["Event_Location"]} @ {obj["Event_Time"]}</div>
            <div className="notibody !text-blue-400 underline"> <a href={`/call?roomID=`+obj["Meet_Code"]}>Meeting Link</a> </div>
          </div>
        ))}
      </div>
      </div>
                </div>
            </div>
        </div>
    )
}