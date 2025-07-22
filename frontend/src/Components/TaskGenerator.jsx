import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function TaskGenerator() {
  const [tasks, setTasks] = useState([]);
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [goal, setGoal] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [error, setError] = useState("");

  const generateTasks = async () => {
    setError("");
    setTasks([]);

    const prompt = `You are an expert study coach. Create a personalized study plan for a high school student.

Subject: ${subject || "(not specified)"}
Exam/Project Date: ${examDate || "(not specified)"}
Available Study Days Per Week: ${daysPerWeek}
Goal: ${goal || "(not specified)"}

Break the plan into daily or weekly steps, distributing topics and review sessions.

⚠️ Respond ONLY with a JSON array of objects. Do NOT include explanations, markdown, or introductory text—just return raw, valid JSON.

Each object must have:
- dateOrWeek: the date (YYYY-MM-DD) or week number
- focus: what to study or review
- details: 1-2 sentence actionable description

Example:
[
  {
    "dateOrWeek": "2024-07-01",
    "focus": "Chapter 1: Cell Structure",
    "details": "Read and summarize key points. Make flashcards for new terms."
  }
]`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      let text = data.text.trim();

      // Extract JSON array using regex
      const match = text.match(/\[\s*{[\s\S]*}\s*\]/);
      if (!match) {
        throw new Error(
          "Could not find a valid JSON array in AI response.\nRaw response:\n" +
            text
        );
      }

      const parsed = JSON.parse(match[0]);
      setTasks(parsed);
    } catch (err) {
      setError("Failed to generate tasks: " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">AI Study Plan Generator</h2>
      <Input
        placeholder="Subject (e.g., Biology)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <Input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
      />
      <Input
        type="number"
        min={1}
        max={7}
        placeholder="Study Days per Week"
        value={daysPerWeek}
        onChange={(e) => setDaysPerWeek(e.target.value)}
      />
      <Textarea
        placeholder="Goal (e.g., ace the test, improve understanding)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <Button onClick={generateTasks}>Generate Study Plan</Button>

      {error && <p className="text-red-500 whitespace-pre-wrap">{error}</p>}

      {tasks.length > 0 && (
        <div className="space-y-4 mt-4">
          {tasks.map((task, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-1">
                <p className="font-semibold text-blue-600">
                  {task.dateOrWeek.startsWith("20")
                    ? format(new Date(task.dateOrWeek), "MMMM d, yyyy")
                    : `Week ${task.dateOrWeek}`}
                </p>
                <p className="font-bold">{task.focus}</p>
                <p>{task.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
