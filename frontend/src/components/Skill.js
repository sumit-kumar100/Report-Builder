import Icon from '@material-tailwind/react/Icon';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { getData } from '../store';
import { toast } from 'react-toastify';


const SkillCard = ({ index, showDelete, name, rating }) => {

    const dispatch = useDispatch()

    const { data } = useSelector(state => state.user)

    const handleDelete = async () => {
        try {
            const response = await axios.put(`/profile/${data?._id}`,
                {
                    skills: data?.skills?.filter((s, i) => i !== index)
                }
            )
            if (response?.data?.success) {
                dispatch(getData(data?._id))
                toast.warning('Skill Deleted Successfully');
                return;
            }
            toast.error('Fail to Delete Skills');
        } catch (err) { toast.error(err?.response?.data?.detail[0]?.msg) }
    }

    return (
        <div className="bg-gray-200 rounded-lg py-2 px-4 flex justify-between items-start md:items-end skill-padding">
            <div className='custom-text'>
                {name}
                <div className="flex items-center mt-3 skill-y-padding">
                    {Array.from('12345').map((star, index) => (
                        <svg
                            key={index}
                            className={`w-5 h-5 mb-3 ${rating >= star ? 'text-pink-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                    ))}
                </div>
            </div>
            {showDelete ? (
                <span className="cursor-pointer" onClick={handleDelete}>
                    <Icon name="delete" color="red" />
                </span>
            ) : null}
        </div>
    )
}

export default SkillCard;