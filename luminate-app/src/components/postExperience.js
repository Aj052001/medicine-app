// import React, { useState } from "react";
// import { Mic, MicOff } from "lucide-react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";


// import { useNavigate } from "react-router-dom";

// const PostExperience = () => {
//   const navigate = useNavigate();
//   const [currentState, setCurrentState] = useState("");
//   const [postExperience, setPostExperience] = useState("");
  
//   const [recordingField, setRecordingField] = useState("");
//   const [showPostExperiencePopup, setShowPostExperiencePopup] = useState(true);

//   const { transcript, resetTranscript, listening } = useSpeechRecognition();

//   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   const toggleRecording = (field) => {
//     resetTranscript();
//     if (listening && recordingField === field) {
//       SpeechRecognition.stopListening();
//       setRecordingField("");
//       if (field === "currentState") {
//         setCurrentState((prev) => prev + " " + transcript);
//       } else if (field === "postExperience") {
//         setPostExperience((prev) => prev + " " + transcript);
//       }
//     } else {
//       setRecordingField(field);
//       SpeechRecognition.startListening({ continuous: true });
//     }
//   };

//   const handleClosePostExperiencePopup = () => {
//     navigate("/");
//     setShowPostExperiencePopup(false);
//   };

//   const handleSaveJournal = () => {
//     if (listening) {
//       SpeechRecognition.stopListening();
//       setRecordingField("");
//     }

//     const journalEntry = {
//       currentState: currentState.trim(),
//       postExperience: postExperience.trim(),
//     };

//     console.log("Saving journal entry:", journalEntry);
//     navigate("/")
//   };

  

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black p-6 pb-24">
//       {showPostExperiencePopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-black border-2 border-purple-500 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
//             <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text mb-4">
//               Post Experience
//             </h2>

//             {/* Post Experience Input */}
//             <div className="mb-4 relative">
//               <label className="block text-purple-400 mb-2">
//                 Post experience?
//                 {listening && recordingField === "postExperience" && (
//                   <span className="ml-2 text-purple-300 text-sm animate-pulse">
//                     Recording...
//                   </span>
//                 )}
//               </label>
//               <textarea
//                 value={
//                   listening && recordingField === "postExperience"
//                     ? postExperience + " " + transcript
//                     : postExperience
//                 }
//                 onChange={(e) => setPostExperience(e.target.value)}
//                 placeholder="What is the outlook you hope to achieve after the experience?"
//                 className="w-full min-h-[150px] bg-black border-2 border-purple-500 text-purple-300 rounded-lg p-3"
//               />
//               <button
//                 onClick={() => toggleRecording("postExperience")}
//                 className={`absolute bottom-4 right-4 p-2 rounded-full transition-all ${
//                   listening && recordingField === "postExperience"
//                     ? "bg-purple-600"
//                     : "bg-black border border-purple-500"
//                 }`}
//               >
//                 {listening && recordingField === "postExperience" ? (
//                   <Mic className="text-purple-400" />
//                 ) : (
//                   <MicOff className="text-white" />
//                 )}
//               </button>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex space-x-4">
//               <button
//                 onClick={handleClosePostExperiencePopup}
//                 className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveJournal}
//                 className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
//               >
//                 Save Intention
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostExperience;


import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate } from "react-router-dom";
import { useAuth } from './UserContext';  // assuming UserContext provides authentication data

const PostExperience = () => {
  const navigate = useNavigate();
  const { authData } = useAuth();  // Assuming authData contains email and token for API requests
  const [currentState, setCurrentState] = useState("");
  const [postExperience, setPostExperience] = useState("");
  
  const [recordingField, setRecordingField] = useState("");
  const [showPostExperiencePopup, setShowPostExperiencePopup] = useState(true);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const toggleRecording = (field) => {
    resetTranscript();
    if (listening && recordingField === field) {
      SpeechRecognition.stopListening();
      setRecordingField("");
      if (field === "currentState") {
        setCurrentState((prev) => prev + " " + transcript);
      } else if (field === "postExperience") {
        setPostExperience((prev) => prev + " " + transcript);
      }
    } else {
      setRecordingField(field);
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleClosePostExperiencePopup = () => {
    navigate("/");
    setShowPostExperiencePopup(false);
  };

  const handleSaveJournal = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setRecordingField("");
    }

    const journalEntry = {
      postExperience: postExperience.trim(),
    };

    // Check if the user is authenticated (email and token should be available)
    if (!authData?.email || !authData?.token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    try {
      // Send the journal entry to the backend API
      const response = await fetch("http://localhost:5000/api/savePostExperience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          email: authData.email,  // Pass user's email
          journalEntry,  // Pass the currentState and postExperience
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Journal entry saved successfully:", data);
        navigate("/"); // Navigate after successful save
      } else {
        alert(data?.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      alert("An unknown error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black p-6 pb-24">
      {showPostExperiencePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-black border-2 border-purple-500 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text mb-4">
              Post Experience
            </h2>

            {/* Post Experience Input */}
            <div className="mb-4 relative">
              <label className="block text-purple-400 mb-2">
                Post experience?
                {listening && recordingField === "postExperience" && (
                  <span className="ml-2 text-purple-300 text-sm animate-pulse">
                    Recording...
                  </span>
                )}
              </label>
              <textarea
                value={
                  listening && recordingField === "postExperience"
                    ? postExperience + " " + transcript
                    : postExperience
                }
                onChange={(e) => setPostExperience(e.target.value)}
                placeholder="What is the outlook you hope to achieve after the experience?"
                className="w-full min-h-[150px] bg-black border-2 border-purple-500 text-purple-300 rounded-lg p-3"
              />
              <button
                onClick={() => toggleRecording("postExperience")}
                className={`absolute bottom-4 right-4 p-2 rounded-full transition-all ${
                  listening && recordingField === "postExperience"
                    ? "bg-purple-600"
                    : "bg-black border border-purple-500"
                }`}
              >
                {listening && recordingField === "postExperience" ? (
                  <Mic className="text-purple-400" />
                ) : (
                  <MicOff className="text-white" />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleClosePostExperiencePopup}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveJournal}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
              >
                Save Intention
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostExperience;
