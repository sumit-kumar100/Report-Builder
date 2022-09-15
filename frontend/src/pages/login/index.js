import axios from 'axios'
import { useState } from "react";
import { NavLink } from 'react-router-dom';

const Login = () => {

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    })

    const [formError, setFormError] = useState(false)

    const handleSubmit = async e => {
        e?.preventDefault();
        try {
            let formData = new FormData();
            formData.append('username', loginForm.username);
            formData.append('password', loginForm.password);

            const response = await axios.post('/login', formData)

            if (response?.data?.access_token && response?.data?.refresh_token) {
                localStorage.setItem('access_token', response?.data?.access_token);
                localStorage.setItem('refresh_token', response?.data?.refresh_token);
                window.location.reload();
                return;
            }
        }
        catch (err) { setFormError(true) }
    }

    const handleChange = e => setLoginForm({ ...loginForm, [e.target.name]: e.target.value })

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input
                                    type="email"
                                    name="username"
                                    id="email"
                                    value={loginForm.username}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@gmail.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={loginForm.password}
                                    onChange={handleChange}
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="text-xs">
                                <div className={`${!formError ? 'hidden' : null} p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800`} role="alert">
                                    User credentials doesn't match
                                </div>
                                <span className="text-gray-500 dark:text-gray-300">
                                    Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters
                                </span>
                            </div>
                            <button type="submit" className="w-full text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">Sign in</button>
                            <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet ?
                                <NavLink
                                    to="/register"
                                    className="font-medium ml-2 text-pink-600 hover:underline dark:text-pink-500"
                                >
                                    Sign up
                                </NavLink>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Login;