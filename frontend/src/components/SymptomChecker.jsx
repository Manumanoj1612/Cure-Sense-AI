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
            <div className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-blue-900/5 ring-1 ring-slate-100">
                {/* Header */}
                <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                    <span className="text-4xl p-2 bg-blue-50 rounded-2xl">🩺</span> AI Symptom Checker
                </h2>
                <p className="text-slate-500 mb-8 ml-16">Enter your symptoms and details below</p>

                <form onSubmit={handlePredict}>
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                        {/* Left Column - Symptoms */}
                        <div className="flex-1 space-y-4">
                            <label className="block text-slate-700 font-bold mb-2">Symptoms</label>

                            {/* Symptom Input Container */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[160px] flex flex-col focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                {/* Selected Symptoms Tags */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {symptoms.map((s, idx) => (
                                        <span key={idx} className="bg-white text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm font-medium">
                                            {s}
                                            <button
                                                type="button"
                                                onClick={() => removeSymptom(s)}
                                                className="text-slate-400 hover:text-red-500 focus:outline-none transition-colors"
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
                                    placeholder="Add a symptom (e.g., headache)..."
                                    className="bg-transparent text-slate-800 placeholder-slate-400 outline-none w-full p-2"
                                />

                                {/* Suggestions */}
                                <div className="mt-auto border-t border-slate-200 pt-3">
                                    <p className="text-xs text-slate-400 mb-2 font-medium">SUGGESTIONS</p>
                                    <div className="flex flex-wrap gap-2">
                                        {commonSymptoms
                                            .filter(s => !symptoms.includes(s) && s.includes(inputValue.toLowerCase()))
                                            .slice(0, 4)
                                            .map((s, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => addSymptom(s)}
                                                    className="text-left text-slate-600 text-sm hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
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
                                    <label className="block text-slate-600 font-medium mb-2 text-sm">Age</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="21"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                                    />
                                </div>
                                {/* Duration */}
                                <div>
                                    <label className="block text-slate-600 font-medium mb-2 text-sm">Duration</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none appearance-none cursor-pointer transition-all"
                                    >
                                        <option>1-2 days</option>
                                        <option>3-5 days</option>
                                        <option>1 week+</option>
                                    </select>
                                </div>
                            </div>

                            {/* Severity */}
                            <div>
                                <label className="block text-slate-600 font-medium mb-2 text-sm">Severity</label>
                                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                    {['Mild', 'Moderate', 'Severe'].map((sev) => (
                                        <button
                                            key={sev}
                                            type="button"
                                            onClick={() => setSeverity(sev)}
                                            className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${severity === sev
                                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-100'
                                                : 'text-slate-400 hover:text-slate-600'
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99]"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                    </button>
                </form>

                {/* Footer Warning */}
                <div className="mt-8 text-center bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <div className="flex items-center justify-center gap-2 text-yellow-700 font-medium mb-1">
                        <span className="text-lg">⚠️</span>
                        <span>Medical Disclaimer</span>
                    </div>
                    <p className="text-yellow-600/80 text-sm">This tool provides informational insights only and is not a medical diagnosis. Please consult a qualified doctor.</p>
                </div>

                {/* Results Section */}
                {error && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center font-medium">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-6 animate-fade-in border-t border-slate-100 pt-8">
                        <div className="p-8 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 shadow-inner">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-3xl font-bold text-slate-800">{result.disease}</h3>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${result.severity === 'Emergency' ? 'bg-red-50 text-red-600 border-red-100' :
                                            result.severity === 'Moderate' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                            {result.severity}
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-lg leading-relaxed">{result.description}</p>
                                </div>
                            </div>

                            <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
                                    <span>AI Confidence Score</span>
                                    <span className="text-blue-600 font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-1000 shadow-lg shadow-blue-200"
                                        style={{ width: `${result.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                                    <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">📋</span> Recommended Precautions
                                </h4>
                                <ul className="grid gap-3 md:grid-cols-2">
                                    {result.precautions.map((p, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-600 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
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
