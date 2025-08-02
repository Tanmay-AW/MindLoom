import { useState, useEffect } from "react";

const DailyPrompt = () => {
  const today = new Date().toISOString().split("T")[0];
  const prompt = "What’s one thing that made you smile today?";

  const saved = JSON.parse(localStorage.getItem("dailyPrompt")) || {};
  const [text, setText] = useState(saved[today] || "");
  const [submitted, setSubmitted] = useState(Boolean(saved[today]));

  const moodIcons = ["😄", "🙂", "😐", "😟", "😭"];
  const [selectedMood, setSelectedMood] = useState(null);

  // 🔥 Streak Calculation
  const lastDates = Object.keys(saved).sort().reverse();
  let streak = 0;
  for (let i = 0; i < lastDates.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    const formatted = expected.toISOString().split("T")[0];
    if (lastDates[i] === formatted) {
      streak++;
    } else {
      break;
    }
  }

  const handleSubmit = () => {
    const updated = { ...saved, [today]: text };
    localStorage.setItem("dailyPrompt", JSON.stringify(updated));
    setSubmitted(true);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-10">

      <div className="bg-white rounded-xl p-5 shadow">
        <h2 className="text-xl font-semibold mb-2">📝 Daily Prompt</h2>
        <p className="mb-4 text-gray-700 italic">"{prompt}"</p>

        {!submitted ? (
          <>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Write your reflection..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Reflection
            </button>
          </>
        ) : (
          <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded">
            ✅ Submitted! Great job showing up today. Come back tomorrow 🌱
          </div>
        )}

        {streak > 0 && (
          <div className="mt-6 text-center">
            <p className="text-orange-600 font-semibold text-lg">
              🔥 You're on a <span className="underline">{streak}-day</span> streak!
            </p>
            <p className="text-gray-600 mt-1">Keep showing up for yourself 💪 You're doing great.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPrompt;
