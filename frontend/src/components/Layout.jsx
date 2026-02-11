import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-primary selection:text-slate-800">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        <Link
                            to="/"
                            className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                        >
                            Cure Sense AI
                        </Link>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Home
                            </Link>
                            <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Dashboard
                            </Link>

                            {token ? (
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-red-200"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-blue-200"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
                    <p>&copy; 2026 CureSenseAI. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
};

export default Layout;
