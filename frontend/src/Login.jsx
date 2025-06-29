import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png";
import "./Login.css";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [err, setErr] = useState("");
  const history = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [UserType, setUserType] = useState("Student"); 

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/04D2430AAFE10AA4/signup/", {
        email: email,
        username: username,
        password: password,
        age:age,
        userType: UserType,
      });
      if (UserType === "Mentor"){
        history("/mentor/");
      }else {  history("/");}
      
      setErr("");
      const token = response.data.token;

      localStorage.setItem("token", JSON.stringify(token));
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
      console.log(response.data);
      localStorage.setItem("Data", JSON.stringify(response.data));
    } catch (error) {
      setErr(error.response.data.error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/04D2430AAFE10AA4/login/", {
        username: loginEmail,
        password: loginPassword,
      });
      history("/");
      setErr("");
      console.log(response);
      const token = response.data.token;
      console.log(token);
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("Data", JSON.stringify(response.data));
    } catch (error) {
      setErr(error.response.data.error);
    }
  };

  return (
    <>
      <img src={pattern} style={{ height: "100vh" }} className="absolute right-0 hue-rotate-[-250deg]" />
      <div className="main absolute mt-10">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form onSubmit={handleSignup} className="mb-20 form">
            <label className="text-black mt-[10vh]" htmlFor="chk">
              Sign Up
            </label>
            <p className="text-red-600 font-bold text-center mb-5">{err}</p>
            <div className="radio-inputs mt-[7vh] ">
              <label className="radio">
                <input type="radio" name="userType" value="Student" checked={UserType === "Student"} onChange={() => setUserType("Student")} />
                <span className="name">Student</span>
              </label>
              <label className="radio">
                <input type="radio" name="userType" value="Mentor" checked={UserType === "Mentor"} onChange={() => setUserType("Mentor")} />
                <span className="name">Mentor</span>
              </label>
            </div>
            <input className="py-5 m-auto mb-5 " type="text" name="txt" placeholder="Name: " required onChange={(e) => setUsername(e.target.value)} />
            <input className="py-5 m-auto mb-5" type="text" name="Age" placeholder="Age: " required onChange={(e) => setAge(e.target.value)} />
            <input className="py-5 m-auto mb-5" type="email" name="email" placeholder="Email: " required onChange={(e) => setEmail(e.target.value)} />
            <input className="py-5 m-auto mb-5" type="password" name="pswd" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
            <button className="m-auto button" type="submit">
              Sign Up
            </button>
          </form>
        </div>

        <div className="login">
          <form onSubmit={handleLogin}>
            <label htmlFor="chk" className="pt-[3vh] mt-[7vh]" aria-hidden="true">
              Login
            </label>
            <p className="text-red-600 font-bold text-center mb-5 mt-[10vh]">{err}</p>
            <input className="py-5 m-auto mb-5 mt-[15vh]" type="email" name="email" placeholder="Email: " required="" onChange={(e) => setLoginEmail(e.target.value)} />
            <input className="py-5 m-auto mb-5" type="password" name="pswd" placeholder="Password" required="" onChange={(e) => setLoginPassword(e.target.value)} />
            <button className="button mt-[10vh]" type="submit">
              Log In
            </button>
          </form>
        </div>
      </div>
      <Navbar />
    </>
  );
}
