import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import quizData from '../data/quizData.json';
import ProgressBar from './ProgressBar';
import MultipleProgressBar from './MultipleProgressBar'; 
import './index.css';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const totalQuestions = quizData.length;
  const maxScore = totalQuestions;
  const [progressPercentage, setProgressPercentage] = useState(0);


  const Star = ({ filled }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={filled ? 'black' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-star"
        width="16"
        height="16"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  };

  useEffect(() => {
    // Calculate progress percentage
    const remainingQuestions = totalQuestions - currentQuestion;
    const remainingProgress = (remainingQuestions / totalQuestions) * 100;
    const correctProgress = (score / maxScore) * 100;
    const progress = correctProgress + (remainingProgress / totalQuestions) * (maxScore - score);
    setProgressPercentage(progress);
  }, [currentQuestion, score]);

  const handleAnswer = () => {
    const correctAnswer = decodedQuestions[currentQuestion].correct_answer;

    if (selectedOption === correctAnswer) {
      setScore(score + 1);
      setAnswerFeedback('Correct!');
    } else {
      setAnswerFeedback('Sorry!');
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < decodedQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setDisabledOptions([]);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setAnswerFeedback(null);
    setSelectedOption(null);
    setDisabledOptions([]);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const correctAnswer = decodedQuestions[currentQuestion].correct_answer;
    const disabledOptions = decodedQuestions[currentQuestion].options.filter(opt => opt !== option);
    setDisabledOptions(disabledOptions);
    if (option === correctAnswer) {
      setAnswerFeedback('Correct!');
    } else {
      setAnswerFeedback('Sorry!');
    }
  };

  const decodedQuestions = quizData.map((questionObj, index) => {
    try {
      const decodedQuestion = decodeURIComponent(questionObj.question);
      const decodedOptions = questionObj.incorrect_answers ?
        questionObj.incorrect_answers.map(option => decodeURIComponent(option)) : [];
      const decodedCorrectAnswer = decodeURIComponent(questionObj.correct_answer);

      return {
        ...questionObj,
        question: decodedQuestion,
        options: [...decodedOptions, decodedCorrectAnswer],
        correct_answer: decodedCorrectAnswer
      };
    } catch (error) {
      console.error(`Error decoding question ${index}:`, error);
      console.log('Question Object:', questionObj);
      return null;
    }
  }).filter(question => question !== null);

  const isSubmitDisabled = selectedOption === null;


  let starCount = 0;
  if (decodedQuestions[currentQuestion] && decodedQuestions[currentQuestion].difficulty === "easy") {
    starCount = 1;
  } else if (decodedQuestions[currentQuestion] && decodedQuestions[currentQuestion].difficulty === "medium") {
    starCount = 2;
  } else if (decodedQuestions[currentQuestion] && decodedQuestions[currentQuestion].difficulty === "hard") {
    starCount = 3;
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <Head>
          <title>Quiz App</title>
        </Head>

        <ProgressBar currentQuestion={currentQuestion + 1} totalQuestions={totalQuestions} />

        <div>
          <h1 className="text-3xl font-bold mb-4">
            Question {currentQuestion + 1} of {totalQuestions}
          </h1>
          <p>Entertainment: Board game</p>
          <div className="flex">
            {[...Array(3)].map((_, index) => (
              <Star key={index} filled={index < starCount} />
            ))}
          </div>
        </div>
        <br/>

        <div>
          {showResult ? (
            <div>
              <h1 className="text-3xl font-bold mb-4">Result</h1>
              <p className="mb-2">Your score: {score} / {decodedQuestions.length}</p>
              <button onClick={restartQuiz} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Restart Quiz
              </button>
            </div>
          ) : (
            <div>
              {decodedQuestions[currentQuestion] && (
                <>
                  <p className="mb-4">{decodedQuestions[currentQuestion].question}</p>
                  <div className="options-container">
                    <div className="column">
                      {decodedQuestions[currentQuestion].options.slice(0, 2).map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className={`option-button bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded mb-2 mr-2 ${selectedOption === option ? 'bg-black text-white' : ''} ${disabledOptions.includes(option) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={disabledOptions.includes(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <div className="column">
                      {decodedQuestions[currentQuestion].options.slice(2).map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className={`option-button bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded mb-2 mr-2 ${selectedOption === option ? 'bg-black text-white' : ''} ${disabledOptions.includes(option) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={disabledOptions.includes(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  {answerFeedback && (
                    <p>{answerFeedback}</p>
                  )}
                  <button onClick={handleAnswer} className={`submit-button bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-7 rounded mt-4 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitDisabled}>
                    Next Question
                  </button>
                </>
              )}
            </div>
            
          )}
        </div>
       
      </div>

      {/* Add MultipleProgressBar component */}
      <div className="multiple-progress-bars">
        <MultipleProgressBar progress={progressPercentage} />
      </div>
      <br/><br/> <br/><br/> <br/><br/>
    </div>
    
  );
};

export default Quiz;



