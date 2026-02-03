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
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-3xl">📝</span> AI Prescription Reader
                </h2>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-2">
                            <div className="text-4xl">📤</div>
                            <p className="text-slate-300 font-medium">
                                {file ? file.name : 'Drop your prescription here or click to upload'}
                            </p>
                            <p className="text-slate-500 text-sm">Supports JPG, PNG</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Extract Medicines'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-6 animate-fade-in">
                        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold text-white">Extracted Details</h3>
                                <span className="text-slate-400 text-sm">{result.date}</span>
                            </div>

                            <div className="p-4">
                                <div className="mb-4">
                                    <span className="text-slate-500 text-sm">Doctor</span>
                                    <p className="text-white font-medium">{result.doctor}</p>
                                </div>

                                <div className="space-y-3">
                                    <span className="text-slate-500 text-sm">Medicines Detected</span>
                                    {result.medicines_detected && result.medicines_detected.length > 0 ? (
                                        result.medicines_detected.map((med, i) => (
                                            <div key={i} className="flex flex-col p-4 bg-slate-800 rounded-lg gap-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-white font-bold text-lg">{med.name} <span className="text-blue-400 text-sm">({med.dosage})</span></p>
                                                        <p className="text-slate-400 text-sm">{med.frequency} • {med.days}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddReminder(med)}
                                                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                                                    >
                                                        <span>⏰</span> Add Reminder
                                                    </button>
                                                </div>
                                                <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded w-fit">
                                                    {med.instructions}
                                                </div>
                                                {med.description && (
                                                    <div className="mt-1 pt-2 border-t border-slate-700">
                                                        <p className="text-slate-300 text-sm italic">"{med.description}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-400">No medicines detected.</p>
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
