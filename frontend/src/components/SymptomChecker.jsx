import { useState } from 'react';
import { predictDisease } from '../services/api';

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Split symptoms by comma and trim
            const symptomList = symptoms.split(',').map(s => s.trim()).filter(s => s);
            if (symptomList.length === 0) {
                throw new Error('Please enter at least one symptom');
            }

            const data = await predictDisease(symptomList.join(', '));
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.msg || err.message || 'Failed to predict disease');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-3xl">🩺</span> AI Symptom Checker
                </h2>

                <form onSubmit={handlePredict} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-2">Enter Symptoms (comma separated)</label>
                        <textarea
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"
                            placeholder="e.g. fever, headache, cough, fatigue"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-6 animate-fade-in">
                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{result.disease}</h3>
                                    <p className="text-slate-400 text-sm">{result.description}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-bold ${result.severity === 'Emergency' ? 'bg-red-500/20 text-red-500' :
                                    result.severity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-500' :
                                        'bg-green-500/20 text-green-500'
                                    }`}>
                                    {result.severity}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-slate-400 mb-1">
                                    <span>Confidence Score</span>
                                    <span>{(result.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${result.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Recommended Precautions:</h4>
                                <ul className="list-disc list-inside text-slate-300 space-y-1">
                                    {result.precautions.map((p, i) => (
                                        <li key={i}>{p}</li>
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
