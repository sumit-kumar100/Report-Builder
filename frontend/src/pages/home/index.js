import Sidebar from "components/Sidebar";
import jwt_decode from "jwt-decode";
import axios from 'axios';
import Icon from '@material-tailwind/react/Icon';
import { useDispatch, useSelector } from "react-redux";
import { getData } from '../../store';
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

const Home = () => {

    const dispatch = useDispatch()

    const { email, profile_id } = jwt_decode(localStorage.getItem('access_token'))

    const { data } = useSelector(state => state.user)

    const [show, setShow] = useState(false)

    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        address: '',
        mobile: '',
        about: ''
    })

    const [showSidebar, setShowSidebar] = useState('-left-64');

    const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value })

    const primaryInfoSubmit = async e => {
        e?.preventDefault();
        try {
            const response = await axios.put(`/profile/${data?._id}`,
                {
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    address: profile.address,
                }
            )
            if (response?.data?.success) {
                setShow(!show);
                dispatch(getData(data?._id));
                toast.success('Profile Updated');
                return;
            }
            toast.error('Fail to update Profile');
        } catch (err) { toast.error(err?.response?.data?.detail || err?.response?.data?.detail[0].msg) }
    }

    const secondaryInfoSubmit = async e => {
        e?.preventDefault();
        try {
            const response = await axios.put(`/profile/${data?._id}`,
                {
                    mobile: profile.mobile,
                    about: profile.about
                }
            )
            if (response?.data?.success) {
                dispatch(getData(data?._id));
                toast.success('Profile Updated');
                return;
            }
            toast.error('Fail to update Profile');
        } catch (err) { toast.error(err?.response?.data?.detail[0]?.msg) }
    }

    const fetchData = async () => {
        const { payload } = await dispatch(getData(profile_id));
        if (payload?.status === 200) setProfile({ ...profile, ...payload.data });
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    return <>
        <div className="p-4 md:p-10">
            <Sidebar showSidebar={showSidebar} setShowSidebar={() => setShowSidebar(showSidebar === '-left-64' ? false : '-left-64')} />
            <div className="flex justify-between items-center">
                <div className="flex gap-5 items-center">
                    <span className="md:hidden cursor-pointer" onClick={() => setShowSidebar(false)}>
                        <Icon name="toc" size="2xl" />
                    </span>
                    <div className="bg-pink-500 py-5 px-6 text-white rounded-full">
                        {data?.first_name ? data?.first_name[0].toUpperCase() + data?.last_name[0].toUpperCase() : '@'}
                    </div>
                    <div>
                        <span className="font-bold tracking-wide">
                            {data?.first_name ? `${data?.first_name} ${data?.last_name}` : email}
                        </span>
                        <br />
                        <span className="text-xs text-pink-500">{data?.address ? data.address : ""}</span>
                    </div>
                </div>
                <div className="cursor-pointer" onClick={() => setShow(!show)}>
                    <Icon name="edit" size="2xl" color="pink" />
                </div>
            </div>
            <form onSubmit={secondaryInfoSubmit} className="w-full md:w-3/5 mt-10">
                <div className="relative mb-4">
                    <label htmlFor="email" className="leading-7 text-sm text-pink-500">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email || ""}
                        name="email"
                        disabled
                        placeholder="Enter you mail"
                        className="w-full rounded-tr-full rounded-br-full rounded-bl-full bg-white border border-gray-300 mt-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
                <div className="relative mb-4">
                    <label htmlFor="mobile" className="leading-7 text-sm text-pink-500">Contact</label>
                    <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        minLength="10"
                        maxLength="10"
                        value={profile?.mobile || ""}
                        required
                        onChange={handleChange}
                        placeholder="Enter your contact number"
                        className="w-full rounded-tr-full rounded-br-full rounded-bl-full bg-white border border-gray-300 mt-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
                <div className="relative mb-4">
                    <label htmlFor="about" className="leading-7 text-sm text-pink-600">Message</label>
                    <textarea
                        id="about"
                        name="about"
                        value={profile?.about || ""}
                        required
                        onChange={handleChange}
                        placeholder="Tell us what you do"
                        className="w-full rounded-tr-lg rounded-br-lg rounded-bl-lg bg-white  border border-gray-300  mt-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 h-32 text-base outline-none text-gray-700 py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    >
                    </textarea>
                </div>
                <button className="text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded text-md">
                    SUBMIT
                </button>
            </form>
        </div>
        <div className={`${!show ? 'hidden' : null} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center`} style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
            <div className="relative p-6 w-full max-w-2xl h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex justify-between items-center p-6 rounded-t border-b dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Enter Details
                        </h3>
                        <button
                            onClick={() => setShow(!show)}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal"
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                            <span className="sr-only">
                                Close modal
                            </span>
                        </button>
                    </div>
                    <form onSubmit={primaryInfoSubmit}>
                        <div className="px-8 py-5 space-y-8">
                            <div className="relative mb-4">
                                <label htmlFor="first_name" className="leading-7 text-sm text-pink-500">First Name</label>
                                <input
                                    type="text"
                                    id="text"
                                    name="first_name"
                                    required
                                    value={profile?.first_name || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your first name"
                                    className="w-full rounded-tr-full rounded-br-full rounded-bl-full bg-white border border-gray-300 mt-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>

                            <div className="relative mb-4">
                                <label htmlFor="last_name" className="leading-7 text-sm text-pink-500">Last Name</label>
                                <input
                                    type="text"
                                    id="text"
                                    name="last_name"
                                    required
                                    value={profile?.last_name || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your last name"
                                    className="w-full rounded-tr-full rounded-br-full rounded-bl-full bg-white border border-gray-300 mt-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>

                            <div className="relative mb-4">
                                <label htmlFor="address" className="leading-7 text-sm text-pink-500">Address</label>
                                <input
                                    type="text"
                                    id="text"
                                    name="address"
                                    required
                                    value={profile?.address || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    className="w-full rounded-tr-full rounded-br-full rounded-bl-full bg-white border border-gray-300 mt-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>

                        </div>
                        <div className="flex justify-center items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                            <button
                                data-modal-toggle="defaultModal"
                                type="submit"
                                className="text-white bg-pink-500 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                            >
                                SUBMIT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}
export default Home;