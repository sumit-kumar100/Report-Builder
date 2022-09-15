import ProtectedRoute from 'utilities/protectedRoutes';
import IsAuthenticated from 'utilities/is_authenticated';
import Home from './pages/home';
import Skills from 'pages/skills';
import Project from 'pages/project';
import Report from 'pages/report';
import Login from 'pages/login';
import Register from 'pages/register';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'assets/styles/tailwind.css';


function App() {

    const { pathname } = useLocation()

    return (
        <>
            <ToastContainer />
            <div className={pathname !== '/login' && pathname !== '/register' ? "md:ml-64" : null}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/skills"
                        element={
                            <ProtectedRoute>
                                <Skills />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <Project />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report"
                        element={
                            <ProtectedRoute>
                                <Report />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <IsAuthenticated>
                                <Login />
                            </IsAuthenticated >
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <IsAuthenticated>
                                <Register />
                            </IsAuthenticated >
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
