import React from 'react';

const Loader = ({ size = 50 }) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <img
        src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1720876353/kctpqz4endnkue8lgsz6.jpg"
        alt="Loading..."
        className="animate-spin"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};

export default Loader;