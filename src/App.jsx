import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png";

import {motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation';
import "./App.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-[--background]">

    <div className="container">
    <div className="text-box pt-20 typewriter   text-strt left-10">
    <TypeAnimation
      sequence={[
        'EduSpark',
        1300,
        "Let's Learn",
        900,
        'Grow with us!',
        900,   
        'Help the community',
        900,
        'Learn with Others!',
        900
      ]}
      wrapper="span"
      speed={50}
      style={{ }}
      repeat={Infinity}
    />
            <h4 className="font-bold !text-white">Your Path to Academic Success<br/> </h4>
            <p className="text-gray-300 w-2/5 ml-5 mt-5 mb-11">EduSpark is your one-stop platform for all your academic assistance needs. Whether you need help with math, science, history, or any other subject, EduSpark connects you with dedicated volunteers ready to assist you. Our user-friendly interface makes it easy for anyone to find and receive help quickly. Join EduSpark today and discover how effortless getting the academic support you need can be!</p>
            <a className='ml-5 mt-10 btn rounded-lg px-20 py-3 text-bold hover:bg-white mt-20 ' href="/login/" >Get Started</a>
            
        </div>
    </div>
    <Navbar />
    <img src={pattern} style={{ height: "100vh" }} className="absolute top-0 right-0 z-[9] hue-rotate-[-250deg]" />
    </div>
  )
}

export default App
