import React, { useState } from 'react';
import Game from './Game';
import Settings from './Settings';
import Results from './Results';
import './App.css';

type Operation = '+' | '-' | '*' | '/';
type GameSettings = {
    operations: Operation[];
    timeLimit: number;
    numberRange: [number, number];
};

const App: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [settings, setSettings] = useState<GameSettings>({
        operations: ['+', '-'],
        timeLimit: 60,
        numberRange: [1, 10]
    });

    const handleStartGame = (newSettings: GameSettings) => {
        setSettings(newSettings);
        setGameStarted(true);
        setGameFinished(false);
        setScore(0);
    };

    const handleGameFinish = (finalScore: number) => {
        setScore(finalScore);
        setGameFinished(true);
        setGameStarted(false);
    };

    const handleRestart = () => {
        setGameStarted(true);
        setGameFinished(false);
        setScore(0);
    };

    return (
        <div className="app">
            <h1>Matematyczna Gra Arytmetyczna</h1>
            {!gameStarted && !gameFinished && (
                <Settings onStart={handleStartGame} initialSettings={settings} />
            )}
            {gameStarted && (
                <Game
                    settings={settings}
                    onFinish={handleGameFinish}
                    onRestart={handleRestart}
                />
            )}
            {gameFinished && (
                <Results score={score} onRestart={handleRestart} timeLimit={settings.timeLimit} />
            )}
        </div>
    );
};

export default App;