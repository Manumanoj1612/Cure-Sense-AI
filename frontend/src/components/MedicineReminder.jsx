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
            <div className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-blue-900/5">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="text-3xl p-2 bg-yellow-50 rounded-2xl">⏰</span> Medicine Reminders
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/20 hover:scale-105"
                    >
                        {showForm ? 'Cancel' : '+ Add Reminder'}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 animate-fade-in">
                        {/* AI Smart Add */}
                        <div className="mb-6 border-b border-slate-200 pb-6">
                            <h3 className="text-blue-600 font-bold mb-3 flex items-center gap-2">
                                <span>✨</span> AI Smart Add
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g., 'Take Amoxicillin 500mg every night at 8pm'"
                                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-slate-400 shadow-sm"
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
                                <button className="bg-blue-600 px-6 rounded-xl text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                                    {loading ? '...' : 'Parse'}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 ml-1">Type instruction and press Enter</p>
                        </div>

                        <form onSubmit={handleAdd}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Medicine Name"
                                    required
                                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    value={newReminder.medicineName || newReminder.name}
                                    onChange={(e) => setNewReminder({ ...newReminder, medicineName: e.target.value, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Dosage (e.g. 500mg)"
                                    required
                                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    value={newReminder.dosage}
                                    onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                                />
                                <select
                                    required
                                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    value={newReminder.frequency || ''}
                                    onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                                    style={{ backgroundImage: 'none' }} // Remove default arrow if needed or keep default
                                >
                                    <option value="" disabled>Select Frequency</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Twice a day">Twice a day</option>
                                    <option value="Thrice a day">Thrice a day</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="As needed">As needed</option>
                                </select>
                                <input
                                    type="time"
                                    required
                                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    value={newReminder.time}
                                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 hover:scale-[1.01]"
                            >
                                Save Reminder
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {reminders.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 border border-slate-100 border-dashed rounded-2xl">
                            <p className="text-slate-400 font-medium">No reminders set. Add one above!</p>
                        </div>
                    )}
                    {reminders.map((reminder) => (
                        <div key={reminder._id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="bg-blue-50 p-3.5 rounded-xl text-blue-500 group-hover:bg-blue-100 transition-colors">
                                    💊
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{reminder.medicineName || reminder.name}</h3>
                                    <p className="text-slate-500 text-sm font-medium">{reminder.dosage} • {reminder.frequency || (reminder.days && reminder.days.join(', ')) || 'Daily'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-slate-700">{reminder.time}</div>
                                <button
                                    onClick={() => handleDelete(reminder._id)}
                                    className="text-red-400 text-xs hover:text-red-600 mt-1 font-bold uppercase tracking-wider transition-colors"
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
