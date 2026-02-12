"use client";
import { useState } from "react";

export default function DailyPlanner() {
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!tasks.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        body: JSON.stringify({ text: tasks }),
      });

      const data = await res.json();
      setPlan(data.result);
    } catch (error) {
      alert("Error generating plan");
    }

    setLoading(false);
  };

  return (
    <div className="w-[800px] mt-10 p-6 bg-white rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">AI Daily Planner</h2>

      <textarea
        placeholder="Enter today's tasks..."
        className="w-full h-32 p-4 border rounded-lg mb-4"
        value={tasks}
        onChange={(e) => setTasks(e.target.value)}
      />

      <button
        onClick={generatePlan}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {plan && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap">{plan}</pre>
        </div>
      )}
    </div>
  );
}
