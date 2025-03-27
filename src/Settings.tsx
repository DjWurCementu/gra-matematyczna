import React, { useState } from 'react';

type Operation = '+' | '-' | '*' | '/';
export type GameSettings = {
    operations: Operation[];
    timeLimit: number;
    numberRange: [number, number];
};

interface SettingsProps {
    onStart: (settings: GameSettings) => void;
    initialSettings: GameSettings;
}

const Settings: React.FC<SettingsProps> = ({ onStart, initialSettings }) => {
    const [operations, setOperations] = useState<Operation[]>(initialSettings.operations);
    const [timeLimit, setTimeLimit] = useState(initialSettings.timeLimit);
    const [minNumber, setMinNumber] = useState(initialSettings.numberRange[0]);
    const [maxNumber, setMaxNumber] = useState(initialSettings.numberRange[1]);

    const handleOperationChange = (op: Operation) => {
        setOperations(prev =>
            prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (operations.length === 0) {
            alert('Wybierz co najmniej jedno działanie!');
            return;
        }
        if (minNumber >= maxNumber) {
            alert('Maksymalna liczba musi być większa niż minimalna!');
            return;
        }
        onStart({
            operations,
            timeLimit,
            numberRange: [minNumber, maxNumber]
        });
    };

    return (
        <div className="settings">
            <h2>Ustawienia gry</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Działania matematyczne:</label>
                    <div className="operations">
                        {(['+', '-', '*', '/'] as Operation[]).map(op => (
                            <label key={op}>
                                <input
                                    type="checkbox"
                                    checked={operations.includes(op)}
                                    onChange={() => handleOperationChange(op)}
                                />
                                {op === '+' ? 'Dodawanie' :
                                    op === '-' ? 'Odejmowanie' :
                                        op === '*' ? 'Mnożenie' : 'Dzielenie'}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>
                        Czas gry (sekundy):
                        <input
                            type="number"
                            min="10"
                            max="300"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Zakres liczb:
                        <div className="number-range">
                            <input
                                type="number"
                                min="1"
                                value={minNumber}
                                onChange={(e) => setMinNumber(Number(e.target.value))}
                            />
                            <span>do</span>
                            <input
                                type="number"
                                min={minNumber + 1}
                                value={maxNumber}
                                onChange={(e) => setMaxNumber(Number(e.target.value))}
                            />
                        </div>
                    </label>
                </div>

                <button type="submit" className="start-button">
                    Rozpocznij grę
                </button>
            </form>
        </div>
    );
};

export default Settings;