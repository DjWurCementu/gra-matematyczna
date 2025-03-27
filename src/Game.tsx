import React, { useState, useEffect, useCallback } from 'react';
import { GameSettings } from './Settings';

interface GameProps {
    settings: GameSettings;
    onFinish: (score: number) => void;
    onRestart: () => void;
}

const Game: React.FC<GameProps> = ({ settings, onFinish, onRestart }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
    const [currentProblem, setCurrentProblem] = useState<{
        a: number;
        b: number;
        operation: string;
        answer: number;
    } | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [skipAvailable, setSkipAvailable] = useState(false);
    const [skipTimer, setSkipTimer] = useState(3);

    const generateProblem = useCallback(() => {
        const { operations, numberRange } = settings;
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let a = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];
        let b = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];
        let answer: number;

        if (operation === '-') {
            if (a < b) [a, b] = [b, a];
            answer = a - b;
        } else if (operation === '/') {
            a = a * b;
            answer = a / b;
        } else if (operation === '*') {
            answer = a * b;
        } else {
            answer = a + b;
        }

        setCurrentProblem({ a, b, operation, answer });
        setUserAnswer('');
        setIsCorrect(null);
        setSkipAvailable(false);
        setSkipTimer(3);
    }, [settings]);

    useEffect(() => {
        generateProblem();
    }, [generateProblem]);

    useEffect(() => {
        const timer = setInterval(() => {
            setSkipTimer(prev => {
                if (prev <= 1) {
                    setSkipAvailable(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentProblem]);

    useEffect(() => {
        if (userAnswer === '' || !currentProblem) return;

        const parsedAnswer = parseFloat(userAnswer);
        if (!isNaN(parsedAnswer)) {
            const isAnswerCorrect = parsedAnswer === currentProblem.answer;
            setIsCorrect(isAnswerCorrect);

            if (isAnswerCorrect) {
                setScore(prev => prev + 1);
                setTimeout(() => generateProblem(), 500);
            }
        }
    }, [userAnswer, currentProblem, generateProblem]);

    useEffect(() => {
        if (timeLeft <= 0) {
            onFinish(score);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    onFinish(score);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, score, onFinish]);

    const handleSkip = () => {
        generateProblem();
    };

    const handleEndGame = () => {
        onFinish(score);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="game">
            <div className="game-header">
                <div className="score">Wynik: {score}</div>
                <div className="timer">Czas: {formatTime(timeLeft)}</div>
            </div>

            {currentProblem && (
                <div className="problem-container">
                    <div className="problem">
                        <div className="equation">
                            {currentProblem.a} {currentProblem.operation} {currentProblem.b} = ?
                        </div>
                        <div className="answer-input">
                            <input
                                type="number"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                autoFocus
                                step={currentProblem.operation === '/' ? '0.01' : '1'}
                            />
                        </div>
                    </div>

                    <div className="controls">
                        <button
                            onClick={handleSkip}
                            disabled={!skipAvailable}
                            className="skip-btn"
                        >
                            {skipAvailable ? 'Pomiń' : `Pomiń (${skipTimer})`}
                        </button>

                        <button
                            onClick={handleEndGame}
                            className="end-btn"
                        >
                            Zakończ grę
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;