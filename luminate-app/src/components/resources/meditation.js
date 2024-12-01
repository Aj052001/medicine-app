import React from 'react';

const meditation = [
    {
      title: "Calm - Ease | Guided Meditation by Thich Nhat Hanh | Breathing in, I know I am breathing in",
      
      youtubeId: "XHvtIcaD194"
    },
    {
      title: "Loving Kindness Meditation to Develop Mindfulness and Compassion",

      youtubeId: "-d_AA9H4z9U"
    },
    {
      title: "Guided Body Scan Meditation - A Daily Energy and Mindfulness Exercise",
      youtubeId: "BlWo7sqWLNk"
    },
    {
      title: "30 Minute Bone Deep Breathing Meditation and Full-body Relaxation",
      youtubeId: "cXcmyOEZzvE"
    }
  ];




const Meditation = () => {
  
 
    return (
        <div className="mx-auto p-4 min-h-screen bg-gradient-to-b from-black via-purple-950 to-black">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meditation.map((video, index) => (
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

export default Meditation;