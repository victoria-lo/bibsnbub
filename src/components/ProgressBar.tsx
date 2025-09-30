import React from 'react';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 bg-blue-500 rounded-full"
        style={{ width: `${progressPercentage}%` }}
      >
      </div>
    </div>
  );
};

export default ProgressBar;
