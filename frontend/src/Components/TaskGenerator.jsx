import React, { useState } from "react";

const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "AIzaSyCdpr_zkmJJEDtIfH9skmqT8VTuc7bSbp0";

const TaskGenerator = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateTasks = async () => {
    setLoading(true);
    setError("");
    setTasks([]);

    try {
      const prompt = `Generate 5 actionable, concise study tasks for a high school student.
Please respond with a JSON array of strings, each string being one task.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            temperature: 0.7,
            maxOutputTokens: 256,
            responseMimeType: "application/json",
          }),
        }
      );

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const tasksList = JSON.parse(text);

      if (Array.isArray(tasksList)) {
        setTasks(tasksList);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to generate tasks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl w-full md:w-[40%] shadow-lg text-white font-poppins">
      <h2 className="text-3xl font-bold text-[#A46BEC] mb-6">🤖 AI Study Task Generator</h2>
      <button
        onClick={generateTasks}
        disabled={loading}
        className="w-full mb-6 py-3 bg-gradient-to-r from-[#7a3ed6] to-[#a46bec] rounded-md font-bold hover:from-[#a46bec] hover:to-[#7a3ed6] transition disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Study Tasks"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul className="list-disc list-inside space-y-2 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-[#A46BEC]">
        {tasks.map((task, i) => (
          <li key={i} className="text-gray-300">
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskGenerator;