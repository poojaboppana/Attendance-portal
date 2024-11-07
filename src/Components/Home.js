import React, { useEffect, useState } from 'react';
import './Home.css'; // Assuming you want to keep styles separate

const Home = () => {
  // Array of image objects
  const images = [
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScmSZFrarXyzIH_VTQ1p71wi7F-t1IQwCAnw&s",
    },
    {
      url: "https://scontent.fhyd11-1.fna.fbcdn.net/v/t39.30808-6/300284624_464388969035884_7538630674131759145_n.jpg?stp=dst-jpg_s960x960&_nc_cat=100&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=YYdbhHRInO4Q7kNvgEdvMTo&_nc_zt=23&_nc_ht=scontent.fhyd11-1.fna&_nc_gid=A-BrwR1UDlpa0y9-IuB7OSY&oh=00_AYApkJCG8EIC69LxNpZDjMKneEFo1eqgffEFzDBx_L6SZg&oe=67315FE5",
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
    <div className="img-container">
      {/* Text Section */}
      <div className="text-section">
        <h1>Vignan Entrepreneurship Cell</h1>
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