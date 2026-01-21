import { useState, useEffect } from 'react';
import { getReminders, addReminder, deleteReminder } from '../services/api';

const MedicineReminder = () => {
    const [reminders, setReminders] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newReminder, setNewReminder] = useState({ name: '', dosage: '', time: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const data = await getReminders();
            setReminders(data);
        } catch (err) {
            console.error('Failed to fetch reminders', err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addReminder(newReminder);
            setShowForm(false);
            setNewReminder({ name: '', dosage: '', time: '' });
            fetchReminders();
        } catch (err) {
            console.error('Failed to add reminder', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteReminder(id);
            fetchReminders();
        } catch (err) {
            console.error('Failed to delete reminder', err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-3xl">⏰</span> Medicine Reminders
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        {showForm ? 'Cancel' : '+ Add Reminder'}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-8 bg-slate-900 p-4 rounded-lg border border-slate-700 animate-fade-in">
                        {/* AI Smart Add */}
                        <div className="mb-6 border-b border-slate-700 pb-6">
                            <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                <span>✨</span> AI Smart Add
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g., 'Take Amoxicillin 500mg every night at 8pm'"
                                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setLoading(true);
                                            try {
                                                const { parseReminder } = await import('../services/api');
                                                const result = await parseReminder(e.target.value);
                                                setNewReminder({
                                                    name: 'Medicine', // AI could extract this too if improved
                                                    dosage: result.parsed_dosage,
                                                    time: result.parsed_time
                                                });
                                            } catch (err) {
                                                console.error(err);
                                            } finally {
                                                setLoading(false);
                                            }
                                        }
                                    }}
                                />
                                <button className="bg-blue-600 px-4 rounded text-white font-bold">
                                    {loading ? '...' : 'Parse'}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Type instruction and press Enter</p>
                        </div>

                        <form onSubmit={handleAdd}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Medicine Name"
                                    required
                                    className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={newReminder.name}
                                    onChange={(e) => setNewReminder({ ...newReminder, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Dosage (e.g. 500mg)"
                                    required
                                    className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={newReminder.dosage}
                                    onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                                />
                                <input
                                    type="time"
                                    required
                                    className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={newReminder.time}
                                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition-colors"
                            >
                                Save Reminder
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {reminders.length === 0 && (
                        <p className="text-slate-400 text-center py-4">No reminders set. Add one above!</p>
                    )}
                    {reminders.map((reminder) => (
                        <div key={reminder._id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">
                                    💊
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{reminder.name}</h3>
                                    <p className="text-slate-400 text-sm">{reminder.dosage} • {reminder.days.join(', ')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">{reminder.time}</div>
                                <button
                                    onClick={() => handleDelete(reminder._id)}
                                    className="text-red-400 text-xs hover:text-red-300 mt-1"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MedicineReminder;
