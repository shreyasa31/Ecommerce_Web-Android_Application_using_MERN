import React, { useState } from 'react';

const PhotosTab = ({ productTitle }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch photos from the backend
  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/googlesearch?q=${encodeURIComponent(productTitle)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPhotos(data.items || []);
    } catch (e) {
      setError(e.message);
      console.error("There was a problem fetching the photos: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Event handler for tab click
  const handleTabClick = () => {
    fetchPhotos();
  };

  return (
    <div>
      <button onClick={handleTabClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load Photos'}
      </button>
      {error && <div>Error: {error}</div>}
      <div>
        {photos.map((photo, index) => (
          <img key={index} src={photo.link} alt={photo.title} />
        ))}
      </div>
    </div>
  );
};

export default PhotosTab;
