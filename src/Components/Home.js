import React, { useEffect, useState } from 'react';
import './Home.css'; 
import ecell from'./ecell-3.jpeg';

const Home = () => {
  const images = [
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScmSZFrarXyzIH_VTQ1p71wi7F-t1IQwCAnw&s",
    },
    {
      url: ecell,
    },
    {
      url: "Screenshot 2024-11-06 212118.png",
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); 

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="img-container">
      <div className="text-section">
        <h1>Vignan Entrepreneurship Cell</h1>
        <p>
          Ecell is a networking hub for students aspiring to be entrepreneurs and help them to set up their own enterprise.
        </p>
      </div>
      <div className="image-section">
      {images.map((image, index) => (
  <img
    key={index}
    src={image.url}
    alt={`Entrepreneurship ${index + 1}`}  
    className={`slide-image ${index === currentIndex ? 'active' : ''}`}
  />
))}
      </div>
    </div>
  );
}

export default Home;