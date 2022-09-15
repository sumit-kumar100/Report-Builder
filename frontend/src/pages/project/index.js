import Sidebar from "components/Sidebar";
import Multiselect from 'multiselect-react-dropdown';
import jwt_decode from "jwt-decode";
import Icon from '@material-tailwind/react/Icon';
import axios from 'axios';
import ProjectCard from "components/Project";
import { useState, useEffect } from "react";
import { getData } from '../../store';
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';

const Project = () => {

    const dispatch = useDispatch();

    const { data } = useSelector(state => state.user)

    const [project, setProject] = useState({
        title: '',
        description: '',
        skills: []
    })

    const [show, setShow] = useState(false);

    const [showSidebar, setShowSidebar] = useState('-left-64');

    const handleSubmit = async e => {
        e?.preventDefault();
        try {
            const previous_projects = data?.projects || [];
            const response = await axios.put(`/profile/${data?._id}`,
                {
                    projects: [
                        ...previous_projects,
                        {
                            title: project.title,
                            description: project.description,
                            skills: project.skills,
                        }
                    ]
                }
            )
            if (response?.data?.success) {
                setShow(!show);
                dispatch(getData(data?._id));
                toast.success('Project Added Successfully');
                return;
            }
            toast.error('Fail to Add Project');
        } catch (err) { console.log(err) }
    }


    const handleChange = e => setProject({ ...project, [e.target.name]: e.target.value })

    const handleSkill = item => setProject({ ...project, skills: item })

    useEffect(() => {
        dispatch(getData(jwt_decode(localStorage.getItem('access_token')).profile_id));
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    return <>
        <div className="p-4 md:p-10">
            <Sidebar showSidebar={showSidebar} setShowSidebar={() => setShowSidebar(showSidebar === '-left-64' ? false : '-left-64')} />
            <div className="flex justify-between items-center">
                <div className="w-3/5">
                    <span className="md:hidden cursor-pointer" onClick={() => setShowSidebar(false)}>
                        <Icon name="toc" size="2xl" />
                    </span>
                </div>
                <div>
                    <button
                        onClick={() => setShow(!show)}
                        className="text-white bg-pink-500 border-0 py-2 px-6 w-36 focus:outline-none hover:bg-pink-600 rounded text-xs"
                    >
                        + Add a Project
                    </button>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-xl ml-2 font-semibold text-pink-500 dark:text-white">
                    Projects
                </h3>
                {data?.projects?.map((row, index) => (
                    <div key={index}>
                        <ProjectCard
                            showDelete={true}
                            index={index}
                            title={row?.title || ""}
                            description={row?.description || ""}
                            skills={row?.skills || []}
                        />
                    </div>
                ))}
            </div>
        </div>
        <div className={`${!show ? 'hidden' : null} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center`} style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
            <div className="relative p-6 w-full max-w-2xl h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex justify-between items-center p-6 rounded-t border-b dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Add a New Project
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
                        <div className="px-8 py-5 space-y-2">
                            <div className="relative">
                                <label htmlFor="title" className="leading-7 text-sm text-pink-500">Project Title</label>
                                <input
                                    type="text"
                                    id="text"
                                    name="title"
                                    value={project.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your project title"
                                    className="w-full rounded-tr-full rounded-br-full rounded-bl-full bg-white border border-gray-300 mt-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="descriptio" className="leading-7 text-sm text-pink-600">Message</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={project.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tell us what you do"
                                    className="w-full rounded-tr-lg rounded-br-lg rounded-bl-lg bg-white  border border-gray-300  mt-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 h-32 text-base outline-none text-gray-700 py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                >
                                </textarea>
                            </div>
                            <div className="relative">
                                <span className="leading-7 text-sm text-pink-600">Add Project Skill</span>
                                <Multiselect
                                    required={true}
                                    options={data?.skills}
                                    onSelect={handleSkill}
                                    onRemove={handleSkill}
                                    displayValue="name"
                                    placeholder="Select Skills"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                            <button
                                data-modal-toggle="defaultModal"
                                type="submit"
                                className="text-white bg-pink-500 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                            >
                                Add a Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}
export default Project;