import { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/auth/me', { headers: { 'x-auth-token': token } });
            setUser(response.data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-white text-center p-8">Loading profile...</div>;
    }

    if (!user) {
        return <div className="text-red-400 text-center p-8">Failed to load profile. Please login again.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-blue-900/5">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg shadow-blue-500/30">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
                        <p className="text-slate-500">{user.email}</p>
                        <span className="inline-block mt-2 bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full border border-green-100 uppercase tracking-wide">
                            Active Member
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Member Since</h3>
                        <p className="text-slate-800 font-bold text-lg">{new Date(user.date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Account Type</h3>
                        <p className="text-slate-800 font-bold text-lg">Free Plan</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Health Stats</h3>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-600 font-medium">Profile Completion</span>
                            <span className="text-blue-600 font-bold">80%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full shadow-lg shadow-blue-500/20" style={{ width: '80%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
