import React from "react";

const chanting = [
  {
    title: "Mahamrityunjaya Mantra - Sacred Sound Choir ",
   
    youtubeId: "3vq6Ot2RiEc",
  },
  {
    title: "Victoria Orenze - Spirit Chant",
    
    youtubeId: "BMeMd6UMsME",
  },
  {
    title: "OM MANTRA MEDITATION | 11 Minutes",
    
    youtubeId: "vH11undyI2o",
  },
  {
    title: "Daimoku - Nam myoho renge kyo - 15 minutes",
   
    youtubeId: "KfRcUpoPl7w",
  }
];

const Chanting = () => {
  return (
    <div className="mx-auto p-4 min-h-screen bg-gradient-to-b from-black via-purple-950 to-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chanting.map((video, index) => (
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
              className="w-full h-64" // Adjust width and height as needed
            ></iframe>
            <div className="p-4 bg-gradient-to-r from-purple-800 to-purple-700 text-white">
              <h3 className="text-xl font-bold mb-2">{video.title}</h3>
              
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default Chanting;
