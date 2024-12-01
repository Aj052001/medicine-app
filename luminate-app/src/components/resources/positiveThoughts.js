import React from 'react';


const positiveThoughts = [
    {
      title: "Positive Affirmations for Self Love, Self Esteem, Confidence 💫",
      
      youtubeId: "yo1pJ_D-H3M"
    },
    {
      title: "Positive Affirmations for Peace and Calm | Reduce Stress & Anxiety",
      
      youtubeId: "oS6KlpzDNS0"
    },
    {
      title: "Positive Affirmations for Love & Healthy Relationships 💞 | Powerful Positive Love Affirmations ☀️",
      
      youtubeId: "hBB5rUm2jmw"
    },
    {
      title: "Daily Affirmations for Self Love, Self Esteem, Confidence 💖 Transform Your Mindset",
     
      youtubeId: "L9hT0Lr4048"
    }
   
  ];



const PositiveThoughts = () => {
  
    return (
        <div className="mx-auto p-4 min-h-screen bg-gradient-to-b from-black via-purple-950 to-black">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {positiveThoughts.map((video, index) => (
          <div 
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64"  // Adjust width and height as needed
            ></iframe>
            <div className="p-4 bg-gradient-to-r from-purple-800 to-purple-700 text-white">
              <h3 className="text-xl font-bold mb-2">{video.title}</h3>
              <p className="text-white">{video.description}</p>
            </div>
          </div>
        ))}
    
            
          </div>
         
        </div>
    
       
      );
};

export default PositiveThoughts;