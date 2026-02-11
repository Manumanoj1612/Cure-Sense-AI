import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getDoctors, contactDoctor } from '../services/api';

const Chatbot = ({ doctor, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: doctor ? `Hello! I'm here to help you prepare for your consultation with ${doctor.name}. Describe your symptoms.` : "Hello! I'm MedBuddy. How can I help you with your health today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [showDoctorModal, setShowDoctorModal] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Import api service locally to avoid circular dependencies if any
            const { chatWithBot } = await import('../services/api');
            const data = await chatWithBot(userMsg.text);

            const botMsg = { id: Date.now() + 1, text: data.response, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            const errorMsg = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to my brain right now.", sender: 'bot' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleSummarize = async () => {
        if (messages.length < 2) {
            alert("Please have a conversation first before summarizing.");
            return;
        }

        if (doctor) {
            // If checking specifically with a doctor (via recommendation page), just send to them directly? 
            // Or show modal? Let's stick to the requested "select doctor" flow or use the current one if provided.
            // But the user asked for a "summary button... when click... modal to select doctor".
            // So we will prioritize the modal flow.
        }

        setShowDoctorModal(true);
        try {
            const data = await getDoctors();
            setDoctors(data);
            if (doctor) setSelectedDoctorId(doctor._id); // Pre-select if context exists
        } catch (err) {
            console.error("Failed to fetch doctors", err);
            alert("Failed to load doctor list.");
        }
    };

    const handleSendToDoctor = async () => {
        if (!selectedDoctorId) {
            alert("Please select a doctor.");
            return;
        }

        const selectedDoc = doctors.find(d => d._id === selectedDoctorId) || doctor;
        if (!selectedDoc) return;

        setSendingEmail(true);

        // Simple summary generation
        const summary = messages
            .map(m => `${m.sender.toUpperCase()}: ${m.text}`)
            .join('\n\n');

        try {
            const response = await contactDoctor({
                doctorName: selectedDoc.name,
                doctorEmail: selectedDoc.email,
                patientName: "Current User", // Replace with actual user name if auth exists
                patientContact: "user@example.com", // Replace with actual user email
                summary: summary
            });

            if (response.success) {
                alert(`Summary sent to ${selectedDoc.name}!`);
                setShowDoctorModal(false);
                if (onClose) onClose();
            } else {
                alert('Failed to send summary: ' + response.message);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error sending email. Please try again.');
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto h-[600px] flex flex-col relative bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header is handled by parent when doctor is present, or we can keep it generic */}
            {!doctor && (
                <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-3 shadow-sm z-10">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl">
                        🤖
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800">CureSenseAI Assistant</h2>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                        </p>
                    </div>
                </div>
            )}

            <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm ${msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                            }`}>
                            {msg.sender === 'user' ? (
                                msg.text
                            ) : (
                                <div className="prose prose-sm max-w-none text-slate-700">
                                    <ReactMarkdown
                                        components={{
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mt-2 mb-2 space-y-1" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mt-2 mb-2 space-y-1" {...props} />,
                                            strong: ({ node, ...props }) => <span className="font-bold text-slate-900" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-slate-900 mb-2" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-base font-bold text-slate-900 mb-2" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-slate-900 mb-1" {...props} />,
                                            code: ({ node, ...props }) => <code className="bg-slate-100 rounded px-1 py-0.5 text-sm font-mono text-blue-600" {...props} />
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-4 border-t border-slate-100">
                <form onSubmit={handleSend} className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Type your health question..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-slate-400"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none hover:scale-105"
                    >
                        ➤
                    </button>
                </form>

                <button
                    onClick={handleSummarize}
                    disabled={messages.length < 2}
                    className="w-full mt-2 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-blue-600 font-medium py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    📝 Summarize & Consult Doctor
                </button>
            </div>

            {/* Enhanced Doctor Selection Modal */}
            {showDoctorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">👨‍⚕️</span>
                                    Consult a Specialist
                                </h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    Select a doctor to review your chat summary and provide consultation.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDoctorModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Side: Doctor List */}
                            <div className="w-1/2 border-r border-slate-100 flex flex-col bg-slate-50/50">
                                <div className="p-4 border-b border-slate-100 bg-white">
                                    <input
                                        type="text"
                                        placeholder="Search doctors by name or specialty..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {doctors.filter(d =>
                                        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map(doc => (
                                        <div
                                            key={doc._id}
                                            onClick={() => setSelectedDoctorId(doc._id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 group ${selectedDoctorId === doc._id
                                                ? 'bg-blue-50 border-blue-500 shadow-md shadow-blue-500/5'
                                                : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <img
                                                src={doc.image || "https://via.placeholder.com/150"}
                                                alt={doc.name}
                                                className={`w-14 h-14 rounded-full object-cover border-2 ${selectedDoctorId === doc._id ? 'border-blue-500' : 'border-white shadow-sm'}`}
                                            />
                                            <div className="flex-1">
                                                <h4 className={`font-bold ${selectedDoctorId === doc._id ? 'text-blue-700' : 'text-slate-800'}`}>
                                                    {doc.name}
                                                </h4>
                                                <p className="text-slate-500 text-sm">{doc.specialization}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        🏥 {doc.hospital}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-yellow-500 font-medium">
                                                        ★ {doc.rating}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedDoctorId === doc._id && (
                                                <div className="text-blue-600 bg-blue-100 p-1.5 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {doctors.length === 0 && (
                                        <div className="text-center py-10 text-slate-400">
                                            No doctors found.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Summary Preview */}
                            <div className="w-1/2 flex flex-col bg-white">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/80">
                                    <h4 className="text-slate-700 font-bold flex items-center gap-2">
                                        <span>📝</span> Chat Summary Preview
                                    </h4>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                                    <div className="prose prose-sm max-w-none">
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 text-sm font-mono text-slate-600 whitespace-pre-wrap shadow-sm">
                                            {messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n\n')}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-slate-100 bg-white">
                                    <button
                                        onClick={handleSendToDoctor}
                                        disabled={!selectedDoctorId || sendingEmail}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                    >
                                        {sendingEmail ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending to Doctor...
                                            </>
                                        ) : (
                                            <>
                                                <span>🚀</span> Send Consultation Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
