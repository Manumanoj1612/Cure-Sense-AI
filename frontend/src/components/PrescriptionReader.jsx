import { useState } from 'react';
import api, { addReminder } from '../services/api';

const PrescriptionReader = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAddReminder = async (med) => {
        try {
            await addReminder({
                medicineName: med.name,
                dosage: med.dosage,
                frequency: med.frequency,
                time: "09:00", // Default time as prescriptions don't usually have it
                instructions: med.instructions || med.description
            });
            alert(`✅ Added ${med.name} to your reminders!`);
        } catch (err) {
            console.error(err);
            alert('❌ Failed to add reminder. Please try again.');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Use direct axios call or update api.js to handle multipart/form-data
            // Here we use the api instance but need to set content type
            const response = await api.post('/ai/prescription', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to process prescription. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-blue-900/5">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <span className="text-3xl p-2 bg-green-50 rounded-2xl">📝</span> AI Prescription Reader
                </h2>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-slate-50 transition-all cursor-pointer relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="space-y-3 transition-transform group-hover:scale-105">
                            <div className="text-5xl mb-2">📤</div>
                            <p className="text-slate-700 font-bold text-lg">
                                {file ? file.name : 'Click to Upload Prescription'}
                            </p>
                            <p className="text-slate-400 text-sm">Supported formats: JPG, PNG</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 hover:scale-[1.01]"
                    >
                        {loading ? 'Processing...' : 'Extract Medicines'}
                    </button>
                </form>

                {error && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center font-medium">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-6 animate-fade-in border-t border-slate-100 pt-8">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700">Extracted Details</h3>
                                <span className="text-slate-500 text-sm font-medium">{result.date}</span>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Doctor</span>
                                    <p className="text-slate-800 font-bold text-lg">{result.doctor}</p>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Medicines Detected</span>
                                    {result.medicines_detected && result.medicines_detected.length > 0 ? (
                                        result.medicines_detected.map((med, i) => (
                                            <div key={i} className="flex flex-col p-5 bg-white border border-slate-100 rounded-xl gap-3 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-slate-800 font-bold text-lg">{med.name} <span className="text-blue-500 text-sm font-medium">({med.dosage})</span></p>
                                                        <p className="text-slate-500 text-sm">{med.frequency} • {med.days}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddReminder(med)}
                                                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 font-bold"
                                                    >
                                                        <span>⏰</span> Add
                                                    </button>
                                                </div>
                                                <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg w-fit font-medium border border-slate-100">
                                                    {med.instructions}
                                                </div>
                                                {med.description && (
                                                    <div className="mt-1 pt-3 border-t border-slate-50">
                                                        <p className="text-slate-500 text-sm italic">"{med.description}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 bg-slate-50 rounded-xl text-slate-500 border border-slate-100 border-dashed">
                                            No medicines detected.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrescriptionReader;
