import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './navigation';
const MentalStateSelector = () => {
  
  const navigate = useNavigate();
  

  function goToBodyMap() {
    // Navigate to the MentalStateSelector page
    navigate('/bodyMap');
  }
  function goToStoryMap() {
    // Navigate to the MentalStateSelector page
    navigate('/storyMap');
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-black via-purple-950 to-black">
        <NavigationBar/>
      <div className="grid grid-cols-1 gap-4 w-full max-w-4xl">
        <button
          className={`p-8 rounded-lg transition-colors duration-300 w-full bg-gradient-to-r from-purple-600 to-purple-700`}
          onClick={goToBodyMap}
          
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-2 w-12 h-12">
            <path fillRule="evenodd" d="M3.75 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15A.75.75 0 013.75 6zM3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
          Body Map
        </button>
        <button
          className={`p-8 rounded-lg transition-colors duration-300 w-full  bg-gradient-to-r from-purple-600 to-purple-700`}
          onClick={goToStoryMap}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-2 w-12 h-12">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 6a3 3 0 00-3 3v4.5a.75.75 0 01-1.5 0V9a4.5 4.5 0 119 0v4.5a.75.75 0 01-1.5 0V9a3 3 0 00-3-3z" clipRule="evenodd" />
          </svg>
          Story Map
        </button>

      
      </div>
      
    </div>
  );
};

export default MentalStateSelector;