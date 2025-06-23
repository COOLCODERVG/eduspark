import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar";
import { useParams } from 'react-router-dom';

export default function Assignments () {
    const [events, setEvents] = useState([]);
    const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"type":"Student"}');
    const {event_id} = useParams();
    async function fetchData () {

        const token = localStorage.getItem("token");
        const response2 = await axios.get(
            `http://127.0.0.1:8000/04D2430AAFE10AA4/getassignments/${event_id}/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
        setEvents(response2.data);
        console.log(response2.data);
        

    }
    useEffect(() => {
        fetchData();
      }, []);
    return (
        <div>
            <NavBar />
            {events.map((obj, key) => (
          <div className="notification absolute top-[10vh] mb-3 border border-4 border-[--accent]" onClick={(e) => setIndex(key)} key={key}>
            <div className="notiglow"></div>
            <div className="notiborderglow"></div>
            <div className="notititle">{obj["assginment_name"]}</div>
            <div className="notibody">{obj["assginment_Description"]}</div>
            <div className="notibody">{obj["assginment_due_date"]}</div>
          </div>
        ))}

        </div>
    )
}