import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const TaskGenerator = () => {
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    setPlan([]);

    try {
      const today = new Date().toISOString().slice(0, 10);

      const prompt = `
You are an expert study coach helping a high school student prepare for an important ${subject || "Biology"} exam.

Today's date is ${today}.
The exam/project date is ${examDate || "(not specified)"}.
The student can study ${daysPerWeek} days per week and aims to score ${goal || "100%"}.

Create a detailed, personalized study plan distributed across calendar dates from today until the exam date.
- Each plan item must include a valid date (YYYY-MM-DD) that matches actual calendar days.
- Distribute study days evenly, respecting the days-per-week constraint.
- For days off, do not assign study tasks.
- The plan must cover all key ${subject || "Biology"} topics progressively, with time for review and practice.
- Each item should include:
  - dateOrWeek: a calendar date in YYYY-MM-DD format
  - focus: the specific topic/unit to study that day
  - details: 1-2 sentence actionable description (e.g., read, take notes, flashcards, practice problems)

Example:
[
  {
    "dateOrWeek": "2024-06-03",
    "focus": "Introduction to Biology & Scientific Method",
    "details": "Read about characteristics of life and scientific method; take detailed notes."
  },
  {
    "dateOrWeek": "2024-06-05",
    "focus": "Scientific Method Practice",
    "details": "Practice identifying variables, hypotheses, and experimental design through examples."
  }
]

Return only a JSON array of such objects, strictly following date accuracy and days-per-week.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        let errorMsg = `Failed to fetch from Gemini API (status: ${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData?.error?.message) {
            errorMsg += `: ${errorData.error.message}`;
          } else if (errorData?.message) {
            errorMsg += `: ${errorData.message}`;
          }
        } catch {
          errorMsg += ". (Could not parse error details)";
        }
        throw new Error(errorMsg);
      }

      let text = (await response.json())?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      text = text.trim();

      if (text.startsWith("```")) {
        text = text.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
      }

      // Extract JSON array using regex - improved robustness
      const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
      if (!jsonMatch) {
        throw new Error("Could not find a valid JSON array in AI response.\nRaw response:\n" + text);
      }
      const planArr = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(planArr)) {
        throw new Error("AI did not return a list of plan steps.");
      }
      setPlan(planArr);
    } catch (err) {
      setError(err.message || "Failed to generate plan. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl w-full md:w-[50%] shadow-lg text-white font-poppins min-h-[calc(80vh-3rem)] my-6 flex flex-col h-[100%] overflow-y-scroll">
      <h2 className="text-xl font-bold text-[#A46BEC] mb-3 flex items-center gap-2">
        <FaCalendarAlt className="text-[#A46BEC] text-lg" />
        AI Study Plan Generator
      </h2>
      <div className="bg-[#23213a] border border-[#333] rounded-md p-4 mb-4">
        <div className="flex flex-col md:flex-row md:gap-4 gap-0.5 mb-0">
          <div className="flex-1 flex flex-col !gap-1">
            <label className="!text-xs text-gray-300 !w-fit !h-fit !p-0 !m-5 !ml-0 !mb-2">Subject</label>
            <input
              type="text"
              placeholder="e.g., Biology"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs p-2 h-8 border border-[#444] bg-[#23213a] text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#A46BEC]"
            />
          </div>
          <div className="flex-1 flex flex-col !gap-1">
            <label className="!text-xs text-gray-300 !w-fit !h-fit !p-0 !m-5 !ml-0 !mb-2">Goal</label>
            <input
              type="text"
              placeholder="e.g., Score 100%"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full text-xs p-2 h-8 border border-[#444] bg-[#23213a] text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#A46BEC]"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:gap-4 gap-0.5 mb-0">
          <div className="flex-1 flex flex-col !gap-1">
            <label className="!text-xs text-gray-300 !w-fit !h-fit !p-0 !m-5 !ml-0 !mb-2">Exam/Project Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full text-xs p-2 h-8 border border-[#444] bg-[#23213a] text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#A46BEC]"
            />
          </div>
          <div className="flex-1 flex flex-col !gap-1">
            <label className="!text-xs text-gray-300 !w-fit !h-fit !p-0 !m-5 !ml-0 !mb-2">Days/Week</label>
            <input
              type="number"
              min={1}
              max={7}
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="w-full text-xs p-2 h-8 border border-[#444] bg-[#23213a] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#A46BEC]"
            />
          </div>
        </div>
        <button
          onClick={generatePlan}
          disabled={loading || !subject || !examDate || daysPerWeek < 1}
          className="bg-gradient-to-r from-[#7a3ed6] to-[#a46bec] px-4 py-2 rounded-md text-xs font-bold hover:from-[#a46bec] hover:to-[#7a3ed6] transition disabled:opacity-60 mt-1 w-full md:w-auto"
        >
          {loading ? "Generating..." : "Generate Study Plan"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4 text-xs">{error}</p>}
      {plan.length > 0 && (
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#A46BEC]">
          <h3 className="text-sm font-semibold text-[#7a3ed6] mb-2">Your Personalized Study Plan</h3>
          <ol className="space-y-3">
            {plan.map((step, i) => (
              <li
                key={i}
                className="bg-[#23213a] rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between border-l-4 border-[#A46BEC] shadow-sm"
              >
                <div className="flex items-center mb-1 md:mb-0">
                  <span className="font-bold text-xs text-white mr-2">{step.dateOrWeek}</span>
                  <span className="ml-2 text-xs bg-[#A46BEC] text-white px-2 py-1 rounded">{step.focus}</span>
                </div>
                <div className="text-xs text-gray-300 mt-1 md:mt-0 md:ml-4">{step.details}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default TaskGenerator;
