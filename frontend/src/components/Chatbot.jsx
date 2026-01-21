import { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm MedBuddy. How can I help you with your health today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
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

    return (
        <div className="max-w-2xl mx-auto h-[600px] flex flex-col">
            <div className="bg-slate-800 rounded-t-xl p-4 border-b border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl">
                    🤖
                </div>
                <div>
                    <h2 className="font-bold text-white">MedBuddy Assistant</h2>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-slate-900 p-4 overflow-y-auto space-y-4 border-x border-slate-700">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="bg-slate-800 p-4 rounded-b-xl border-t border-slate-700 flex gap-2">
                <input
                    type="text"
                    placeholder="Type your health question..."
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                    ➤
                </button>
            </form>
        </div>
    );
};

export default Chatbot;
