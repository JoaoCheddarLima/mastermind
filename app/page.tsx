"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Brain } from 'lucide-react'
import axios from 'axios'
import { randomId } from '@/lib/random'
import Link from 'next/link'

export default function Component() {
	const [userId, setUserId] = useState('')
	useEffect(() => {
		const userId = localStorage.getItem('userId');
		if (!userId) {
			const newUserId = randomId();

			localStorage.setItem('userId', newUserId);
			setUserId(newUserId);
		} else {
			setUserId(userId);
		}
	}, []);
	const [question, setQuestion] = useState('')
	const [answer, setAnswer] = useState('')
	const [isFlipped, setIsFlipped] = useState(false)
	const [isEditing, setIsEditing] = useState({ question: false, answer: false })
	const [showSaveButton, setShowSaveButton] = useState(false)
	const [isResetting, setIsResetting] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (isEditing.question || isEditing.answer) {
			inputRef.current?.focus()
		}
	}, [isEditing])

	useEffect(() => {
		setShowSaveButton(!!answer.trim())
	}, [answer])

	const handleQuestionSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && question.trim() !== '') {
			setIsFlipped(true)
		}
	}

	const handleAnswerSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && answer.trim() !== '') {
			setIsFlipped(false)
		}
	}

	const handleSave = () => {
		console.log('Saving:', { question, answer })
		// Implement your save logic here
		axios.post('/api', { question, answer, userId })

		setIsResetting(true)
	}

	const resetCards = () => {
		setQuestion('')
		setAnswer('')
		setIsFlipped(false)
		setShowSaveButton(false)
		setIsResetting(false)
	}

	const handleTestYourself = () => {
		console.log('Test Yourself clicked')
		// Implement your test logic here
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex flex-col items-center justify-center p-4">
			<header className="w-full text-center mb-8">
				<h1 className="text-4xl font-bold text-white tracking-wider">MASTERMIND</h1>
			</header>
			<AnimatePresence mode="wait" onExitComplete={() => isResetting && resetCards()}>
				{!isResetting && (
					<motion.div
						key="card"
						initial={false}
						exit={{ x: '100%' }}
						transition={{ duration: 0.37 }}
						className="w-full max-w-md [perspective:1000px]"
					>
						<motion.div
							className="w-full h-64 relative [transform-style:preserve-3d]"
							animate={{ rotateY: isFlipped ? 180 : 0 }}
							transition={{ duration: 0.37 }}
						>
							<div
								className={`absolute w-full h-full bg-yellow-200 rounded-lg shadow-lg p-6 [backface-visibility:hidden] ${isFlipped ? 'hidden' : ''
									}`}
							>
								<div className="flex flex-col h-full text-black">
									<label htmlFor="question" className="text-lg font-semibold mb-2">Question:</label>
									{isEditing.question ? (
										<input
											ref={inputRef}
											type="text"
											id="question"
											value={question}
											onChange={(e) => setQuestion(e.target.value)}
											onKeyPress={handleQuestionSubmit}
											onBlur={() => setIsEditing({ ...isEditing, question: false })}
											className="bg-transparent border-b-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors duration-300"
										/>
									) : (
										<p onClick={() => setIsEditing({ ...isEditing, question: true })} className="cursor-pointer flex-grow">
											{question || 'Click to add question'}
										</p>
									)}
								</div>
							</div>
							<div
								className={`absolute w-full h-full bg-yellow-200 rounded-lg shadow-lg p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] ${isFlipped ? '' : 'hidden'
									}`}
							>
								<div className="flex flex-col h-full text-black">
									<label htmlFor="answer" className="text-lg font-semibold mb-2">Answer:</label>
									{isEditing.answer ? (
										<input
											ref={inputRef}
											type="text"
											id="answer"
											value={answer}
											onChange={(e) => setAnswer(e.target.value)}
											onKeyPress={handleAnswerSubmit}
											onBlur={() => setIsEditing({ ...isEditing, answer: false })}
											className="bg-transparent border-b-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors duration-300"
										/>
									) : (
										<p onClick={() => setIsEditing({ ...isEditing, answer: true })} className="cursor-pointer flex-grow">
											{answer || 'Click to add answer'}
										</p>
									)}
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			{question && answer && !isResetting && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.37 }}
					className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 text-black"
				>
					<div className="bg-yellow-200 rounded-lg shadow-lg p-4">
						<p className="font-semibold">Q: {question}</p>
					</div>
					<div className="bg-yellow-200 rounded-lg shadow-lg p-4">
						<p className="font-semibold">A: {answer}</p>
					</div>
				</motion.div>
			)}
			<div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
				<AnimatePresence>
					{showSaveButton && !isResetting && (
						<motion.button
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.37 }}
							onClick={handleSave}
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Save className="mr-2" size={20} />
							Save
						</motion.button>
					)}
				</AnimatePresence>
				<Link
					href={'/test'}
				>
					<motion.button
						onClick={handleTestYourself}
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Brain className="mr-2" size={20} />
						Test Yourself
					</motion.button>
				</Link>
			</div>
		</div>
	)
}