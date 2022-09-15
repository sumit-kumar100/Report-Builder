import Icon from '@material-tailwind/react/Icon';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { getData } from '../store';
import { toast } from 'react-toastify';


const ProjectCard = ({ index, showDelete, title, description, skills }) => {

    const dispatch = useDispatch()

    const { data } = useSelector(state => state.user)

    const handleDelete = async () => {
        try {
            const response = await axios.put(`/profile/${data?._id}`,
                {
                    projects: data?.projects?.filter((p, i) => i !== index)
                }
            )
            if (response?.data?.success) {
                dispatch(getData(data?._id));
                toast.warning('Project Deleted Successfully');
                return;
            }
            toast.error('Fail to Delete Project');
        } catch (err) { toast.error(err?.response?.data?.detail[0]?.msg) }
    }

    return (
        <div className="bg-gray-200 flex justify-between rounded-lg py-2 px-4 my-5 items-end">
            <div className='flex flex-col gap-3'>
                <span className="flex flex-col">
                    <span className='font-semibold custom-text'>{title}</span>
                    <span className='text-xs custom-text'>{description}</span>
                </span>
                <div className="flex gap-3">
                    {skills?.map((skill, index) => (
                        <button key={index} className="bg-transparent text-pink-700 font-semibold p-1 text-xs border border-pink-500 rounded">
                            {skill?.name}
                        </button>
                    ))}
                </div>
            </div>
            {showDelete ? (
                <span className="cursor-pointer" onClick={() => handleDelete()}>
                    <Icon name="delete" color="red" />
                </span>
            ) : null}
        </div>
    )
}

export default ProjectCard;