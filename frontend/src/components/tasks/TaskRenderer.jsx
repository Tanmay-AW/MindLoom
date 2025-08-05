import React from 'react';
import TextInputTask from './TextInputTask.jsx';
import MultipleChoiceTask from './MultipleChoiceTask.jsx';
import BreathingExercise from '../breathing/BreathingExercise.jsx';

const TaskRenderer = ({ task, onComplete, isCompleted }) => {
  const renderTask = () => {
    switch (task.taskType) {
      case 'breathing':
        return <BreathingExercise onComplete={() => onComplete(task.taskId)} />;
        
      case 'reflection':
      case 'gratitude':
      case 'confidence':
      case 'lettingGo':
      case 'futureSelf':
      case 'smallWin':
      case 'kindness':
      case 'imagination':
      case 'textInput':
        return <TextInputTask task={task} onComplete={onComplete} isCompleted={isCompleted} />;
      
      case 'mcq':
      case 'oddOneOut':
      case 'checkIn':
      case 'multipleChoice':
        return <MultipleChoiceTask task={task} onComplete={onComplete} isCompleted={isCompleted} />;

      default:
        return <p>Unsupported task type: {task.taskType}</p>;
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border ${isCompleted ? 'border-accent-green bg-green-50' : 'border-border-gray'}`}>
      {renderTask()}
    </div>
  );
};

export default TaskRenderer;