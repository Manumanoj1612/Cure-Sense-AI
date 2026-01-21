import { useState, useEffect } from 'react';
import { getDoctors } from '../services/api';

const DoctorRecommendation = () => {
    const [symptoms, setSymptoms] = useState('');
    const [location, setLocation] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Pass symptoms as part of the body or query if the API supports it
            // The getDoctors API in api.js currently takes (location, specialty)
            // But our backend doctorController uses req.body.symptoms for AI recommendation if specialty is missing.
            // However, getDoctors uses GET request, so we can't pass body easily unless we change it to POST or pass as query params.
            // Let's check api.js again. It sends GET request.
            // We should probably update api.js to support passing symptoms for AI recommendation, 
            // OR just rely on the backend's GET handling if we pass symptoms as a query param (if backend supports it).
            // Looking at backend doctorController: const { location, specialty } = req.query; ... if (!specialty && req.body.symptoms) ...
            // Wait, GET requests shouldn't have a body. The backend check `req.body.symptoms` might fail for a GET request.
            // We should probably send symptoms as a query param 'symptoms' and update backend to check req.query.symptoms.

            // For now, let's assume we pass symptoms as 'specialty' if user types it there, or we need to fix the backend to read symptoms from query.
            // Let's try passing symptoms as specialty for now if location is empty, or just pass it.

            // Pass location, specialty (null), and symptoms
            const data = await getDoctors(location, null, symptoms);
            setDoctors(data);
        } catch (err) {
            setError('Failed to fetch doctors. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Initial load (optional, maybe load all doctors)
    useEffect(() => {
        const loadInitial = async () => {
            try {
                const data = await getDoctors();
                setDoctors(data);
            } catch (err) {
                console.error(err);
            }
        };
        loadInitial();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Find the Right Doctor</h2>

            <form onSubmit={handleSearch} className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-slate-400 mb-2 text-sm">Your Symptoms (e.g., fever, chest pain)</label>
                        <input
                            type="text"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Describe what you feel..."
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2 text-sm">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="City or Area"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Analyzing & Searching...' : 'Find Specialists'}
                </button>
            </form>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor._id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
                                <p className="text-blue-400">{doctor.specialty}</p>
                            </div>
                            <div className="bg-slate-900 px-3 py-1 rounded-lg flex items-center space-x-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-white font-bold">{doctor.rating}</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-slate-400 text-sm mb-4">
                            <div className="flex items-center space-x-2">
                                <span>🏥</span>
                                <span>{doctor.hospital}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>📍</span>
                                <span>{doctor.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>📏</span>
                                <span>{doctor.distance} away</span>
                            </div>
                        </div>

                        <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                            Book Appointment
                        </button>
                    </div>
                ))}
            </div>

            {doctors.length === 0 && !loading && (
                <div className="text-center text-slate-500 py-12">
                    <p>No doctors found. Try adjusting your search.</p>
                </div>
            )}
        </div>
    );
};

export default DoctorRecommendation;
