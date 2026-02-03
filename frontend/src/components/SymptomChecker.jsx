import { useState } from 'react';
import { predictDisease } from '../services/api';

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [age, setAge] = useState('');
    const [duration, setDuration] = useState('3-5 days');
    const [severity, setSeverity] = useState('Moderate');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const commonSymptoms = [
        'sore throat', 'nausea', 'body aches', 'shortness of breath', 'fever', 'headache'
    ];

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSymptom(inputValue);
        }
    };

    const addSymptom = (symptom) => {
        const trimmed = symptom.trim();
        if (trimmed && !symptoms.includes(trimmed)) {
            setSymptoms([...symptoms, trimmed]);
            setInputValue('');
        }
    };

    const removeSymptom = (symptomToRemove) => {
        setSymptoms(symptoms.filter(s => s !== symptomToRemove));
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            if (symptoms.length === 0) {
                throw new Error('Please enter at least one symptom');
            }

            // Since the API expects a comma-separated string, we join the array
            // We are currently not sending age, duration, or severity as the API signature 
            // in the original code only used the symptom string. 
            // If the backend is updated to support these, we can add them here.
            // Pass all fields to the API
            const data = await predictDisease(symptoms.join(', '), age, duration, severity);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.msg || err.message || 'Failed to predict disease');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
                {/* Header */}
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="text-4xl text-blue-500">🩺</span> AI Symptom Checker
                </h2>
                <p className="text-slate-400 mb-8">Enter your symptoms and details below</p>

                <form onSubmit={handlePredict}>
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                        {/* Left Column - Symptoms */}
                        <div className="flex-1 space-y-4">
                            <label className="block text-white font-semibold mb-2">Symptoms</label>

                            {/* Symptom Input Container */}
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 min-h-[160px] flex flex-col">
                                {/* Selected Symptoms Tags */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {symptoms.map((s, idx) => (
                                        <span key={idx} className="bg-blue-900/30 text-blue-400 border border-blue-900/50 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            {s}
                                            <button
                                                type="button"
                                                onClick={() => removeSymptom(s)}
                                                className="hover:text-blue-300 focus:outline-none"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {/* Input Field */}
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Add a symptom..."
                                    className="bg-transparent text-white placeholder-slate-500 outline-none w-full p-2"
                                />

                                {/* Suggestions */}
                                <div className="mt-auto border-t border-slate-800 pt-2">
                                    <div className="flex flex-col gap-1">
                                        {commonSymptoms
                                            .filter(s => !symptoms.includes(s) && s.includes(inputValue.toLowerCase()))
                                            .slice(0, 4)
                                            .map((s, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => addSymptom(s)}
                                                    className="text-left text-slate-400 text-sm hover:text-white hover:bg-slate-900 p-1.5 rounded transition-colors"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="lg:w-80 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Age */}
                                <div>
                                    <label className="block text-slate-400 mb-2">Age</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="21"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                {/* Duration */}
                                <div>
                                    <label className="block text-slate-400 mb-2">Duration</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option>1-2 days</option>
                                        <option>3-5 days</option>
                                        <option>1 week+</option>
                                    </select>
                                </div>
                            </div>

                            {/* Severity */}
                            <div>
                                <label className="block text-slate-400 mb-2">Severity</label>
                                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                                    {['Mild', 'Moderate', 'Severe'].map((sev) => (
                                        <button
                                            key={sev}
                                            type="button"
                                            onClick={() => setSeverity(sev)}
                                            className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${severity === sev
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            {sev}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-blue-600/20"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                    </button>
                </form>

                {/* Footer Warning */}
                <div className="mt-8 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-yellow-500/80">
                        <span className="text-lg">⚠️</span>
                        <span>This tool provides informational insights only and is not a medical diagnosis.</span>
                    </div>
                    <p>Please consult a qualified doctor.</p>
                </div>

                {/* Results Section */}
                {error && (
                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-center">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-6 animate-fade-in border-t border-slate-800 pt-8">
                        <div className="p-6 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{result.disease}</h3>
                                    <p className="text-slate-400">{result.description}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${result.severity === 'Emergency' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                    result.severity === 'Moderate' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                        'bg-green-500/10 border-green-500/20 text-green-500'
                                    }`}>
                                    {result.severity}
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex justify-between text-sm text-slate-400 mb-2">
                                    <span>Confidence Score</span>
                                    <span className="text-white">{(result.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                        style={{ width: `${result.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-blue-500">📋</span> Recommended Precautions
                                </h4>
                                <ul className="grid gap-3">
                                    {result.precautions.map((p, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SymptomChecker;
