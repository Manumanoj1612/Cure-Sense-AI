import { useState, useEffect } from 'react';
import { getDoctors } from '../services/api';


const DoctorRecommendation = () => {
    const [symptoms, setSymptoms] = useState('');
    const [location, setLocation] = useState('');
    const [specialty, setSpecialty] = useState('All');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const specializations = ['All', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Psychiatrist', 'Orthopedic Surgeon', 'General Practitioner'];

    const fetchDoctors = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDoctors(location, specialty, symptoms);
            setDoctors(data);
        } catch (err) {
            setError('Failed to fetch doctors. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDoctors();
    };

    // Initial load
    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleContact = (doctor) => {
        const subject = `Consultation Request: ${symptoms ? symptoms : 'General Inquiry'}`;
        const body = `Hello Dr. ${doctor.name},\n\nI would like to schedule a consultation.\n\nMy Details:\nLocation: ${location}\nSymptoms: ${symptoms}\n\nPlease let me know your availability.\n\nThanks.`;

        window.location.href = `mailto:${doctor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Find the Right Doctor</h2>

            <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl border border-blue-50 mb-10 shadow-xl shadow-blue-500/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 mb-2 text-sm font-medium">Your Symptoms</label>
                        <div className="relative">
                            <select
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none"
                            >
                                <option value="">Select Symptoms</option>
                                <option value="chest pain, heart issue">Chest Pain / Heart Issue</option>
                                <option value="skin rash, acne">Skin Rash / Acne</option>
                                <option value="fever, cold, coughing">Fever / Cold / Cough</option>
                                <option value="headache, migraine">Headache / Migraine</option>
                                <option value="depression, anxiety, mood">Depression / Anxiety</option>
                                <option value="bone pain, joint pain">Joint / Bone Pain</option>
                                <option value="child fever, baby health">Child Health Issue</option>
                                <option value="general checkup">General Checkup</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-2 text-sm font-medium">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="City or Area"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-2 text-sm font-medium">Specialty</label>
                        <div className="relative">
                            <select
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none"
                            >
                                {specializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? 'Searching...' : 'Find Specialists'}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden flex flex-col group">
                        <div className="p-6 flex-1">
                            <div className="flex items-start gap-4 mb-4">
                                <img
                                    src={doctor.image || "https://via.placeholder.com/150"}
                                    alt={doctor.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                                    <p className="text-blue-500 text-sm font-medium">{doctor.specialization}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-slate-500 text-xs font-medium">{doctor.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-slate-500 text-sm">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-slate-400">🏥</span>
                                    <span className="truncate font-medium">{doctor.hospital}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="text-slate-400">📍</span>
                                    <span className="truncate">{doctor.location}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="text-slate-400">🎓</span>
                                    <span>{doctor.experience} years exp.</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                            <button
                                onClick={() => handleContact(doctor)}
                                className="w-full bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-700 hover:text-blue-600 py-2.5 rounded-xl transition-all text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
                            >
                                <span>📧</span> Contact Doctor
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {doctors.length === 0 && !loading && (
                <div className="text-center text-slate-500 py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-lg font-medium">No doctors found matching your criteria.</p>
                    <p className="text-sm text-slate-400 mt-1">Try changing your filters or search terms.</p>
                </div>
            )}


        </div>
    );
};

export default DoctorRecommendation;
