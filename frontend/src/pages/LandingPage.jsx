import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <div className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-blue-200/40 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-100/50 rounded-full blur-3xl opacity-50"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-800">
                        Your Personal <br />
                        <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                            AI Health Assistant
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                        Understand symptoms, organize medical data, and get instant health insights with the power of AI.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20">
                            Get Started
                        </Link>
                        <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-full font-bold text-lg transition-all border border-slate-200 shadow-sm hover:shadow-md">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: "AI Symptom Checker", desc: "Analyze symptoms and get instant disease predictions with confidence scores.", icon: "🩺", color: "text-blue-500 bg-blue-50" },
                        { title: "Prescription Reader", desc: "Upload handwritten prescriptions and let AI extract medicine details.", icon: "📝", color: "text-green-500 bg-green-50" },
                        { title: "Medicine Reminder", desc: "Never miss a dose with smart automated reminders and tracking.", icon: "⏰", color: "text-yellow-500 bg-yellow-50" },
                        { title: "Doctor Recommendations", desc: "Find the right specialist based on your symptoms and location.", icon: "👨‍⚕️", color: "text-purple-500 bg-purple-50" },
                        { title: "Health Chatbot", desc: "24/7 AI assistant to answer your health queries instantly.", icon: "💬", color: "text-pink-500 bg-pink-50" },
                        { title: "Secure Health Records", desc: "Keep your medical history organized and accessible securely.", icon: "🔒", color: "text-indigo-500 bg-indigo-50" },
                    ].map((feature, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                            <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
