import React, { useState } from 'react';
import { Moon, Sun, X, ChevronRight, Star, Leaf } from 'lucide-react';
import NavigationBar from './navigation';
import { useAuth } from './UserContext';
import { useNavigate } from 'react-router-dom';
interface Level {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  prompts: string[];
}

interface LevelInputs {
  [key: number]: string[];
}

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface LevelAnswers {
  title: string;
  questionAnswers: QuestionAnswer[];
}

const JourneyRoadmap: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [levelInputs, setLevelInputs] = useState<LevelInputs>({});
  const [completedLevels, setCompletedLevels] = useState<number[]>([1]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<LevelAnswers[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { authData } = useAuth();
  const navigate = useNavigate();
  // Define levels with multiple prompts per stage
  const levels: Level[] = [
    {
      id: 1,
      title: "Preparation",
      description: "Set your intentions",
      icon: Star,
      prompts: [
        "Do you feel open?",
        "Do you feel prepared?",
        "Do you understand your intentions?",
        "Are you comforted by the objects and things that will be around you?",
        "Do you feel safe and secure?",
        "Do you have the tools you need? …Nature, Music, Blanket, Etc."
      ]
    },
    {
      id: 2,
      title: "Onset",
      description: "Initial effects begin",
      icon: Leaf,
      prompts: ["What do you want to feel as the journey begins?"]
    },
    {
      id: 3,
      title: "Come Up",
      description: "Energy building",
      icon: Moon,
      prompts: ["Describe what you'll be doing as the medicine begins to take full effect"]
    },
    {
      id: 4,
      title: "Peak",
      description: "Deep experience",
      icon: Sun,
      prompts: ["Describe what you want to be feeling as you're deeply immersed in the experience"]
    }
  ];



  const handleInputChange = (levelId: number, value: string): void => {
    // Update levelInputs to track the user input
    setLevelInputs(prev => ({
      ...prev,
      [levelId]: {
        ...prev[levelId],
        [currentPromptIndex]: value, // Store the input at the current prompt index
      }
    }));
  
    // Update answers for the corresponding level
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      const levelIndex = newAnswers.findIndex(ans => ans.title === levels[levelId - 1].title);
  
      if (levelIndex === -1) {
        newAnswers.push({
          title: levels[levelId - 1].title,
          questionAnswers: [{ question: selectedLevel?.prompts[currentPromptIndex] || '', answer: value }]
        });
      } else {
        newAnswers[levelIndex].questionAnswers[currentPromptIndex] = {
          question: selectedLevel?.prompts[currentPromptIndex] || '',
          answer: value,
        };
      }
      return newAnswers;
    });
  };
  
 
  
  
  const handleSaveAndContinue = () => {
    if (selectedLevel) {
      if (currentPromptIndex < selectedLevel.prompts.length - 1) {
        // Move to the next prompt within the same level
        setCurrentPromptIndex(prev => prev + 1);
      } else {
        // All prompts for this level are completed, move to the next level
        if (selectedLevel.id < levels.length) {
          setCompletedLevels(prev => [...new Set([...prev, selectedLevel.id + 1])]);
        }
  
        // Check if the current level is the 4th level (or the last level you want to trigger API)
        if (selectedLevel.id === 4) {
          // If this is the last question of the 4th level, send data to backend
          sendAnswersToBackend(answers);
        }
  
        // Reset for next level
        setSelectedLevel(null); // Close the current level
        setCurrentPromptIndex(0); // Reset prompt index for the next level
      }
    }
  };
  

  const sendAnswersToBackend = async (answers: LevelAnswers[]) => {
    try {
      // Convert answers into the appropriate format for the API
      const levelsArray = answers.map(answer => ({
        title: answer.title,
        questionAnswers: answer.questionAnswers,
      }));
  
      // Assuming you have the user's email and token stored in `authData`
      const { email, token } = authData;
      if (!email || !token) {
        alert("Authentication error. Please log in again.");
        return;
      }
  
      // Prepare the payload with answers and email
      const payload = {
        email,  // Include email in the payload
        levels: levelsArray,  // Include the levels with answers
      };
  
      // Make POST request to save answers to the backend
      const response = await fetch('http://localhost:5000/api/story-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include the token in the request headers
        },
        body: JSON.stringify(payload),  // Send the payload in the request body
      });
  
      const data = await response.json();  // Parse the response as JSON
  
      if (response.ok) {
        // Success: Show the message from the backend and navigate
        console.log(data.message);  // You can display this message as needed
        navigate('/');  // Assuming you want to navigate after saving
      } else {
        // Handle server-side errors
        setMessage(data?.message || 'Error saving answers. Please try again.');
        alert(data?.message || 'Error saving answers. Please try again.');
      }
    } catch (error) {
      // Handle network or other unexpected errors
      setMessage('Error saving answers. Please try again.');
      alert('Error saving answers. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black p-4 pb-24">
      <NavigationBar />
  
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          
        </h1>
      </div>
  
      {/* Main Container */}
      <div className="relative mx-auto w-80">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-purple-600/50 transform -translate-x-1/2" />
  
        {/* Levels */}
        <div className="relative space-y-16">
          {levels.map((level, index) => {
            const Icon = level.icon;
            const isUnlocked = completedLevels.includes(level.id);
            const isLeft = index % 2 === 0;
  
            return (
              <div key={level.id} className="relative">
                {/* Node */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <button
                    onClick={() => isUnlocked && setSelectedLevel(level)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${isUnlocked 
                        ? 'bg-black border-2 border-purple-400 cursor-pointer hover:scale-110' 
                        : 'bg-black/50 border-2 border-purple-900 cursor-not-allowed'
                      } transition-all duration-300`}
                  >
                    <Icon className={`w-6 h-6 ${isUnlocked ? 'text-purple-400' : 'text-purple-900'}`} />
                  </button>
                </div>
  
                {/* Content Container */}
                <div className="flex justify-between items-center h-12">
                  {/* Left Side */}
                  <div className={`w-30 ${isLeft ? 'block' : 'invisible'} text-right`}>
                    <h3 className={`font-medium ${isUnlocked ? 'text-purple-400' : 'text-purple-900'}`}>
                      {level.title}
                    </h3>
                    <p className={`text-sm ${isUnlocked ? 'text-purple-300' : 'text-purple-900/60'}`}>
                      {level.description}
                    </p>
                  </div>
  
                  {/* Space for Node */}
                  <div className="w-12" />
  
                  {/* Right Side */}
                  <div className={`w-30 ${!isLeft ? 'block' : 'invisible'} text-left`}>
                    <h3 className={`font-medium ${isUnlocked ? 'text-purple-400' : 'text-purple-900'}`}>
                      {level.title}
                    </h3>
                    <p className={`text-sm ${isUnlocked ? 'text-purple-300' : 'text-purple-900/60'}`}>
                      {level.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
  
      {/* Compact Popup for the selected level */}
      {selectedLevel && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-black/95 border border-purple-500/30 shadow-xl rounded-lg">
            <div className="relative pt-8 pb-6 px-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedLevel(null)}
                className="absolute right-4 top-4 text-purple-400 hover:bg-purple-950/30 rounded-full p-2"
              >
                <X className="w-4 h-4" />
              </button>
  
              {/* Content */}
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {selectedLevel.title}
                  </h2>
                  <p className="text-purple-300/80 text-sm leading-relaxed">
                    {selectedLevel.description}
                  </p>
                </div>
  
                {/* Input Section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-purple-400 text-sm font-medium block pl-1">
                      {selectedLevel.prompts[currentPromptIndex] || ''}
                    </label>
                    <textarea
                      value={
                        (levelInputs[selectedLevel.id] && 
                        levelInputs[selectedLevel.id][currentPromptIndex]) || ''
                      }
                      onChange={(e) => handleInputChange(selectedLevel.id, e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full min-h-[150px] bg-black border-2 border-purple-500/30 text-purple-200
                      placeholder:text-purple-500/40 focus:border-purple-400 rounded-lg resize-none p-4
                      hover:border-purple-500/50 transition-colors text-sm"
                    />
                  </div>
  
                  {/* Save & Continue Button */}
                  <button
                    onClick={handleSaveAndContinue}
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-800 
                    hover:from-purple-700 hover:to-purple-900 text-white text-sm font-medium rounded-lg
                    transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center"
                  >
                    {currentPromptIndex < selectedLevel.prompts.length - 1 
                      ? 'Save & Next' 
                      : 'Save & Continue'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default JourneyRoadmap;


