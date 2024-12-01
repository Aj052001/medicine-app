import React from 'react';

import { useNavigate } from 'react-router-dom';


const BottomButton = () => {
    const navigate = useNavigate();
    function goToMentalStateSelector() {
        // Navigate to the MentalStateSelector page
        navigate('/intension');
      }
    function goToResource() {
        // Navigate to the MentalStateSelector page
        navigate('/resource');
      }
    function goToExperience() {
        // Navigate to the MentalStateSelector page
        navigate('/postExperience');
      }
    
   return(
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-700 py-4 flex justify-between px-4 sm:px-6">
    <button onClick={goToMentalStateSelector} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all">
      Intention
    </button>
    <button onClick={goToResource} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all ml-4">
      Mid Trip Experience
    </button>
    <button onClick={goToExperience} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all ml-4">
      Post Experience
    </button>
  </div>
   );

}



export default BottomButton

