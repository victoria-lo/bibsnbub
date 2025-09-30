import { Button } from '@/components/ui/button';
import React from 'react';

type NavigationButtonsProps = {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ currentStep, totalSteps, onNext, onBack }) => {
  return (
    <div className="flex justify-between mt-4">
      {currentStep > 1 && (
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      )}
      {currentStep < totalSteps && (
        <Button variant="default" onClick={onNext}>
          Next
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
