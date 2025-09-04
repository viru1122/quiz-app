import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AnswerSection from './AnswerSection'
import "./QuizStyle.css"

const Quiz = () => {
    const [questions, setQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [showScore, setShowScore] = useState(false)
    const [score, setScore] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState([])

    // Fetch questions from API
    const fetchQuestions = async () => {
        const response = await axios.get(`https://quizapi.io/api/v1/questions?apiKey=3LbxpDvqfanW3VqeMQFYYotSOd2IRtM2CqejYECW&limit=10&category=code`)
        setQuestions(response.data)
    }

    useEffect(() => {
        fetchQuestions()
    }, [])

    // Handle the clicked answers option
    const handleAnswerOptionClick = (isCorrect, answer) => {
        if (isCorrect) {
            setScore((prev) => prev + 1)
        }

        const updatedSelectedAnswers = [...selectedAnswers]
        updatedSelectedAnswers[currentQuestion] = answer
        setSelectedAnswers(updatedSelectedAnswers)

        const nextQuestion = currentQuestion + 1
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion)
        } else {
            setShowScore(true)
        }
    }

    // handle play again button functionality
    const handlePlayAgainClick = () => {
        setCurrentQuestion(0)
        setShowScore(false)
        setScore(0)
        setSelectedAnswers([])
    }

    return (
        <div className='quiz'>
            <h1>Devlab Quiz App</h1>
            {showScore ? (
                <div className='score-section'>
                    <h2>Your Score: {score}</h2>
                    <button className='playAgain-btn' onClick={handlePlayAgainClick}>Play Again</button>
                </div>
            ) : (
                <>
                    {questions.length > 0 ? (
                        <div className='question-section'>
                            <div className='question-count'>
                                <span>{currentQuestion + 1}</span>/{questions.length}
                            </div>
                            <div className='question-text'>
                                {questions[currentQuestion]?.question}
                            </div>

                            <AnswerSection questions={questions} currentQuestion={currentQuestion} handleAnswerOptionClick={handleAnswerOptionClick} />

                            <div className='navigation-buttons'>
                                {currentQuestion > 0 && (
                                    <button onClick={() => setCurrentQuestion(currentQuestion - 1)}>Previous</button>
                                )}
                                {currentQuestion < questions.length && (
                                    <button onClick={() => setCurrentQuestion(currentQuestion + 1)}>Next</button>
                                )}
                            </div>
                        </div>
                    ) : <p>
                        Loading...
                    </p>
                    }

                </>
            )}
        </div>
    )
}

export default Quiz
