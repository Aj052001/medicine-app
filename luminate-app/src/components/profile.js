import React, { useState } from 'react';
import { User, History } from 'lucide-react';
import NavigationBar from './navigation';

const substances = ['Psychedelics', 'Cannabis', 'Ketamine', 'MDMA', 'DMT', 'Ayahuasca', 'Psilocybin', 'LSD'];

const questions = [
  {
    id: 1,
    question: "Which experiences have you experienced before? (Select all that apply)",
    options: substances,
    multiSelect: true,
  },
  {
    id: 2,
    question: "How often do you frequent these experiences? (Select one)",
    options: ["Twice a week", "Once a week", "Once every 2 weeks", "Once every month","Once every 3 months","Once every 6 months","Once every year"],
    multiSelect: false,
  },
  {
    id: 3,
    question: "How many times have you had each experience?",
    options: substances,
    showCounters: true,
    multiSelect: true,
  },
  {
    id: 4,
    question: "Have you set an intention for your experiences before?",
    options: ["Yes", "No"],
    multiSelect: false,
  },
  {
    id: 5,
    question: "What do you normally feel after the experience? (Select all that apply)",
    options: ["Clarity", "Peace", "Joy","Love","Focus","Passion","Healing"],
    multiSelect: true,
  },
  {
    id: 6,
    question: "Have you ever recorded yourself speaking during an experience?",
    options: ["Yes", "No"],
    multiSelect: false,
  },
];

const UserProfile = () => {
  const [userData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    profilePicture: 'https://imgs.search.brave.com/pO94k9yZcsDjlwLJtAyBbvvI2M4ugV_Zx7fWwVg_he8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1Lzc2LzY5LzY3/LzM2MF9GXzU3NjY5/Njc1MV9zb2NXTXRl/aEVXcDRTeXZEbEp0/c3RJQWtCYWtrR1RW/ay5qcGc',
    answers: Array(questions.length).fill({}).map((_, index) => ({
      questionId: questions[index].id,
      selectedOptions: [],
      frequency: null,
      counters: questions[index].showCounters ? questions[index].options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {}) : null,
    })),
  });

  const renderUserHistoryCard = () => {
    return (
        <div className="bg-gray-800 mb-[60px] rounded-lg shadow-xl p-6 space-y-4">
        <div className="flex items-center space-x-4 border-b border-gray-700 pb-4">
          <History className="w-10 h-10 text-purple-500" />
          <h2 className="text-2xl font-bold text-purple-400">Experience History</h2>
        </div>
        
        {questions.map((question, index) => {
          const answer = userData.answers[index];
          return (
            <div key={question.id} className="border-b border-gray-700 pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">{question.question}</h3>
              {question.multiSelect ? (
                <p className="text-gray-300">
                  {answer.selectedOptions.length > 0 
                    ? answer.selectedOptions.join(", ") 
                    : "No options selected"}
                </p>
              ) : (
                <p className="text-gray-300">
                  {answer.frequency || "No selection made"}
                </p>
              )}
              {question.showCounters && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {question.options.map((option) => (
                    <div key={option} className="flex justify-between text-gray-300 bg-gray-900 rounded p-1">
                      <span className="font-medium">{option}:</span>
                      <span className="font-bold text-purple-300">{answer.counters[option]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderUserInfoCard = () => {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center">
        <div className="flex items-center space-x-4 w-full border-b border-gray-700 pb-4 mb-4">
          <User className="w-10 h-10 text-purple-500" />
          <h2 className="text-2xl font-bold text-purple-400">User Profile</h2>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={userData.profilePicture} 
            alt={userData.name} 
            className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover"
          />
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">{userData.name}</h3>
            <p className="text-gray-400">{userData.email}</p>
          </div>
          
          <div className="w-full bg-gray-900 rounded p-4">
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800 rounded p-2 text-center">
                <span className="block text-gray-400 text-sm">Experiences</span>
                <span className="text-purple-300 font-bold">
                  {userData.answers[0].selectedOptions.length}
                </span>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <span className="block text-gray-400 text-sm">Frequency</span>
                <span className="text-purple-300 font-bold">
                  {userData.answers[1].frequency || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
        <NavigationBar/>
      <div className="max-w-6xl mb-6 mx-auto grid md:grid-cols-1 gap-8">
        {renderUserInfoCard()}
        {renderUserHistoryCard()}
      </div>
    </div>
  );
};

export default UserProfile;