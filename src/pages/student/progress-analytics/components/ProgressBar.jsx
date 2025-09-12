import React from 'react';

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-muted rounded-full h-2.5">
    <div className="bg-primary h-2.5 rounded-full transition-smooth" style={{ width: `${progress}%` }}></div>
  </div>
);

export default ProgressBar;
