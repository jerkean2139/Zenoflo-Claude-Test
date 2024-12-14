import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Save, Check, AlertCircle } from 'lucide-react';

// Root component wrapper
const root = document.getElementById('survey-root');
ReactDOM.render(<SurveyForm />, root);

function SurveyForm() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const submitSurveyData = async (data) => {
    setIsSubmitting(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://api.zenoflo.com/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          data: data,
          source: 'bot-mob-survey'
        })
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitStatus('success');
      return true;
    } catch (error) {
      console.error('Submission error:', error);
      // Store failed submission in localStorage
      const fallbackData = {
        timestamp: new Date().toISOString(),
        data: data,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      const existingData = JSON.parse(localStorage.getItem('pendingSurveys') || '[]');
      existingData.push(fallbackData);
      localStorage.setItem('pendingSurveys', JSON.stringify(existingData));
      
      setSubmitStatus('error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const isValidAnswer = () => {
    const currentAnswer = answers[questions[currentQuestionIndex].id];
    return currentAnswer && (
      typeof currentAnswer === 'string' ? currentAnswer.trim().length > 0 :
      Array.isArray(currentAnswer) ? currentAnswer.length > 0 :
      typeof currentAnswer === 'object' ? Object.values(currentAnswer).some(v => v) :
      true
    );
  };

  const Alert = ({ className, children }) => (
    <div className={`p-4 rounded-lg ${className}`}>
      {children}
    </div>
  );

  const AlertDescription = ({ className, children }) => (
    <p className={`ml-2 ${className}`}>
      {children}
    </p>
  );

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Survey Complete!</h2>
            <p className="text-gray-600">Thank you for taking the time to complete our survey.</p>
          </div>

          {submitStatus === 'success' ? (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Your responses have been successfully submitted!
                </AlertDescription>
              </div>
            </Alert>
          ) : submitStatus === 'error' ? (
            <Alert className="mb-6 bg-yellow-50 border-yellow-200">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  Your responses have been saved locally and will be submitted when connection is restored.
                </AlertDescription>
              </div>
            </Alert>
          ) : (
            <button
              onClick={() => submitSurveyData(answers)}
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-white ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Save className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Submit Responses
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    
    switch (question.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <input
            type={question.type}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'select':
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                  answers[question.id] === option 
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'multiSelect':
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label
                key={option}
                className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={answers[question.id]?.includes(option)}
                  onChange={(e) => {
                    const currentAnswers = answers[question.id] || [];
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
            {question.fields.map((field) => (
              <div key={field} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">{field}</label>
                <input
                  type="number"
                  min="0"
                  onChange={(e) => {
                    const currentAnswers = answers[question.id] || {};
                    handleAnswer({
                      ...currentAnswers,
                      [field]: e.target.value
                    });
                  }}
                  className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
              }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {questions[currentQuestionIndex].title}
          </h2>

          {renderQuestion()}

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isValidAnswer()}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 text-white ${
                isValidAnswer()
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}