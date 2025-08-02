// src/components/MoodTracker.jsx

const MoodTracker = ({ selectedMood, onSelectMood }) => {
  const moods = ["😄", "🙂", "😐", "😟", "😭"];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        🧠 How are you feeling today?
      </h2>
      <div className="flex gap-4 text-3xl">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`transition hover:scale-110 ${
              selectedMood === mood ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => onSelectMood(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
      {selectedMood && (
        <p className="mt-4 text-sm text-gray-600">
          You selected: <span className="text-xl">{selectedMood}</span>
        </p>
      )}
    </div>
  );
};

export default MoodTracker;
