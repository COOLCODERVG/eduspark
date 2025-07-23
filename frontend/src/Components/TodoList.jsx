import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaMagic } from "react-icons/fa";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [bigTask, setBigTask] = useState("");

  // State for manual step creation
  const [manualStep, setManualStep] = useState({
    stepNumber: "",
    title: "",
    description: "",
    category: "",
    estimatedTime: ""
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalIndex, setTaskModalIndex] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const stepListRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    if (typeof task === "string") {
      if (task.trim()) {
        setTasks((prev) => [...prev, { title: task, description: "", category: "General", done: false }]);
      }
    } else if (task && task.title) {
      setTasks((prev) => [...prev, { ...task, done: false }]);
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

  // Add or edit a manual step
  const handleManualStep = () => {
    if (!manualStep.title || !manualStep.stepNumber) return;
    const step = {
      ...manualStep,
      stepNumber: Number(manualStep.stepNumber)
    };
    if (editIndex !== null) {
      // Delete old step and add new one
      setTasks((prev) => {
        const updated = prev.filter((_, i) => i !== editIndex);
        return [...updated, { ...step, done: false }];
      });
      setEditIndex(null);
    } else {
      setTasks((prev) => [...prev, { ...step, done: false }]);
    }
    setManualStep({ stepNumber: "", title: "", description: "", category: "", estimatedTime: "" });
    setShowCreateModal(false);
    // Scroll to bottom after a short delay to ensure DOM update
    setTimeout(() => {
      if (stepListRef.current) {
        stepListRef.current.scrollTop = stepListRef.current.scrollHeight;
      }
    }, 100);
  };

  // Start editing a step
  const startEditStep = (i) => {
    setManualStep({
      stepNumber: tasks[i].stepNumber || "",
      title: tasks[i].title || "",
      description: tasks[i].description || "",
      category: tasks[i].category || "",
      estimatedTime: tasks[i].estimatedTime || ""
    });
    setEditIndex(i);
    setShowCreateModal(true);
  };
  // Open task details modal
  const openTaskModal = (i) => {
    setTaskModalIndex(i);
    setShowTaskModal(true);
  };
  // Close modals
  const closeModals = () => {
    setShowCreateModal(false);
    setShowTaskModal(false);
    setShowAiModal(false);
    setEditIndex(null);
    setManualStep({ stepNumber: "", title: "", description: "", category: "", estimatedTime: "" });
  };

  // Enhanced Gemini API call to generate structured tasks
  const generateTasks = async () => {
    if (!bigTask.trim()) {
      setError("Please enter a goal or task to break down");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const prompt = `Break down the following big task or goal into a step-by-step actionable plan for a high school student. Each step should be clear, specific, and manageable.

Big Task: ${bigTask}
Subject/Focus: ${subject || "General"}

You must respond with ONLY a valid JSON array of objects. Each object must have exactly these fields:
- stepNumber: the order of the step (1, 2, 3, ...)
- title: short step title (maximum 50 characters)
- description: 1-2 sentence actionable description
- category: subject or skill area (e.g., Math, Science, English, Study Skills)
- estimatedTime: suggested time to complete (e.g., "20 min", "1 hour")

Example format:
[
  {
    "stepNumber": 1,
    "title": "Gather Research Materials",
    "description": "Collect books, articles, and online resources about the topic.",
    "category": "Research",
    "estimatedTime": "30 min"
  },
  {
    "stepNumber": 2,
    "title": "Create Outline",
    "description": "Organize your research into a structured outline with main points.",
    "category": "Planning", 
    "estimatedTime": "45 min"
  }
]

Respond with ONLY the JSON array, no additional text or formatting.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        }
      );

      if (!response.ok) {
        let errorMsg = `Failed to fetch from Gemini API (status: ${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error && errorData.error.message) {
            errorMsg += `: ${errorData.error.message}`;
          } else if (errorData && errorData.message) {
            errorMsg += `: ${errorData.message}`;
          }
        } catch (jsonErr) {
          errorMsg += ". (Could not parse error details)";
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Clean up the response text
      text = text.trim();
      if (text.startsWith('```json')) {
        text = text.replace(/^```json\n?/, '').replace(/```$/, '').trim();
      } else if (text.startsWith('```')) {
        text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
      }

      let newTasks = [];
      try {
        newTasks = JSON.parse(text);
      } catch (parseErr) {
        console.error("Parse error:", parseErr);
        console.error("Raw response:", text);
        throw new Error("Could not parse AI response as valid JSON. Please try again.");
      }

      if (!Array.isArray(newTasks)) {
        throw new Error("AI did not return a valid array of tasks.");
      }

      // Validate task structure
      const validTasks = newTasks.filter(task => 
        task && 
        typeof task === 'object' && 
        task.title && 
        task.stepNumber &&
        task.description &&
        task.category &&
        task.estimatedTime
      );

      if (validTasks.length === 0) {
        throw new Error("No valid tasks found in AI response.");
      }

      // Clear existing tasks and add new ones
      setTasks([]);
      validTasks.forEach((task) => addTask(task));
      
      // Close AI modal and clear inputs
      setShowAiModal(false);
      setBigTask("");
      setSubject("");
      
    } catch (e) {
      setError(e.message || "Error generating tasks. Please try again.");
      console.error("Gemini API error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl w-full md:w-[40%] shadow-lg text-white font-poppins min-h-[calc(80vh-3rem)] my-6 flex flex-col">
      <h2 className="text-2xl font-bold text-[#A46BEC] mb-4 flex items-center justify-between">
        📋 To-Do Steps
        <div className="flex gap-2">
          <button
            className="bg-gradient-to-r from-[#A46BEC] to-[#7a3ed6] text-white rounded-full p-2 hover:scale-105 transition-all duration-200 shadow-lg"
            title="Generate AI Steps"
            onClick={() => setShowAiModal(true)}
          >
            <FaMagic size={16} />
          </button>
          <button
            className="bg-[#A46BEC] text-white rounded-full p-2 hover:bg-[#7a3ed6] transition flex items-center"
            title="Add Step"
            onClick={() => { setShowCreateModal(true); setEditIndex(null); setManualStep({ stepNumber: "", title: "", description: "", category: "", estimatedTime: "" }); }}
          >
            <FaPlus size={16} />
          </button>
        </div>
      </h2>

      {/* AI Task Generation Modal */}
      {showAiModal && (
        <div className="!fixed !inset-0 !z-[9999] !flex !items-center !justify-center !bg-black/60 !backdrop-blur-sm !m-0 !p-0">
          <div className="!bg-gradient-to-br !from-[#2a2440] !to-[#1a1830] !rounded-2xl !w-[95vw] !max-w-2xl !max-h-[90vh] !overflow-y-auto !shadow-2xl !border !border-white/10 !m-4 !p-8">
            {/* Header */}
            <div className="!flex !items-center !justify-between !mb-6 !pr-12 !m-0">
              <h3 className="!text-2xl !font-bold !text-white !flex !items-center !gap-3 !m-0">
                <span className="!text-3xl !m-0">🤖</span>
                Break Down Your Goal
              </h3>
              <button
                className="!absolute !top-4 !right-4 !text-white/60 hover:!text-red-400 !transition-all !duration-200 !p-2 hover:!bg-red-400/10 !rounded-full !z-10 !m-0"
                onClick={closeModals}
                title="Close"
              >
                <FaTimes className="!w-5 !h-5 !m-0" />
              </button>
            </div>

            {/* Form */}
            <div className="!space-y-4 !mb-6">
              <div className="!m-0">
                <label className="!block !text-sm !font-semibold !text-white/80 !mb-2 !m-0">
                  What's your big goal or task? *
                </label>
                <textarea
                  placeholder="e.g., Write a research paper on climate change, Prepare for math final exam, Learn to code in Python..."
                  value={bigTask}
                  onChange={e => setBigTask(e.target.value)}
                  className="!w-full !p-3 !text-base !bg-black/20 !border !border-white/20 !rounded-lg !text-white !placeholder-white/40 focus:!border-[#A46BEC] focus:!ring-2 focus:!ring-[#A46BEC]/20 !transition-all !duration-200 !min-h-[80px] !resize-none !m-0"
                  rows={3}
                />
              </div>

              <div className="!m-0">
                <label className="!block !text-sm !font-semibold !text-white/80 !mb-2 !m-0">
                  Subject/Category (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Math, Science, English, Programming..."
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="!w-full !p-3 !text-base !bg-black/20 !border !border-white/20 !rounded-lg !text-white !placeholder-white/40 focus:!border-[#A46BEC] focus:!ring-2 focus:!ring-[#A46BEC]/20 !transition-all !duration-200 !m-0"
                />
              </div>

              {error && (
                <div className="!p-3 !bg-red-500/20 !border !border-red-500/40 !rounded-lg !text-red-300 !text-sm !m-0">
                  {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="!flex !gap-3 !justify-end !mt-6 !m-0">
              <button
                onClick={closeModals}
                className="!px-6 !py-3 !text-base !bg-white/10 !text-white/80 hover:!bg-white/20 !rounded-lg !font-semibold !transition-all !duration-200 hover:!scale-105 !m-0"
              >
                Cancel
              </button>
              <button
                onClick={generateTasks}
                disabled={loading || !bigTask.trim()}
                className="!px-6 !py-3 !text-base !bg-gradient-to-r !from-[#A46BEC] !to-[#7a3ed6] !text-white !rounded-lg !font-semibold hover:!scale-105 !transition-all !duration-200 !shadow-lg hover:!shadow-xl disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!scale-100 !m-0"
              >
                {loading ? "Generating..." : "Generate Steps"} ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Step Modal - Enhanced UI */}
      {showCreateModal && (
        <div className="!fixed !inset-0 !z-[9999] !flex !items-center !justify-center !bg-black/60 !backdrop-blur-sm !m-0 !p-0">
          <div className="!bg-gradient-to-br !from-[#2a2440] !to-[#1a1830] !rounded-2xl !w-[95vw] !max-w-3xl !max-h-[90vh] !overflow-y-auto !shadow-2xl !border !border-white/10 !m-4 !p-8">
            {/* Header */}
            <div className="!flex !items-center !justify-between !mb-6 !pr-12 !m-0">
              <h3 className="!text-2xl !font-bold !text-white !flex !items-center !gap-3 !m-0">
                <span className="!text-3xl !m-0">✨</span>
                {editIndex !== null ? "Edit Step" : "Create New Step"}
              </h3>
              <button
                className="!absolute !top-4 !right-4 !text-white/60 hover:!text-red-400 !transition-all !duration-200 !p-2 hover:!bg-red-400/10 !rounded-full !z-10 !m-0"
                onClick={closeModals}
                title="Close"
              >
                <FaTimes className="!w-5 !h-5 !m-0" />
              </button>
            </div>

            {/* Form Grid - More Horizontal Layout */}
            <div className="!grid !grid-cols-4 !gap-4 !mb-6 !m-0">
              {/* Step Number */}
              <div className="!col-span-1 !m-0">
                <label className="!block !text-sm !font-semibold !text-white/80 !mb-2 !m-0">
                  Step # *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={manualStep.stepNumber}
                  onChange={e => setManualStep(s => ({ ...s, stepNumber: e.target.value }))}
                  className="!w-full !p-3 !text-base !bg-black/20 !border !border-white/20 !rounded-lg !text-white !placeholder-white/40 focus:!border-[#A46BEC] focus:!ring-2 focus:!ring-[#A46BEC]/20 !transition-all !duration-200 !m-0"
                />
              </div>

              {/* Category */}
              <div className="!col-span-1 !m-0">
                <label className="!block !text-sm !font-semibold !text-white/80 !mb-2 !m-0">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Math, Science..."
                  value={manualStep.category}
                  onChange={e => setManualStep(s => ({ ...s, category: e.target.value }))}
                  className="!w-full !p-3 !text-base !bg-black/20 !border !border-white/20 !rounded-lg !text-white !placeholder-white/40 focus:!border-[#A46BEC] focus:!ring-2 focus:!ring-[#A46BEC]/20 !transition-all !duration-200 !m-0"
                />
              </div>

              {/* Estimated Time */}
              <div className="!col-span-2 !m-0">
                <label className="!block !text-sm !font-semibold !text-white/80 !mb-2 !m-0">
                  Estimated Time
                </label>
                <input
                  type="text"
                  placeholder="30 min, 1 hour..."
                  value={manualStep.estimatedTime}
                  onChange={e => setManualStep(s => ({ ...s, estimatedTime: e.target.value }))}
                  className="!w-full !p-3 !text-base !bg-black/20 !border !border-white/20 !rounded-lg !text-white !placeholder-white/40 focus:!border-[#A46BEC] focus:!ring-2 focus:!ring-[#A46BEC]/20 !transition-all !duration-200 !m-0"
                />
              </div>

              {/* Title - Full width */}
              <div className="!col-span-4 !m-0">
                <label className="!block !text-sm !font-semibold !text-white/80 !mb-2 !m-0">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={manualStep.title}
                  onChange={e => setManualStep(s => ({ ...s, title: e.target.value }))}
                  className="!w-full !p-3 !text-base !bg-black/20 !border !border-white/20 !rounded-lg !text-white !placeholder-white/40 focus:!border-[#A46BEC] focus:!ring-2 focus:!ring-[#A46BEC]/20 !transition-all !duration-200 !m-0"
                />
              </div>

              {/* Description - Full width */}
              <div className="!col-span-4 !m-0">
                <label className="!block !text-sm !font-semibold !text-white/80 !mb-2 !m-0">
                  Description
                </label>
                <textarea
                  placeholder="Detailed description of what to do..."
                  value={manualStep.description}
                  onChange={e => setManualStep(s => ({ ...s, description: e.target.value }))}
                  className="!w-full !p-3 !text-base !bg-black/20 !border !border-white/20 !rounded-lg !text-white !placeholder-white/40 focus:!border-[#A46BEC] focus:!ring-2 focus:!ring-[#A46BEC]/20 !transition-all !duration-200 !min-h-[100px] !resize-none !m-0"
                  rows={4}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="!flex !gap-3 !justify-end !mt-6 !m-0">
              <button
                onClick={closeModals}
                className="!px-6 !py-3 !text-base !bg-white/10 !text-white/80 hover:!bg-white/20 !rounded-lg !font-semibold !transition-all !duration-200 hover:!scale-105 !m-0"
              >
                Cancel
              </button>
              <button
                onClick={handleManualStep}
                className="!px-6 !py-3 !text-base !bg-gradient-to-r !from-[#A46BEC] !to-[#7a3ed6] !text-white !rounded-lg !font-semibold hover:!scale-105 !transition-all !duration-200 !shadow-lg hover:!shadow-xl disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!scale-100 !m-0"
                disabled={!manualStep.title || !manualStep.stepNumber}
              >
                {editIndex !== null ? "Update Step" : "Create Step"} ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal - Enhanced UI */}
      {showTaskModal && taskModalIndex !== null && tasks[taskModalIndex] && (
        <div className="!fixed !inset-0 !z-[9999] !flex !items-center !justify-center !bg-black/60 !backdrop-blur-sm !m-0 !p-0">
          <div className="!bg-gradient-to-br !from-[#2a2440] !to-[#1a1830] !rounded-2xl !w-[95vw] !max-w-xl !max-h-[90vh] !overflow-y-auto !shadow-2xl !border !border-white/10 !m-4 !p-8">
            {/* Close Button */}
            <button
              className="!absolute !top-4 !right-4 !text-white/60 hover:!text-red-400 !transition-all !duration-200 !p-2 hover:!bg-red-400/10 !rounded-full !z-10 !m-0"
              onClick={closeModals}
              title="Close"
            >
              <FaTimes className="!w-5 !h-5 !m-0" />
            </button>

            {/* Header with Step Number */}
            <div className="!flex !items-center !mb-6 !pr-12 !m-0">
              <div className="!flex !items-center !justify-center !w-16 !h-16 !rounded-2xl !bg-gradient-to-br !from-[#A46BEC] !to-[#7a3ed6] !text-white !text-2xl !font-bold !mr-4 !shadow-lg !m-0">
                {tasks[taskModalIndex].stepNumber || taskModalIndex + 1}
              </div>
              <div className="!flex-1 !min-w-0 !m-0">
                <h3 className="!text-2xl !font-bold !text-white !mb-2 !truncate !m-0">
                  {tasks[taskModalIndex].title || tasks[taskModalIndex].text}
                </h3>
                <div className="!flex !gap-2 !flex-wrap !m-0">
                  {tasks[taskModalIndex].category && (
                    <span className="!px-3 !py-1 !text-sm !bg-[#A46BEC] !text-white !rounded-full !font-medium !m-0">
                      {tasks[taskModalIndex].category}
                    </span>
                  )}
                  {tasks[taskModalIndex].estimatedTime && (
                    <span className="!px-3 !py-1 !text-sm !bg-white/10 !text-white/80 !rounded-full !font-medium !m-0">
                      ⏱️ {tasks[taskModalIndex].estimatedTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {tasks[taskModalIndex].description && (
              <div className="!mb-6 !p-4 !bg-black/20 !rounded-lg !border !border-white/10 !m-0">
                <h4 className="!text-sm !font-semibold !text-white/80 !mb-2 !m-0">Description</h4>
                <p className="!text-base !text-white/90 !leading-relaxed !m-0">
                  {tasks[taskModalIndex].description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="!flex !gap-3 !justify-end !mt-6 !m-0">
              <button
                onClick={() => { startEditStep(taskModalIndex); setShowTaskModal(false); }}
                className="!flex !items-center !gap-2 !px-4 !py-3 !text-base !bg-white/10 hover:!bg-white/20 !text-white !rounded-lg !font-semibold !transition-all !duration-200 hover:!scale-105 !m-0"
                title="Edit Step"
              >
                <FaEdit className="!w-4 !h-4 !m-0" />
                Edit
              </button>
              <button
                onClick={() => { deleteTask(taskModalIndex); closeModals(); }}
                className="!flex !items-center !gap-2 !px-4 !py-3 !text-base !bg-red-500/20 hover:!bg-red-500/30 !text-red-400 !rounded-lg !font-semibold !transition-all !duration-200 hover:!scale-105 !m-0"
                title="Delete Step"
              >
                <FaTrash className="!w-4 !h-4 !m-0" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-step plan section */}
      {tasks.length > 0 ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-[#7a3ed6]">Step-by-Step Plan</h3>
            <button
              className="text-xs bg-[#A46BEC] text-white px-2 py-1 rounded hover:bg-[#7a3ed6] transition"
              onClick={() => {
                const planText = tasks
                  .sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0))
                  .map((task) => `${task.stepNumber ? task.stepNumber + '. ' : ''}${task.title} [${task.category || ''}] (${task.estimatedTime || ''})\n${task.description || ''}`)
                  .join('\n\n');
                navigator.clipboard.writeText(planText);
              }}
            >
              Copy Plan
            </button>
          </div>
          <ol ref={stepListRef} className="relative border-l-2 border-[#A46BEC]/30 pl-4 space-y-2 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#A46BEC]">
            {tasks
              .sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0))
              .map((task, i) => (
                <li
                  key={i}
                  className={`group bg-[#23213a] rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between border-l-4 ${task.done ? 'border-gray-500 opacity-60' : 'border-[#A46BEC]'} select-none transition-all duration-150 relative cursor-pointer`}
                  onClick={() => openTaskModal(i)}
                  style={{ minHeight: '48px' }}
                >
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-[#A46BEC] text-white text-xs font-bold border-2 border-[#1E1E1E]">{task.stepNumber || i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-0.5">
                      <span className="font-bold text-base text-white mr-2 truncate max-w-[120px]">{task.title || task.text}</span>
                      {task.category && <span className="ml-1 text-[10px] bg-[#A46BEC] text-white px-2 py-0.5 rounded">{task.category}</span>}
                      {task.estimatedTime && <span className="ml-1 text-[10px] bg-[#3d2f6f] text-white px-2 py-0.5 rounded">{task.estimatedTime}</span>}
                    </div>
                    {task.description && <div className="text-xs text-gray-300 truncate max-w-[300px]">{task.description}</div>}
                  </div>
                  <div className="flex gap-1 mt-1 md:mt-0">
                    <button
                      onClick={e => { e.stopPropagation(); startEditStep(i); }}
                      className="text-[#A46BEC] hover:text-[#7a3ed6] p-1 rounded-full"
                      title="Edit Step"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); deleteTask(i); }}
                      className="text-red-400 hover:text-red-600 p-1 rounded-full"
                      title="Delete Step"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </li>
              ))}
          </ol>
        </div>
      ) : (
        <div className="text-gray-400 text-center mb-4 text-sm">
          No steps yet. Use the <FaMagic className="inline mx-1" /> AI button to break down your goals or create steps manually!
        </div>
      )}
    </div>
  );
};

export default TodoList;
