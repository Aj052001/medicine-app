



import React, { useState } from "react";
import { Mic, MicOff, Star, Sparkles } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import NavigationBar from "./navigation";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';

const JournalScreen = () => {
  const [medicine, setMedicine] = useState("");
  const [customMedicine, setCustomMedicine] = useState("");
  const [intention, setIntention] = useState("");
  const [customIntention, setCustomIntention] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [postExperience, setPostExperience] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [recordingField, setRecordingField] = useState("");
  const [experienceDate, setExperienceDate] = useState("");
  const navigate = useNavigate();
  const { authData } = useAuth();

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }



  const toggleRecording = (field) => {
    console.log("Toggling recording for", field);
    resetTranscript();
    if (listening && recordingField === field) {
      SpeechRecognition.stopListening();
      setRecordingField("");
      if (field === "currentState") {
        console.log("Adding transcript to currentState:", transcript);
        setCurrentState(prev => prev + " " + transcript);
      } else if (field === "postExperience") {
        console.log("Adding transcript to postExperience:", transcript);
        setPostExperience(prev => prev + " " + transcript);
      }
    } else {
      setRecordingField(field);
      console.log("Starting listening for", field);
      SpeechRecognition.startListening({ continuous: true });
    }
  };
  

  const medicines = ["Psilocybin", "LSD", "DMT", "MDMA", "Ketamine", "Other"];
  const intentions = [
    "Healing",
    "Self-discovery",
    "Spiritual growth",
    "Creative inspiration",
    "Personal development",
    "Other",
  ];

  const handleDateChange = (date: Date | null) => {
    // Convert Date object to string when a date is selected or clear if null
    setExperienceDate(date ? date.toISOString().substring(0, 10) : "");
  };

  const handleSaveJournal = async () => {
    const { email, token } = authData; 
    if (!email || !token) {
      alert("Authentication error. Please log in again.");
      return;
    }
    
    if (listening) {
      SpeechRecognition.stopListening();
      setRecordingField("");
    }
  
    // Gather the journal entry data from the form state
    const journalEntry = {
      medicine: medicine === "Other" ? customMedicine : medicine,  // Use custom medicine if "Other" is selected
      intention: intention === "Other" ? customIntention : intention, // Use custom intention if "Other" is selected
      experienceDate: experienceDate, // Assuming this is in "YYYY-MM-DD" format
      currentState: currentState.trim(), // Ensure no leading/trailing spaces
      postExperience: postExperience.trim(), // Ensure no leading/trailing spaces
    };
  
    // Check if all necessary fields are filled
    if (!journalEntry.medicine || !journalEntry.intention || !journalEntry.experienceDate || !journalEntry.currentState || !journalEntry.postExperience) {
      alert("Please fill in all fields before submitting.");
      return;
    }
  
    // Prepare the payload to send to the backend
    const payload = {
      email: email,  // Assuming `authData` has email
      journalEntry: journalEntry, // Include the journal entry data in the payload
    };
  
    try {
      // Send the journal entry to the backend
      const response = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the authentication token
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Journal entry saved successfully:", data);
  
        // Reset form state after submission
        setMedicine("");
        setCustomMedicine("");
        setIntention("");
        setCustomIntention("");
        setCurrentState("");
        setPostExperience("");
        setExperienceDate("");
        
        setShowRoadmap(true); // Flag to show the roadmap or move to next page
        navigate('/'); // Navigate to another screen (e.g., journal screen)
      } else {
        alert(data?.message || "An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert("An unknown error occurred. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black p-6 pb-24">
      <NavigationBar/>
      <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text mb-6">
        
      </h1>

      {/* Medicine Selection */}
      <div className="mb-4">
        <label className="block text-purple-400 mb-2">Medicine</label>
        <select
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          className="w-full bg-black border-2 border-purple-500 text-purple-300 rounded-lg p-3"
        >
          <option value="">Select Medicine</option>
          {medicines.map((med) => (
            <option key={med} value={med}>
              {med}
            </option>
          ))}
        </select>
        {medicine === "Other" && (
          <input
            type="text"
            placeholder="Specify Medicine"
            value={customMedicine}
            onChange={(e) => setCustomMedicine(e.target.value)}
            className="w-full mt-2 bg-black border-2 border-purple-500 text-purple-300 rounded-lg p-3"
          />
        )}
      </div>

      {/* Intention Selection */}
      <div className="mb-4">
        <label className="block text-purple-400 mb-2">Intention</label>
        <select
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          className="w-full bg-black border-2 border-purple-500 text-purple-300 rounded-lg p-3"
        >
          <option value="">Select Intention</option>
          {intentions.map((int) => (
            <option key={int} value={int}>
              {int}
            </option>
          ))}
        </select>
        {intention === "Other" && (
          <input
            type="text"
            placeholder="Specify Intention"
            value={customIntention}
            onChange={(e) => setCustomIntention(e.target.value)}
            className="w-full mt-2 bg-black border-2 border-purple-500 text-purple-300 rounded-lg p-3"
          />
        )}
      </div>

      {/* Experience Date Selector */}
      <div className="mb-4">
        <label className="block text-purple-400 mb-2">Experience Date</label>
        <ReactDatePicker
          selected={experienceDate ? new Date(experienceDate) : null}
          onChange={handleDateChange}
          className="w-full bg-black text-purple-300 border-2 border-purple-500 rounded-lg p-3"
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}  // Restrict past dates by setting minDate to today
        />
      </div>

      {/* Current State with Voice and Text Input */}
      <div className="mb-4 relative">
        <label className="block text-purple-400 mb-2">
          Current State?
          {listening && recordingField === "currentState" && (
            <span className="ml-2 text-purple-300 text-sm animate-pulse">
              Recording...
            </span>
          )}
        </label>
        {/* <textarea
          value={
            listening && recordingField === "currentState"
              ? currentState + " " + transcript
              : currentState
          }
          onChange={(e) => setCurrentState(e.target.value)}
          placeholder="What is your current state of mind?"
          className="w-full min-h-[150px] bg-black border-2 border-purple-500 text-purple-300 rounded-lg p-3"
        /> */}

<textarea
  value={
    listening && recordingField === "currentState"
      ? currentState + " " + transcript
      : currentState
  }
  onChange={(e) => setCurrentState(e.target.value)}
  placeholder="What is your current state of mind?"
  className="w-full min-h-[150px] bg-black border-2 border-purple-500 text-purple-300 rounded-lg p-3"
/>

        <button
          onClick={() => toggleRecording("currentState")}
          className={`absolute bottom-4 right-4 p-2 rounded-full transition-all ${
            listening && recordingField === "currentState" ? "bg-purple-600" : "bg-black border border-purple-500"
          }`}
        >
          {listening && recordingField === "currentState" ? (
            <Mic className="text-purple-400" />
          ) : (
            <MicOff className="text-white" />
          )}
        </button>
      </div>

      {/* Post Experience with Voice and Text Input */}
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
            listening && recordingField === "postExperience" ? "bg-purple-600" : "bg-black border border-purple-500"
          }`}
        >
          {listening && recordingField === "postExperience" ? (
            <Mic className="text-purple-400" />
          ) : (
            <MicOff className="text-white" />
          )}
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveJournal}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg 
        hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center"
      >
        <Star className="mr-2" /> Capture Intention <Sparkles className="ml-2" />
      </button>
    </div>
  );
};

export default JournalScreen;


