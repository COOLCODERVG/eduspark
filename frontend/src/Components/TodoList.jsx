import React, { useState, useEffect } from "react";

const GEMINI_API_KEY = "AIzaSyCdpr_zkmJJEDtIfH9skmqT8VTuc7bSbp0"; // Replace with your actual Gemini key

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    if (text.trim()) {
      setTasks((prev) => [...prev, { text, done: false }]);
    }
  };

  const toggleDone = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  // Gemini API call to generate tasks
  const generateTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const prompt = "Generate 5 engaging, actionable study tasks for a high school student.";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            temperature: 0.7,
            maxOutputTokens: 256,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch from Gemini API");
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Split tasks by new lines and clean up
      const newTasks = text
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t.length > 3)
        .slice(0, 5);

      // Add generated tasks to todo list
      newTasks.forEach((task) => addTask(task));
    } catch (e) {
      setError("Error generating tasks. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl w-full md:w-[40%] shadow-lg text-white font-poppins">
      <h2 className="text-3xl font-bold text-[#A46BEC] mb-6">📋 Your To-Do List</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Add a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-[#A46BEC]"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask(input);
              setInput("");
            }
          }}
        />
        <button
          onClick={() => {
            addTask(input);
            setInput("");
          }}
          className="bg-[#A46BEC] px-5 rounded-md font-semibold hover:bg-white hover:text-[#A46BEC] transition"
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>

      <button
        onClick={generateTasks}
        disabled={loading}
        className="w-full mb-6 py-3 bg-gradient-to-r from-[#7a3ed6] to-[#a46bec] rounded-md font-bold hover:from-[#a46bec] hover:to-[#7a3ed6] transition disabled:opacity-60"
      >
        {loading ? "Generating Tasks..." : "✨ Generate Study Tasks with AI"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#A46BEC]">
        {tasks.map((task, i) => (
          <li
            key={i}
            className={`flex justify-between items-center p-3 rounded-md cursor-pointer select-none ${
              task.done ? "bg-gray-700 line-through text-gray-400" : "bg-[#2a2a2a] hover:bg-[#3d2f6f]"
            }`}
            onClick={() => toggleDone(i)}
          >
            <span className="break-words flex-grow">{task.text}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(i);
              }}
              className="ml-3 text-red-400 hover:text-red-600 font-bold"
              aria-label={`Delete task ${task.text}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
