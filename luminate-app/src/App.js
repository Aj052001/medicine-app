
import './index.css';
// import MuscleSelector from './components/Body-part';
import OnboardingScreen from './components/OnboardingScreen.tsx';
import AuthForms from './components/Login.tsx';
import JournalScreen from './components/journal-screen-updated.tsx';
// import JourneyRoadmap from './components/journey-roadmap.tsx';

import { Routes, Route } from 'react-router-dom';
import MentalStateSelector from './components/intension.js';
import MuscleSelector from './components/Body-part.js';
import JourneyRoadmap from './components/journey-roadmap.tsx';
import PostExperience from './components/postExperience.js';
import ResourceSelector from './components/resouces.js';
import PositiveThoughts from './components/resources/positiveThoughts.js';
import Meditation from './components/resources/meditation.js';
import Chanting from './components/resources/chanting.js';

import BottomButton from './components/bottomButton.js';
import UserProfile from './components/profile.js';
import AudioRecorder from './components/audioRecorder.js';

function App() {
  
  return (
    
     <div>
      
     <Routes>
        <Route path="/" element={<AuthForms />} />
       
        <Route path="/onbardingScreen" element={<OnboardingScreen/>} />
        <Route path="/journalScreen" element={<JournalScreen/>} />
        <Route path="/postExperience" element={<PostExperience/>} />
        <Route path="/bodyMap" element={<MuscleSelector/>} />
        <Route path="/storyMap" element={<JourneyRoadmap/>} />

        <Route path="/intension" element={<MentalStateSelector/>} />
        <Route path="/resource" element={<ResourceSelector/>} />
        <Route path="/chanting" element={<Chanting/>} />
        <Route path="/meditation" element={<Meditation/>} />
        <Route path="/positiveThoughts" element={<PositiveThoughts/>} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/audio" element={<AudioRecorder/>} />

        

      </Routes>
      <BottomButton/>
   </div>
  );
}

export default App;

