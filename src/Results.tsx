import React from 'react';

interface ResultsProps {
    score: number;
    onRestart: () => void;
    timeLimit: number;
}

const Results: React.FC<ResultsProps> = ({ score, onRestart, timeLimit }) => {
    const speed = (score / timeLimit * 60).toFixed(1); // problems per minute

    return (
        <div className="results">
            <h2>Twój wynik</h2>
    <div className="score">Rozwiązane zadania: {score}</div>
    <div className="speed">Szybkość: {speed} zadań/min</div>
    <button onClick={onRestart} className="restart-button">
        Zagraj ponownie
    </button>
    </div>
);
};

export default Results;