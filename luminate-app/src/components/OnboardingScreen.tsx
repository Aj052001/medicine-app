
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Check,
  ClipboardCheck,
  Plus,
  Minus
 
} from 'lucide-react';



import { useNavigate } from 'react-router-dom';

import NavigationBar from './navigation';
import { useAuth } from './UserContext';


const OnboardingScreen = () => {
  const navigate = useNavigate();
  const { authData} = useAuth();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [counters, setCounters] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const substances = ["Ketamine", "Cannabis", "⁠Ayahuasca", "Mushrooms", "⁠MDMA", "⁠LSD"];

  const questions = [
    {
      id: 1,
      question: "Which experiences have you experienced before? (Select all that apply)",
      options: substances,
      multiSelect: true
    },
    {
      id: 2,
      question: "How often do you frequent these experiences? (Select one)",
      options: ["Twice a week", "Once a week", "⁠Once every 2 weeks", "Once every month","Once every 3 months","Once every 6 months","⁠Once every year"],
      multiSelect: false
    },
    {
      id: 3,
      question: "How many times have you had each experience?",
      options: substances,
      showCounters: true,
      multiSelect: true
    },
    {
      id: 4,
      question: "Have you set an intention for your experiences before?",
      options: ["Yes", "No"],
      multiSelect: false
    },
    {
      id: 5,
      question: "What do you normally feel after the experience? (Select all that apply)",
      options: ["Clarity", "Peace", "Joy","Love","Focus","Passion","Healing"],
      multiSelect: true
    },
    {
      id: 6,
      question: "Have you ever recorded yourself speaking during an experience?",
      options: ["Yes", "No"],
      multiSelect: false
    }
  ];

 
  const handleAnswer = (option) => {
    const currentAnswers = answers[currentQuestion] || [];
    const question = questions[currentQuestion];
    
    if (question.multiSelect) {
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(item => item !== option)
        : [...currentAnswers, option];
      
      setAnswers({ ...answers, [currentQuestion]: newAnswers });
    } else {
      setAnswers({ ...answers, [currentQuestion]: [option] });
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        }
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1 && answers[currentQuestion]?.length > 0) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleNext();
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[currentQuestion]?.length > 0;
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;


 
  const handleContinue = async () => {
    const { email, token } = authData; 
  
    if (!email || !token) {
      alert("Authentication error. Please log in again.");
      return;
    }
  
    // Format answers into the required structure
    const formattedResponses = Object.entries(answers).map(([questionIndex, answer]) => {
      if (questions[questionIndex]?.id === 3) {
        // Special handling for Question 3
        return {
          question: questions[questionIndex].question,
          answer: Array.isArray(answer)
            ? answer.map((substance) => `${substance} (${counters[substance] || 0}x)`).join(', ')
            : answer,
        };
      }
  
      return {
        question: questions[questionIndex]?.question,
        answer: Array.isArray(answer) ? answer.join(', ') : answer, // Format multi-select answers
      };
    });
  
    // Ensure answers are valid before making a request
    if (formattedResponses.length === 0) {
      alert("No answers provided. Please complete the onboarding process.");
      return;
    }
  
    const payload = {
      email: email,
      responses: formattedResponses,
    };
  
    try {
      // Send the data to the backend
      const response = await fetch('http://localhost:5000/api/save-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include auth token
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Save successful:', data);
        setIsComplete(true);
        navigate('/journalScreen');
      } else {
        alert(data?.message || "An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An unknown error occurred. Please try again.");
    }
  };
  



  const handleCounter= (substance, increment) => {
    setCounters(prev => ({
      ...prev,
      [substance]: Math.max(0, Math.min((prev[substance] || 0) + (increment ? 1 : -1), 6))
    }));
  };
  

  
  const QuestionThree = () => (
    <div className="space-y-4">
      {substances.map((substance) => {
        const isSelected = answers[currentQuestion]?.includes(substance);
        return (
          <div 
            key={substance}
            className={`flex flex-col space-y-3 p-4 rounded-lg border transition-all duration-300 cursor-pointer
              ${isSelected 
                ? 'bg-purple-600/30 border-purple-500' 
                : 'bg-black/40 border-purple-500/30 hover:bg-purple-900/20'
              }`}
            onClick={() => handleAnswer(substance)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center w-full">
                <span className={`text-purple-300 flex-grow ${isSelected ? 'font-bold' : ''}`}>
                  {substance}
                </span>
                
                {isSelected && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleCounter(substance, false);
                      }}
                      className="p-1 rounded-full hover:bg-purple-700/50 text-purple-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="min-w-[2.5rem] text-center text-purple-300">
                      {(counters[substance] || 0)}x
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleCounter(substance, true);
                      }}
                      className="p-1 rounded-full hover:bg-purple-700/50 text-purple-400"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  

 
  if (isComplete) {
    return (
<>

<div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black p-4 flex flex-col items-center justify-center">

        <div className="w-full max-w-md text-center space-y-6">
          <ClipboardCheck className="w-16 h-16 text-purple-400 mx-auto" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Onboarding Complete!
          </h1>
          <p className="text-purple-300">
            Thank you for sharing your experiences. You're now ready to start journaling.
          </p>
          <button
            onClick={() => setIsComplete(false)}
            className="mt-8 px-8 py-3 rounded-lg text-white font-medium bg-purple-600 hover:bg-purple-700 transition-all"
          >
            Back to Questions
          </button>
        </div>
      </div>
</>
      
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black p-4 pb-24 flex flex-col items-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <NavigationBar/>
      <div className="w-full max-w-md flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Getting Started
        </h1>
      </div>

      <div className="w-full max-w-md mb-6">
        <div className="text-sm text-purple-400 mb-2 flex justify-between">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-purple-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-md bg-black/40 backdrop-blur-lg border border-purple-500/20 shadow-lg shadow-purple-500/10 rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            {questions[currentQuestion].question}
          </h2>
          
          {questions[currentQuestion].showCounters ? (
            <QuestionThree />
          ) : (
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = answers[currentQuestion]?.includes(option);
                return (
                  <button
                    key={index}
                    className={`w-full text-left h-auto py-4 px-6 rounded-lg transition-all duration-200 flex justify-between items-center
                      ${isSelected 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white border-transparent' 
                        : 'bg-black hover:bg-purple-900/30 text-purple-400 border border-purple-500/30'
                      }`}
                    onClick={() => handleAnswer(option)}
                  >
                    <span>{option}</span>
                    {isSelected && <Check className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-md mt-6 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center bg-black/40 backdrop-blur-sm text-purple-400 
          border border-purple-500/30 hover:bg-purple-900/30 px-4 py-2 rounded-lg 
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentQuestion === questions.length - 1 || !isAnswered}
          className="flex items-center bg-black/40 backdrop-blur-sm text-purple-400 
          border border-purple-500/30 hover:bg-purple-900/30 px-4 py-2 rounded-lg 
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      <div className="flex gap-2 mt-6">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300
              ${index === currentQuestion 
                ? 'bg-purple-400 w-4' 
                : index < currentQuestion 
                  ? 'bg-purple-600' 
                  : 'bg-purple-900/40'
              }`}
          />
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!allQuestionsAnswered}
        className={`mt-8 px-8 py-3 rounded-lg text-white font-medium transition-all duration-300
          ${allQuestionsAnswered 
            ? 'bg-purple-600 hover:bg-purple-700 opacity-100 transform translate-y-0' 
            : 'bg-purple-600/50 opacity-0 transform translate-y-4 cursor-not-allowed'
          }`}
      >
        Complete Onboarding
      </button>
   

    </div>
  );
};

export default OnboardingScreen;