import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png";
import "./Login.css";
import "./opps.css";

export default function Mentor() {
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [study, setStudy] = useState("");
  const [experience, setExperience] = useState("");
  const [err, setErr] = useState("");
  const history = useNavigate();

  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"type":"Student"}');
  console.log(usrData);

  useEffect(() => {
    if (usrData["type"] === "Student") {
      history("/");
    }
  }, []); 



  const handleMentor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/04D2430AAFE10AA4/mentor/add/", {
        user_id: usrData["Id"],
        name: usrData["Username"],
        age: usrData["Age"],
        address:address,
        studyField:study,
        Experience:experience,
        headers: {
          Authorization: `Token ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      const token = response.data.token;

      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
      localStorage.setItem("token", JSON.stringify(token));
      history("/");
      setErr("");
    } catch (error) {
      console.log(error);
      setErr("Error occurred while signing up organization.");
    }
  };

  return (
    <>
      <img src={pattern} style={{ height: "100vh" }} className="absolute hue-rotate-[-250deg] right-0" />
      <div className="main absolute mt-10">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form onSubmit={handleMentor} className="mb-20 form">
            <label className="text-black h-[10vh] !leading-[6vh]" >
              Create a Mentor Account
            </label>

            <p className="text-red-600 font-bold text-center mb-5 mt-[7vh]">{err}</p>
            <input className="py-5 m-auto mb-5" type="street-address" name="address" placeholder="Your Address" required="" onChange={(e) => setAddress(e.target.value)} />
            <input className="py-5 m-auto mb-5" type="text" name="text" placeholder="Your Field of Knowledge" required="" onChange={(e) => setStudy(e.target.value)} />
            <textarea className="py-5 mx-auto mb-5 experience " type="text" name="Experience" placeholder="Your experience" required="" rows={5} onChange={(e) => setExperience(e.target.value)} />



            <button className="m-auto button" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Navbar />
    </>
  );
}
