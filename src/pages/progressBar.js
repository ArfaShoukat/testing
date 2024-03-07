// ProgressBar.js
import './progressBar.css'
const ProgressBar = ({ currentQuestion, totalQuestions }) => {
    const progress = (currentQuestion / totalQuestions) * 100;
  
    return (
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
    );
  };
  
  export default ProgressBar;
  