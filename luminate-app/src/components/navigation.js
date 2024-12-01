
// import React from 'react';
// import { User } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const NavigationBar = () => {
//     const navigate = useNavigate();
//     function goToHome() {
  
//         navigate('/');
//       }
//     function goToProfile() {
  
//         navigate('/profile');
//       }
//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
//         {/* App Name */}
//         <div className="flex-shrink-0 text-purple-300 text-2xl font-bold absolute top-0 left-0 m-4 cursor-pointer" onClick={goToHome} >
//           Luminate
//         </div>

//         {/* User Profile Icon */}
//         <button
//           className="text-purple-300 hover:bg-purple-800/50 p-3 rounded-full transition-all absolute top-0 right-0 m-4"
//           aria-label="User Profile" onClick={goToProfile}
//         >
//           <User size={28} />
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default NavigationBar;


import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const navigate = useNavigate();

    function goToHome() {
        navigate('/');
    }

    function goToProfile() {
        navigate('/profile');
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                {/* App Name */}
                <div 
                    className="flex-shrink-0 text-purple-300 text-2xl font-bold absolute top-0 left-0 m-4 cursor-pointer" 
                    onClick={goToHome}
                >
                    Luminate
                </div>
                
                {/* User Profile Icon */}
                <button
                    className="text-purple-300 hover:bg-purple-800/50 p-3 rounded-full transition-all absolute top-0 right-0 m-4"
                    aria-label="User Profile"
                    onClick={goToProfile}
                >
                    <User size={28} />
                </button>
            </div>
        </nav>
    );
};

export default NavigationBar;