import React from "react";
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png";
import TaskGenerator from "./Components/TaskGenerator";
import TodoList from "./Components/TodoList";
import ChatbotBubble from "./Components/ChatbotBubble";

const Tasks = () => {
  return (
    <div className="bg-[--background] relative h-screen overflow-hidden">
      <Navbar />
      <div className="w-[90vw] pt-20 pb-20 !left-0 flex flex-wrap gap-10 justify-left items-start relative z-[10] max-h-[calc(100vh-80px)] overflow-y-auto mx-auto">
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
