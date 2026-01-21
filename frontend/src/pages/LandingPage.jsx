import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <div className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-blue-600/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/20 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Your Personal <br />
                        <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                            AI Health Assistant
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-slate-300 max-w-3xl mx-auto mb-10">
                        Understand symptoms, organize medical data, and get instant health insights with the power of AI.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30">
                            Get Started
                        </Link>
                        <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-lg transition-all border border-slate-700">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: "AI Symptom Checker", desc: "Analyze symptoms and get instant disease predictions with confidence scores.", icon: "🩺" },
                        { title: "Prescription Reader", desc: "Upload handwritten prescriptions and let AI extract medicine details.", icon: "📝" },
                        { title: "Medicine Reminder", desc: "Never miss a dose with smart automated reminders and tracking.", icon: "⏰" },
                        { title: "Doctor Recommendations", desc: "Find the right specialist based on your symptoms and location.", icon: "👨‍⚕️" },
                        { title: "Health Chatbot", desc: "24/7 AI assistant to answer your health queries instantly.", icon: "💬" },
                        { title: "Secure Health Records", desc: "Keep your medical history organized and accessible securely.", icon: "🔒" },
                    ].map((feature, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all hover:bg-slate-800 group">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                            <p className="text-slate-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
