import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const colors = {
  primary: '#6A6A4B',
  text: '#3A3A3A',
  highlight: '#FFFFD5',
  white: '#ffffff'
};

export default function CompleteSurvey() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      title: "What's your first name?",
      type: 'text'
    },
    {
      id: 2,
      title: "What's your last name?",
      type: 'text'
    },
    {
      id: 3,
      title: "What's your email address?",
      type: 'email'
    },
    {
      id: 4,
      title: "What's your phone number?",
      type: 'tel'
    },
    {
      id: 5,
      title: "What's your company name?",
      type: 'text'
    },
    {
      id: 6,
      title: "What's your company website?",
      type: 'url'
    },
    {
      id: 7,
      title: "How many employees work at your company?",
      type: 'select',
      options: ["1-10", "11-50", "51-200", "201+"]
    },
    {
      id: 8,
      title: "Which departments handle customer communications?",
      type: 'multiSelect',
      options: [
        "Sales",
        "Customer Support",
        "Technical Support",
        "Product Team",
        "Billing/Finance",
        "HR/Internal",
        "Marketing"
      ]
    },
    {
      id: 9,
      title: "How many hours per week does your team spend on:",
      type: 'multiNumber',
      fields: [
        "Answering repetitive questions",
        "Searching for documents",
        "Sharing knowledge between departments"
      ]
    },
    {
      id: 10,
      title: "What's the average salary range of employees handling these tasks?",
      type: 'select',
      options: [
        "$10k-30k (Part Time)",
        "$30k-50k",
        "$51k-75k",
        "$76k-100k",
        "$100k+"
      ]
    },
    {
      id: 11,
      title: "Monthly software tool costs:",
      type: 'multiNumber',
      fields: [
        "Document management",
        "Customer support",
        "Knowledge base",
        "Communication tools",
        "Marketing and advertisement",
        "Operations and fulfillment"
      ]
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <input
            type={currentQuestion.type}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-3 border-2 rounded-lg"
            style={{ borderColor: colors.primary }}
          />
        );

      case 'select':
        return (
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="w-full p-3 text-left border-2 rounded-lg transition-colors"
                style={{
                  borderColor: answers[currentQuestion.id] === option ? colors.primary : '#ddd',
                  backgroundColor: answers[currentQuestion.id] === option ? colors.highlight : colors.white
                }}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'multiSelect':
        return (
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <label
                key={option}
                className="flex items-center p-3 border-2 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={answers[currentQuestion.id]?.includes(option)}
                  onChange={(e) => {
                    const currentAnswers = answers[currentQuestion.id] || [];
                    if (e.target.checked) {
                      handleAnswer([...currentAnswers, option]);
                    } else {
                      handleAnswer(currentAnswers.filter(a => a !== option));
                    }
                  }}
                  className="mr-3"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'multiNumber':
        return (
          <div className="space-y-4">
            {currentQuestion.fields.map((field) => (
              <div key={field} className="space-y-1">
                <label className="block text-sm font-medium">{field}</label>
                <input
                  type="number"
                  onChange={(e) => {
                    const currentAnswers = answers[currentQuestion.id] || {};
                    handleAnswer({
                      ...currentAnswers,
                      [field]: e.target.value
                    });
                  }}
                  className="w-full p-3 border-2 rounded-lg"
                  style={{ borderColor: colors.primary }}
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                backgroundColor: colors.primary
              }}
            />
          </div>
          <p className="mt-2 text-sm">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
            {currentQuestion.title}
          </h2>

          {renderQuestion()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 rounded-lg flex items-center gap-2"
              style={{
                color: colors.primary,
                opacity: currentQuestionIndex === 0 ? 0.5 : 1
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-6 py-2 rounded-lg flex items-center gap-2 text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}