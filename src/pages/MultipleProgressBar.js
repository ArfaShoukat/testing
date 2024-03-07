import React from 'react';
import './scoreBar.css'



const MultipleProgressBar = ({ progress }) => {
  let barColor = '#d3d3d3'; 
 if (progress > 66.66 && progress <= 100) {
    barColor = '#d3d3d3'; 
  }

  return (
    
    <div className="multiple-progress-bar">
      <div className="progress" style={{ width: `${progress}%`, backgroundColor: barColor }}>
      <div className="progress-label">{progress.toFixed(2)}%</div>
        
      </div>
    </div>
  );
};

export default MultipleProgressBar;


