import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import "./hours.css";
import pattern from "./assets/pattern.png";

const Hours = () => {
  const [events, setEvents] = useState([]);
  const [err, seterr] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isRegistered, setIsRegistered] = useState(true); // Always true since these are registered events
  const [loading, setLoading] = useState(false);
  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"type":"Student"}');
  const history = useNavigate();

  if (usrData["Id"] === -999) {
    history("/");
  }

  const getUserEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://varshg.pythonanywhere.com/04D2430AAFE10AA4/events/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      
      // Filter events where the user is a participant
      const userEvents = response.data.filter(event => 
        event.participants && event.participants.includes(usrData.Id)
      );
      
      setEvents(userEvents);
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  };

  const handleEventClick = (event, index) => {
    setSelectedEvent(event);
    setSelectedIndex(index);
  };

  useEffect(() => {
    getUserEvents();
  }, []);

  return (
    <>
      <img src={pattern} style={{ height: "100vh" }} className="absolute top-0 z-10 hue-rotate-[-250deg] right-0 img" />
      <Navbar />
      <div className="w-screen h-screen bg-[--background] overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel */}
          <div className="w-1/2 mt-[20vh] px-4">
            <h1 className="text-white text-3xl font-bold mb-6">📚 My Events</h1>
            
            {err && (
              <div className="text-center mt-4 p-2 bg-green-500 text-white rounded">
                {err}
              </div>
            )}

            <div className="mt-8 h-[60vh] overflow-y-auto scrollable-container">
              {events.length === 0 ? (
                <div className="text-white text-center p-8">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-xl">No events registered yet!</p>
                  <p className="text-gray-400 mt-2">Visit Opportunities to discover events</p>
                </div>
              ) : (
                events.map((obj, key) => (
                  <div 
                    className={`notification mb-3 border border-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedIndex === key ? 'border-blue-400 shadow-lg shadow-blue-400/50' : 'border-green-200'
                    }`} 
                    onClick={() => handleEventClick(obj, key)} 
                    key={key}
                  >
                    <div className="notiglow"></div>
                    <div className="notiborderglow"></div>
                    <div className="notititle">{obj["Event_Name"]}</div>
                    <div className="notibody">{obj["Event_Description"]}</div>
                    <div className="notibody">{obj["Event_Goal"]}</div>
                    <div className="notibody">{obj["Event_Location"]}</div>
                    <div className="notibody text-green-400">✅ Registered</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 mt-[20vh] px-8 relative z-20">
            {selectedEvent ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 h-[70vh] overflow-y-auto animate-slideIn">
                {/* Floating particles animation */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-float-1 opacity-60"></div>
                  <div className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float-2 opacity-40"></div>
                  <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-float-3 opacity-30"></div>
                </div>

                <div className="relative z-[200]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center">
                      <span className="text-4xl mr-3">🎯</span>
                      {selectedEvent["Event_Name"]}
                    </h2>
                    <button 
                      onClick={() => {setSelectedEvent(null); setSelectedIndex(null);}}
                      className="text-white/60 hover:text-white text-2xl transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Event Details Cards */}
                  <div className="space-y-4 mb-8">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">📝</span>
                        <h3 className="text-xl font-semibold text-white">Description</h3>
                      </div>
                      <p className="text-gray-300">{selectedEvent["Event_Description"]}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">🎯</span>
                        <h3 className="text-xl font-semibold text-white">Goal</h3>
                      </div>
                      <p className="text-gray-300">{selectedEvent["Event_Goal"]}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">📍</span>
                        <h3 className="text-xl font-semibold text-white">Location</h3>
                      </div>
                      <p className="text-gray-300">{selectedEvent["Event_Location"]}</p>
                    </div>

                    {selectedEvent["Event_Time"] && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-3">🕒</span>
                          <h3 className="text-xl font-semibold text-white">Time</h3>
                        </div>
                        <p className="text-gray-300">{new Date(selectedEvent["Event_Time"]).toLocaleString()}</p>
                      </div>
                    )}

                    {/* Show participant count */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">👥</span>
                        <h3 className="text-xl font-semibold text-white">Participants</h3>
                      </div>
                      <p className="text-gray-300">{selectedEvent.participants?.length || 0} people registered</p>
                    </div>
                  </div>

                  {/* Action Button - Only Video Meeting */}
                  {selectedEvent["Meet_Code"] ? (
                    <div className="mb-8">
                      <button
                        onClick={() => window.open(`/call?roomID=${selectedEvent["Meet_Code"]}`, '_blank')}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                      >
                        🎥 Join Meeting
                      </button>
                    </div>
                  ) : (
                    <div className="mb-8 bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">⏳</span>
                        <p className="text-yellow-300">Meeting link will be available closer to the event time</p>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/20">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">✅</span>
                      <h3 className="text-lg font-semibold text-white">You're Registered!</h3>
                    </div>
                    <ul className="text-gray-300 space-y-1">
                      <li>• You'll receive reminders before the event</li>
                      <li>• Check back for meeting links closer to the date</li>
                      <li>• Contact the organizer if you have questions</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <div className="animate-bounce mb-8">
                  <div className="text-8xl mb-4">📚</div>
                  <h2 className="text-4xl font-bold text-white mb-4">My Dashboard</h2>
                  <p className="text-xl text-gray-300 mb-8">Select an event to see details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Same animations as before */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float-1 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.3;
          }
        }

        @keyframes float-2 {
          0%, 100% { 
            transform: translateY(0px) translateX(100px); 
            opacity: 0.4;
          }
          33% { 
            transform: translateY(-15px) translateX(120px); 
            opacity: 0.8;
          }
          66% { 
            transform: translateY(-5px) translateX(80px); 
            opacity: 0.2;
          }
        }

        @keyframes float-3 {
          0%, 100% { 
            transform: translateY(0px) translateX(200px); 
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-25px) translateX(180px); 
            opacity: 0.7;
          }
          75% { 
            transform: translateY(-10px) translateX(220px); 
            opacity: 0.1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }

        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 6s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Hours;