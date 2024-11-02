import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './SignalEncoding.css';

const nrzlEncoding = (data) => {
    const signal = [];
    for (let bit of data) {
        if (bit === '0') {
            signal.push(0); 
        } else {
            signal.push(1); 
        }
    }
    return signal;
};

const nrziEncoding = (data) => {
    const signal = [];
    let currentLevel = 0;

    for (let bit of data) {
        if (bit === '1') {
            currentLevel = 1 - currentLevel;
        }
        signal.push(currentLevel);
    }

    return signal;
};

const bipolarAMIEncoding = (data) => {
    const signal = [];
    let lastNonZeroLevel = -1;

    for (let bit of data) {
        if (bit === '0') {
            signal.push(0);
        } else {
            lastNonZeroLevel = -lastNonZeroLevel;
            signal.push(lastNonZeroLevel);
        }
    }

    return signal;
};

const pseudoternaryEncoding = (data) => {
    const signal = [];
    let lastNonZeroLevel = -1;

    for (let bit of data) {
        if (bit === '1') {
            signal.push(0);
        } else {
            lastNonZeroLevel = -lastNonZeroLevel;
            signal.push(lastNonZeroLevel);
        }
    }

    return signal;
};

const manchesterEncoding = (data) => {
    const signal = [];

    for (let bit of data) {
        if (bit === '0') {
            signal.push(1, 0); // High-to-low for '0'
        } else {
            signal.push(0, 1); // Low-to-high for '1'
        }
    }

    return signal;
};

const differentialManchesterEncoding = (data) => {
    const signal = [];
    let currentLevel = 1; // Start with high

    for (let bit of data) {
        if (bit === '0') {
            currentLevel = 1 - currentLevel; // Transition at the beginning
            signal.push(currentLevel);
            currentLevel = 1 - currentLevel; // Transition at the middle
            signal.push(currentLevel);
        } else {
            signal.push(currentLevel); // No transition at the beginning
            currentLevel = 1 - currentLevel; // Transition at the middle
            signal.push(currentLevel);
        }
    }

    return signal;
};




// Main Component
const SignalEncoding = () => {
    const [inputData, setInputData] = useState('');
    const [signals, setSignals] = useState({
        nrzl: [],
        nrzi: [],
        bipolarAMI: [],
        pseudoternary: [],
        manchester: [],
        differentialManchester: [],
    });

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSignals({
            nrzl: nrzlEncoding(inputData),
            nrzi: nrziEncoding(inputData),
            bipolarAMI: bipolarAMIEncoding(inputData),
            pseudoternary: pseudoternaryEncoding(inputData),
            manchester: manchesterEncoding(inputData),
            differentialManchester: differentialManchesterEncoding(inputData),
        });
    };

    
    const createLabels = (data, double = false) => {
        if (double) {
            return data.split('').map(bit => `${bit} `).flatMap(bit => [bit, '']); 
        }
        return data.split('');
    };

    const createChartData = (signalData, label, doubleLabels = false) => ({
        labels: createLabels(inputData, doubleLabels), 
        datasets: [
            {
                label: `${label} Encoding`,
                data: signalData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                stepped: true,
            },
        ],
    });

    return (
        <div className="encoding-container">
            <h1>Signal Encoding</h1>
            <form onSubmit={handleSubmit} className="form-inline">
            <div className="form-group">
                <input
                    type="text"
                    value={inputData}
                    onChange={handleInputChange}
                    placeholder="Enter binary data (e.g., 1011001)"
                    required
                />
                <button type="submit">Encode</button>
            </div>
        </form>

            <div className="encoding-card">
                <h2>NRZ-L Encoding</h2>
                {signals.nrzl.length > 0 && (
                    <Line data={createChartData(signals.nrzl, "NRZ-L")} />
                )}
            </div>

            <div className="encoding-card">
                <h2>NRZ-I Encoding</h2>
                {signals.nrzi.length > 0 && (
                    <Line data={createChartData(signals.nrzi, "NRZ-I")} />
                )}
            </div>

            <div className="encoding-card">
                <h2>Bipolar AMI Encoding</h2>
                {signals.bipolarAMI.length > 0 && (
                    <Line data={createChartData(signals.bipolarAMI, "Bipolar AMI")} />
                )}
            </div>

            <div className="encoding-card">
                <h2>Pseudoternary Encoding</h2>
                {signals.pseudoternary.length > 0 && (
                    <Line data={createChartData(signals.pseudoternary, "Pseudoternary")} />
                )}
            </div>

            <div className="encoding-card">
                <h2>Manchester Encoding</h2>
                {signals.manchester.length > 0 && (
                    <Line data={createChartData(signals.manchester, "Manchester", true)} />
                )}
            </div>

            <div className="encoding-card">
                <h2>Differential Manchester Encoding</h2>
                {signals.differentialManchester.length > 0 && (
                    <Line data={createChartData(signals.differentialManchester, "Differential Manchester", true)} />
                )}
            </div>
        </div>
    );
};

export default SignalEncoding;
