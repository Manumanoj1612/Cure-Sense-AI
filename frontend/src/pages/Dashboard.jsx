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
        { id: 'profile', name: 'My Profile', icon: '👤', color: 'bg-indigo-100 text-indigo-600' },
        { id: 'symptom-checker', name: 'AI Symptom Checker', icon: '🩺', color: 'bg-blue-100 text-blue-600' },
        { id: 'prescription-reader', name: 'AI Prescription Reader', icon: '📝', color: 'bg-green-100 text-green-600' },
        { id: 'medicine-reminder', name: 'Medicine Reminders', icon: '⏰', color: 'bg-yellow-100 text-yellow-600' },
        { id: 'doctor-recommendation', name: 'Find Doctors', icon: '👨‍⚕️', color: 'bg-purple-100 text-purple-600' },
        { id: 'chatbot', name: 'Health Chatbot', icon: '💬', color: 'bg-pink-100 text-pink-600' },
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
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, User 👋</h1>
                            <p className="text-slate-500">Here's your health overview for today.</p>
                        </header>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transform transition-all hover:shadow-md">
                                <h3 className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-wide">Upcoming Reminders</h3>
                                <div className="flex items-end gap-2">
                                    <p className="text-4xl font-bold text-slate-800">{reminderCount}</p>
                                    <span className="text-sm text-slate-400 mb-1.5">pending</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tools.map((tool) => (
                                <button
                                    key={tool.id}
                                    onClick={() => setActiveTab(tool.id)}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all text-left group"
                                >
                                    <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                        {tool.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                                    <p className="text-slate-400 text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Access this tool <span>→</span>
                                    </p>
                                </button>
                            ))}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-4">Health Tools</h2>
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'overview'
                                ? 'bg-primary/20 text-blue-700 font-medium'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            <span>🏠</span>
                            <span>Overview</span>
                        </button>
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTab(tool.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === tool.id
                                    ? 'bg-primary/20 text-blue-700 font-medium'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
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
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary/50">
                <div className="max-w-5xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
