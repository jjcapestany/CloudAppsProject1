import { useEffect, useState } from "react"
import type { Project } from "../types"
import { getUserProjects, joinProject } from "../client"
import { createProject } from "../client"
export const Projects = () => {

    const [myProjects, setMyProjects] = useState<Project[]>([])
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
    const [isJoinVisible, setIsJoinVisible] = useState<boolean>(false)
    const [joinProjectId, setJoinProjectId] = useState<string>("")
    const [newProject, setNewProject] = useState<Project>({name: "", description: "", id: ""})

    useEffect(() => {
        getUserProjects("testUser").then(resp => {setMyProjects(resp)})
    }, [])
    
    const onCreateSubmit = () => {
        createProject(newProject).then(resp => {
            setMyProjects([...myProjects, resp])
            setNewProject({name: "", description: "", id: ""})
            setIsFormVisible(false)
        })
    }

    const onJoinSubmit = () => {
        joinProject(joinProjectId, "testUser").then(resp => {
            setMyProjects([...myProjects, resp])
            setJoinProjectId("")
            setIsJoinVisible(false)
        })
    }

    return (
        <div className="grow bg-[#333f48] text-white p-4 gap-4 items-center flex flex-col">
            <div className="flex flex-col text-center gap-4">
                <span className="text-xl font-bold">My Projects</span>
                {myProjects.map(p => <span key={p.id}>({p.id}) {p.name}: {p.description}</span>)}
            </div>
            <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold" onClick={() => setIsFormVisible(!isFormVisible)}>
                CREATE PROJECT
            </button>
            {isFormVisible &&
                <div className="flex flex-col gap-4 bg-white  text-black p-4 rounded">
                    <input className="border border-black p-2 rounded" placeholder="Project Name" onChange={(e) => setNewProject({...newProject, name: e.target.value})}/>
                    <input className="border border-black p-2 rounded" placeholder="Project Description" onChange={(e) => setNewProject({...newProject, description: e.target.value})}/>
                    <input className="border border-black p-2 rounded" placeholder="Project ID" onChange={(e) => setNewProject({...newProject, id: e.target.value})}/>
                    <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold text-center mx-auto" onClick={onCreateSubmit}>
                        SUBMIT
                    </button>
                </div>
            }
            <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold" onClick={() => setIsJoinVisible(!isJoinVisible)}>
                JOIN PROJECT
            </button>
            {isJoinVisible &&
                <div className="flex flex-col gap-4 bg-white  text-black p-4 rounded">
                    <input className="border border-black p-2 rounded" placeholder="Project ID" onChange={(e) => setJoinProjectId(e.target.value)}/>
                    <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold text-center mx-auto" onClick={onJoinSubmit}>
                        SUBMIT
                    </button>
                </div>
            }
        </div>
    )
}