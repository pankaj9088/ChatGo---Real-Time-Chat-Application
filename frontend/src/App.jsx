import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import MainLayout from './components/Layout/MainLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    return user ? <Navigate to="/" /> : children;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SocketProvider>
                    <Router>
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <Login />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    <PublicRoute>
                                        <Signup />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <MainLayout />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
