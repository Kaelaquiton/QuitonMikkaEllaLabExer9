import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './SignalEncoding.css';

const appendFinalState = (signal) => {
    if (signal.length > 0) {
        signal.push(signal[signal.length - 1]);
    }
    return signal;
};

const nrzlEncoding = (data) => {
    const signal = data.split('').map(bit => (bit === '0' ? 0 : 1));
    return appendFinalState(signal);
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
    return appendFinalState(signal);
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
    return appendFinalState(signal);
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
    return appendFinalState(signal);
};

const manchesterEncoding = (data) => {
    const signal = [];

    for (let bit of data) {
        if (bit === '0') {
            signal.push(1, 0); 
        } else {
            signal.push(0, 1); 
        }
    }
    return appendFinalState(signal);
};

const differentialManchesterEncoding = (data) => {
    const signal = [];
    let currentLevel = 1; 

    for (let bit of data) {
        if (bit === '0') {
            currentLevel = 1 - currentLevel; 
            signal.push(currentLevel);
            currentLevel = 1 - currentLevel; 
            signal.push(currentLevel);
        } else {
            signal.push(currentLevel); 
            currentLevel = 1 - currentLevel; 
            signal.push(currentLevel);
        }
    }
    return appendFinalState(signal);
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
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^[01]*$/.test(value)) { 
            setInputData(value);
            setError(''); 
        } else {
            setError('Input must contain only binary digits (0 or 1).');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputData || /[^01]/.test(inputData)) { 
            setError('Please enter a valid binary sequence using only 0s and 1s.');
            return;
        }

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
        const labels = data.split('');
        labels.push(''); 
        if (double) {
            return labels.flatMap(bit => [bit, '']);
        }
        return labels;
    };

    const createChartData = (signalData, label, doubleLabels = false) => ({
        labels: createLabels(inputData, doubleLabels), 
        datasets: [
            {
                label: `${label} Encoding`,
                data: signalData,
                borderColor: 'rgba(173, 216, 230, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                stepped: true,
            },
        ],
    });

    return (
        <div className="encoding-container">
            <h1>Digital Signal Encoding</h1>
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

            <div>
                <h5 style={{ color: 'red', fontSize: '15px', fontWeight: 'normal', margin: '10px 0' }}>
                    Note: Binary digit label is positioned at the beginning of every transition
                </h5>
            </div>


            <div className="encoding-card">
                <h2>NRZ-L </h2>
                {signals.nrzl.length > 0 && (
                    <Line data={createChartData(signals.nrzl, "NRZ-L")} />
                )}
            </div>

            <div className="encoding-card">
                <h2>NRZ-I </h2>
                {signals.nrzi.length > 0 && (
                    <Line data={createChartData(signals.nrzi, "NRZ-I")} />
                )}
            </div>

            <div className="encoding-card">
                <h2>Bipolar AMI </h2>
                {signals.bipolarAMI.length > 0 && (
                    <Line data={createChartData(signals.bipolarAMI, "Bipolar AMI")} />
                )}
            </div>

            <div className="encoding-card">
                <h2>Pseudoternary </h2>
                {signals.pseudoternary.length > 0 && (
                    <Line data={createChartData(signals.pseudoternary, "Pseudoternary")} />
                )}
            </div>

            <div className="encoding-card">
                <h2>Manchester </h2>
                {signals.manchester.length > 0 && (
                    <Line data={createChartData(signals.manchester, "Manchester", true)} />
                )}
            </div>

            <div className="encoding-card">
                <h2>Differential Manchester </h2>
                {signals.differentialManchester.length > 0 && (
                    <Line data={createChartData(signals.differentialManchester, "Differential Manchester", true)} />
                )}
            </div>
        </div>
    );
};

export default SignalEncoding;
