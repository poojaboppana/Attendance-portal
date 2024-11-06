import React, { useEffect, useState } from 'react';
import './Home.css'; // Assuming you want to keep styles separate

const Home = () => {
  // Array of image objects
  const images = [
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScmSZFrarXyzIH_VTQ1p71wi7F-t1IQwCAnw&s",
    },
    {
      url: "Screenshot 2024-11-06 220102.png",
    },
    {
      url: "Screenshot 2024-11-06 212118.png",
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to handle the slide change every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Change every 6 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="container">
      {/* Text Section */}
      <div className="text-section">
        <h1>The Entrepreneurship Cell</h1>
        <p>
          Ecell is a networking hub for students aspiring to be entrepreneurs and help them to set up their own enterprise.
        </p>
      </div>

      {/* Image Section */}
      <div className="image-section">
      {images.map((image, index) => (
  <img
    key={index}
    src={image.url}
    alt={`Entrepreneurship ${index + 1}`}  // Updated alt description
    className={`slide-image ${index === currentIndex ? 'active' : ''}`}
  />
))}
      </div>
    </div>
  );
}

export default Home;