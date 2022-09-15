import Icon from '@material-tailwind/react/Icon';
import Sidebar from "components/Sidebar";
import jwt_decode from "jwt-decode";
import SkillCard from "components/Skill";
import ProjectCard from "components/Project";
import { useEffect, useRef, useState } from "react";
import { getData } from '../../store';
import { useDispatch, useSelector } from "react-redux";
import { PDFExport } from '@progress/kendo-react-pdf';
import '@progress/kendo-theme-default/dist/all.css';

const Report = () => {

    const dispatch = useDispatch()

    const { data } = useSelector(state => state.user)

    const [showSidebar, setShowSidebar] = useState('-left-64');

    const { email } = jwt_decode(localStorage.getItem('access_token'))

    const pdfExportComponent = useRef(null);

    const exportPDFWithComponent = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };

    useEffect(() => {
        dispatch(getData(jwt_decode(localStorage.getItem('access_token')).profile_id));
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    return <>
        <Sidebar showSidebar={showSidebar} setShowSidebar={() => setShowSidebar(showSidebar === '-left-64' ? false : '-left-64')} />
        <div className="flex justify-between items-center p-4 md:p-10 md:pb-0">
            <div className='flex gap-2'>
                <span className="md:hidden cursor-pointer" onClick={() => setShowSidebar(false)}>
                    <Icon name="toc" size="2xl" />
                </span>
                <h1 className="text-md md:text-xl ml-2 font-semibold dark:text-white">
                    My Report
                </h1>
            </div>
            <div className="flex gap-3">
                <button
                    disabled
                    className="text-white flex items-center gap-2 bg-pink-300 border-0 py-2 px-6 focus:outline-none rounded text-xs"
                >
                    <Icon name="share" />
                    Share
                </button>
                <button
                    type='primary'
                    onClick={exportPDFWithComponent}
                    className="text-white flex items-center gap-2 bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded text-xs"
                >
                    <Icon name="download" />
                    Download
                </button>
            </div>
        </div>
        <PDFExport ref={pdfExportComponent} paperSize="A4">
            <section className="p-4 md:p-10" id="shareReport">
                <div>
                    <div className="flex p-4 justify-between items-center custom-header">
                        <div className="flex gap-5 items-center">
                            <div className="bg-pink-500 py-5 px-6 text-white rounded-full about-me-text">
                                {data?.first_name ? data.first_name[0].toUpperCase() + data.last_name[0].toUpperCase() : '@'}
                            </div>
                            <div>
                                <span className="font-bold tracking-wide about-me-text">
                                    {data?.first_name ? `${data.first_name} ${data.last_name}` : email}
                                </span>
                                <br />
                                <span className="text-xs text-pink-500 about-me-text">{data?.address ? data.address : ""}</span>
                            </div>
                        </div>
                        <div className="text-pink-500 mr-4 about-me-text">
                            +91 {data?.mobile}
                        </div>
                    </div>
                    <div className="p-4 about-me">
                        <h3 className="text-xl ml-2 font-semibold text-pink-500 dark:text-white about-me-text">
                            About Me
                        </h3>
                        <div className="bg-gray-200 rounded-lg py-2 px-4 my-3 h-32 custom-text skill-me custom-height">
                            {data?.about}
                        </div>
                    </div>
                    <div className="p-4 about-me">
                        <h3 className="text-xl ml-2 font-semibold text-pink-500 dark:text-white about-me-text">
                            Skills
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {data?.skills?.map((row, index) => (
                                <div key={index}>
                                    <SkillCard
                                        index={index}
                                        showDelete={false}
                                        name={row?.name || ""}
                                        rating={row?.rating || 0}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 project-heading">
                        <h3 className="text-xl ml-2 font-semibold text-pink-500 dark:text-white about-me-text">
                            Projects
                        </h3>
                        {data?.projects?.map((row, index) => (
                            <div key={index}>
                                <ProjectCard
                                    showDelete={false}
                                    index={index}
                                    title={row?.title || ""}
                                    description={row?.description || ""}
                                    skills={row?.skills || []}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PDFExport>
    </>
}

export default Report;