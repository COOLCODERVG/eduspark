import React from "react";
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png";
import TaskGenerator from "./Components/TaskGenerator";
import TodoList from "./Components/TodoList";
import ChatbotBubble from "./Components/ChatbotBubble";

const Tasks = () => {
  return (
    <div className="bg-[--background] relative h-screen !overflow-y-hidden ">
      <Navbar />
      <div className="w-[100vw] pt-20 pb-20 !left-0 flex flex-wrap gap-10 justify-left items-start relative z-[10] max-h-[100vh] overflow-y-auto mx-auto h-screen overflow-y-hidden">
        {/* Adjust max height to viewport minus navbar height (example 80px) */}
        <TaskGenerator />
        <TodoList />
      </div>
      <ChatbotBubble />
      <img
        src={pattern}
        alt="pattern background"
        style={{
          height: "100vh",
          width: "auto",
          position: "fixed",
          top: 0,
          right: 0,
        }}
        className="z-[0] hue-rotate-[-250deg] overflow-hidden"
      />
    </div>
  );
};

export default Tasks;
