import React, { useState } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 'satisfaction',
      question: 'How satisfied are you with our service?',
      type: 'rating',
      options: ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
    },
    {
      id: 'features',
      question: 'Which features do you use most often?',
      type: 'multiselect',
      options: ['Chat', 'File Sharing', 'Video Calls', 'Screen Sharing', 'Notes']
    },
    {
      id: 'improvement',
      question: 'What could we improve?',
      type: 'text'
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setSubmitted(true);
      // Here you would typically send the data to your backend
      console.log('Survey submitted:', answers);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Thank you for your feedback!</AlertTitle>
        </Alert>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Question {currentStep + 1} of {questions.length}
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>

      <div className="space-y-4">
        {currentQuestion.type === 'rating' && (
          <div className="flex justify-between gap-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                className={`flex-1 p-2 text-sm rounded transition-colors ${
                  answers[currentQuestion.id] === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'multiselect' && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id]?.includes(option);
              return (
                <button
                  key={index}
                  onClick={() => {
                    const current = answers[currentQuestion.id] || [];
                    const updated = isSelected
                      ? current.filter(item => item !== option)
                      : [...current, option];
                    handleAnswer(currentQuestion.id, updated);
                  }}
                  className={`w-full p-3 text-left rounded transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Type your answer here..."
          />
        )}
      </div>

      <button
        onClick={handleNext}
        className="mt-6 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        {currentStep < questions.length - 1 ? 'Next' : 'Submit'}
      </button>
    </div>
  );
}