import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Register = () => {

    let navigate = useNavigate();

    const [registerForm, setRegisterForm] = useState({
        email: "",
        password1: "",
        password2: ""
    });

    const [formError, setFormError] = useState({
        registrationFail: false,
        passwordFail: false
    });


    const [pending, setPending] = useState(false)


    const handleSubmit = async e => {
        e?.preventDefault()
        setPending(true)
        try {
            const { email, password1, password2 } = registerForm
            if (password1 !== password2) {
                setFormError({ ...formError, passwordFail: true });
                setPending(false)
                return;
            }
            const response = await axios.post('/register',
                {
                    email: email,
                    password: password1
                }
            )
            if (response?.data?.success) {
                navigate("/login", { replace: true });
                setPending(false)
                return;
            }
            setFormError({ ...formError, registrationFail: true });
        } catch (err) {
            toast.error(err?.response?.data?.detail || err?.response?.data?.detail[0].msg);
        }
        setPending(false)
    }

    const handleChange = e => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            SIGN UP
                        </h1>
                        <div className={`${!formError.registrationFail ? 'hidden' : null} p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800`} role="alert">
                            Sorry, Registration Failed !!
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={registerForm.email}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@gmail.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    type="password"
                                    name="password1"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    id="password1"
                                    value={registerForm.password1}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                <input
                                    type="password"
                                    name="password2"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    id="password2"
                                    value={registerForm.password2}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="text-xs">
                                <div className={`${!formError.passwordFail ? 'hidden' : null} p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800`} role="alert">
                                    Retype Password Doesn't match
                                </div>
                                <span className="text-gray-500 dark:text-gray-300">
                                    Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters
                                </span>
                            </div>
                            <button type="submit" disabled={pending} className={`w-full text-white ${!pending ? "bg-pink-600" : "bg-pink-300"} ${!pending ? "hover:bg-pink-700" : null} focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800`}>Register</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                Already have an account yet ?
                                <NavLink
                                    to="/login"
                                    className="font-medium ml-2 text-pink-600 hover:underline dark:text-pink-500"
                                >
                                    Login
                                </NavLink>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register;