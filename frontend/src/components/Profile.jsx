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
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                        <p className="text-slate-400">{user.email}</p>
                        <span className="inline-block mt-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                            Active Member
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Member Since</h3>
                        <p className="text-white font-medium">{new Date(user.date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Account Type</h3>
                        <p className="text-white font-medium">Free Plan</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">Health Stats</h3>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-300">Profile Completion</span>
                            <span className="text-blue-400 font-bold">80%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
