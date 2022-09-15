import Sidebar from "components/Sidebar";
import jwt_decode from "jwt-decode";
import axios from 'axios';
import Icon from '@material-tailwind/react/Icon';
import SkillCard from "components/Skill";
import { useState, useEffect } from "react";
import { getData } from '../../store';
import { useDispatch, useSelector } from "react-redux";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { skills } from "utilities/list";
import { toast } from 'react-toastify';


const Skills = () => {

    const dispatch = useDispatch()

    const { data } = useSelector(state => state.user)

    const [show, setShow] = useState(false);

    const [skillText, setSkillText] = useState('');

    const [rating, setRating] = useState(0);

    const [isRated, setIsRated] = useState(true);

    const [showSidebar, setShowSidebar] = useState('-left-64');

    const formatResult = item => <span className="text-left py-2 text-xs">{item?.name}</span>;

    const handleOnSelect = item => {
        setSkillText(item?.name);
        setShow(!show);
    }

    const handleRating = star => {
        setIsRated(true);
        setRating(Number(star));
    }

    const handleSubmit = async e => {
        e?.preventDefault();
        try {
            if (!rating) {
                setIsRated(false)
                return;
            };
            const previous_skills = data?.skills || [];
            const response = await axios.put(`/profile/${data?._id}`,
                {
                    skills: [...previous_skills, { name: skillText, rating: rating }]
                }
            )
            if (response?.data?.success) {
                setShow(!show);
                setSkillText('');
                setRating(0);
                dispatch(getData(data?._id))
                toast.success('Skill Added Successfully');
                return;
            }
            toast.error('Fail to Add Skill');
        } catch (err) { console.log(err) }

    }

    useEffect(() => {
        dispatch(getData(jwt_decode(localStorage.getItem('access_token')).profile_id))
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    return <>
        <div className="p-4 md:p-10">
            <Sidebar showSidebar={showSidebar} setShowSidebar={() => setShowSidebar(showSidebar === '-left-64' ? false : '-left-64')} />
            <div className="flex flex-col md:flex-row justify-between  items-start md:items-center">
                <div className="w-full flex justify-between items-center">
                    <span className="md:hidden cursor-pointer" onClick={() => setShowSidebar(false)}>
                        <Icon name="toc" size="2xl" />
                    </span>
                    <div className="w-10/12 md:w-3/5">
                        <ReactSearchAutocomplete
                            items={skills || []}
                            onSelect={handleOnSelect}
                            autoFocus
                            formatResult={formatResult}
                        />
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => setShow(!show)}
                        className="text-white bg-pink-500 border-0 w-32 mt-3 md:mt-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded text-xs"
                    >
                        + Add a Skill
                    </button>
                </div>
            </div>
            <div className="p-0 md:p-4 mt-9">
                <h3 className="text-xl ml-2 font-semibold text-pink-500 dark:text-white">
                    Skills
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    {data?.skills?.map((row, index) => (
                        <div key={index}>
                            <SkillCard
                                index={index}
                                showDelete={true}
                                name={row?.name || ""}
                                rating={row?.rating || 0}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className={`${!show ? 'hidden' : null} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center`} style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
            <div className="relative p-6 w-full max-w-2xl h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex justify-between items-center p-6 rounded-t border-b dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Add a New Skill
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
                    <form onSubmit={handleSubmit}>
                        <div className="px-8 py-5 space-y-8">
                            <div className="relative mb-4">
                                <label htmlFor="email" className="leading-7 text-sm text-pink-500">Skill</label>
                                <input
                                    type="text"
                                    id="text"
                                    name="skillText"
                                    required
                                    value={skillText}
                                    onChange={e => setSkillText(e.target.value)}
                                    placeholder="Enter you mail"
                                    className="w-full rounded-tr-full rounded-br-full rounded-bl-full bg-white border border-gray-300 mt-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                            <div className="relative mb-4">
                                <label htmlFor="email" className="leading-7 text-sm text-pink-500">
                                    How would you rate yourself ?
                                </label>
                                <div className="flex items-center mt-4">
                                    {Array.from('12345').map((star, index) => (
                                        <svg
                                            key={index}
                                            onClick={() => handleRating(star)}
                                            className={`w-5 h-5 mb-3 ${rating >= star ? 'text-pink-500' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <title>Fifth star</title>
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                {!isRated ? (
                                    <span className="leading-7 text-sm text-red-500 font-semibold">
                                        Please select rating.
                                    </span>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-center items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                            <button
                                data-modal-toggle="defaultModal"
                                type="submit"
                                className="text-white bg-pink-500 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                            >
                                Add a Skill
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}
export default Skills;