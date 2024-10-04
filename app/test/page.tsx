"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { set } from 'mongoose'

interface IFlashCard {
    id: string
    question: string
    answer: string
    userId: string
    createdAt: number
    aiEmpowered: boolean
    aiAnswers: string[]
    aiRefactoredQuestion: string
}

export default function TestPage() {
    const [flashcard, setFlashcard] = useState<IFlashCard | null>(null)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [correctAnswer, setCorrectAnswer] = useState<string>()

    const fetchQuestion = async () => {
        try {
            const response = await fetch(`/api?userId=${localStorage.getItem('userId')}`)
            const data: IFlashCard = await response.json()
            data.aiAnswers = data.aiAnswers.sort(() => Math.random() - 0.5)

            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setFlashcard(data)
            setSelectedAnswer(null)
            setIsSubmitted(false)
            setCorrectAnswer(data.aiAnswers[0])
        } catch (error) {
            console.error('Error fetching question:', error)
        }
    }

    useEffect(() => {
        fetchQuestion()
    }, [])

    const handleAnswerSelect = (answer: string) => {
        if (!isSubmitted) {
            setSelectedAnswer(answer)
        }
    }

    const handleSubmit = () => {
        setIsSubmitted(true)
    }

    const isCorrectAnswer = selectedAnswer === correctAnswer

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-white mb-8">Test Your Knowledge</h1>
            {flashcard ? (
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 text-black">
                    <h2 className="text-2xl font-semibold mb-4">{flashcard.aiRefactoredQuestion || flashcard.question}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {flashcard.aiAnswers.map((answer, index) => (
                            <motion.div
                                key={index}
                                className={`p-4 rounded-lg cursor-pointer ${selectedAnswer === answer
                                        ? isSubmitted
                                            ? isCorrectAnswer
                                                ? 'bg-green-200 border-green-500'
                                                : 'bg-red-200 border-red-500'
                                            : 'bg-blue-200 border-blue-500'
                                        : 'bg-gray-100'
                                    } border-2 ${isSubmitted && !isCorrectAnswer && answer === flashcard.aiAnswers[0] ? 'border-green-500' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAnswerSelect(answer)}
                            >
                                {answer}
                            </motion.div>
                        ))}
                    </div>
                    {selectedAnswer && !isSubmitted && (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-300"
                            onClick={handleSubmit}
                        >
                            Submit
                        </motion.button>
                    )}
                    {isSubmitted && (
                        <p className={`text-center font-semibold ${isCorrectAnswer ? 'text-green-600' : 'text-red-600'}`}>
                            {isCorrectAnswer ? 'Correct!' : 'Incorrect. Try again!'}
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-white text-xl">Loading question...</p>
            )}
            <div className="mt-8 flex space-x-4">
                <Link href="/">
                    <motion.button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg flex items-center transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Home className="mr-2" size={20} />
                        Home
                    </motion.button>
                </Link>
                <motion.button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchQuestion}
                >
                    <ArrowRight className="mr-2" size={20} />
                    Next
                </motion.button>
            </div>
        </div>
    )
}