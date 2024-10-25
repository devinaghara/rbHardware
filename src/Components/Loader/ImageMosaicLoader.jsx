import React from 'react';
import { motion } from 'framer-motion';

const ImageMosaicLoader = ({ size = 100 }) => { 
  const gridSize = 4; 
  const tileSize = size / gridSize;
  const gapSize = 2;
  const imageUrl = "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1720876353/kctpqz4endnkue8lgsz6.jpg";

  const tiles = Array.from({ length: gridSize * gridSize }, (_, i) => ({
    id: i,
    x: (i % gridSize) * (tileSize + gapSize),
    y: Math.floor(i / gridSize) * (tileSize + gapSize),
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        style={{
          width: size + (gridSize - 1) * gapSize,
          height: size + (gridSize - 1) * gapSize,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {tiles.map((tile) => (
          <motion.div
            key={tile.id}
            style={{
              position: 'absolute',
              width: tileSize,
              height: tileSize,
              left: tile.x,
              top: tile.y,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${size}px ${size}px`,
              backgroundPosition: `-${tile.x}px -${tile.y}px`,
              borderRadius: '4px',
            }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1, // Faster animation duration
              repeat: Infinity,
              delay: (tile.x + tile.y) / (size * 3), // Faster but more staggered effect
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ImageMosaicLoader;
