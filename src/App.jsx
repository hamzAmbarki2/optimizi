import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { AnimatePresence } from 'framer-motion';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Restaurants from './pages/Restaurants';
import Users from './pages/Users';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyEmail from './components/auth/VerifyEmail';
import Profile from './pages/profile/Profile';
import AuthBackground from './components/auth/AuthBackground';


// Protected Route Component
function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/signin" />;
}

// Public Route Component (redirect to dashboard if authenticated)
function PublicRoute({ children }) {
    const { currentUser } = useAuth();
    return !currentUser ? children : <Navigate to="/" />;
}

function AppContent() {
    const location = useLocation();
    const authPages = ['/signin', '/signup', '/forgot-password', '/verify-email'];
    const isAuthPage = authPages.includes(location.pathname);

    return (
        <>
            {isAuthPage ? (
                <>
                    <AuthBackground />
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route
                                path="/signin"
                                element={
                                    <PublicRoute>
                                        <SignIn />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    <PublicRoute>
                                        <SignUp />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/forgot-password"
                                element={
                                    <PublicRoute>
                                        <ForgotPassword />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/verify-email"
                                element={
                                    <PublicRoute>
                                        <VerifyEmail />
                                    </PublicRoute>
                                }
                            />
                        </Routes>
                    </AnimatePresence>
                </>
            ) : (
               <ProtectedRoute>
                    <Layout>
                        <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/restaurants" element={<Restaurants />} />
                                <Route path="/users" element={<Users />} />
                                <Route path="/profile" element={<Profile />} />
                                {/* Add the new test route here */}
                            </Routes>
                        </AnimatePresence>
                    </Layout>
                </ProtectedRoute>
            )}
        </>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                autoHideDuration={3000}
            >
                <Router>
                    <AuthProvider>
                        <AppContent />
                    </AuthProvider>
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;