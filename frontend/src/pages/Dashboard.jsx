import { useState, useEffect } from 'react';
import { getReminders } from '../services/api';
import SymptomChecker from '../components/SymptomChecker';
import PrescriptionReader from '../components/PrescriptionReader';
import MedicineReminder from '../components/MedicineReminder';
import DoctorRecommendation from '../components/DoctorRecommendation';
import Chatbot from '../components/Chatbot';
import Profile from '../components/Profile';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [reminderCount, setReminderCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const reminders = await getReminders();
                setReminderCount(reminders.length);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    const tools = [
        { id: 'profile', name: 'My Profile', icon: '👤', color: 'bg-indigo-500' },
        { id: 'symptom-checker', name: 'Symptom Checker', icon: '🩺', color: 'bg-blue-500' },
        { id: 'prescription-reader', name: 'Prescription Reader', icon: '📝', color: 'bg-green-500' },
        { id: 'medicine-reminder', name: 'Medicine Reminder', icon: '⏰', color: 'bg-yellow-500' },
        { id: 'doctor-recommendation', name: 'Find Doctors', icon: '👨‍⚕️', color: 'bg-purple-500' },
        { id: 'chatbot', name: 'Health Chatbot', icon: '💬', color: 'bg-pink-500' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <Profile />;
            case 'symptom-checker':
                return <SymptomChecker />;
            case 'prescription-reader':
                return <PrescriptionReader />;
            case 'medicine-reminder':
                return <MedicineReminder />;
            case 'doctor-recommendation':
                return <DoctorRecommendation />;
            case 'chatbot':
                return <Chatbot />;
            default:
                return (
                    <>
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, User 👋</h1>
                            <p className="text-slate-400">Here's your health overview for today.</p>
                        </header>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-slate-400 text-sm font-medium mb-2">Upcoming Reminders</h3>
                                <p className="text-3xl font-bold text-white">{reminderCount}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tools.map((tool) => (
                                <button
                                    key={tool.id}
                                    onClick={() => setActiveTab(tool.id)}
                                    className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all hover:bg-slate-750 text-left group"
                                >
                                    <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                        {tool.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                                    <p className="text-slate-400 text-sm">Access this tool →</p>
                                </button>
                            ))}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-4">Health Tools</h2>
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            <span>🏠</span>
                            <span>Overview</span>
                        </button>
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTab(tool.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tool.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                <span>{tool.icon}</span>
                                <span>{tool.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
                <div className="max-w-5xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
