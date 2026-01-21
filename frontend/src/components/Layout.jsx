import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
            <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                                Cure Sense AI
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                                <Link to="/dashboard" className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                                {token ? (
                                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                        Logout
                                    </button>
                                ) : (
                                    <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-16">
                {children}
            </main>

            <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
                    <p>&copy; 2024 MedBuddy AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
