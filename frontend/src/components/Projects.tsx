import { useEffect, useState } from "react"
import type { Project } from "../types"
import { getUserProjects } from "../client"
import { createProject } from "../client"
export const Projects = () => {

    const [myProjects, setMyProjects] = useState<Project[]>([])
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
    const [newProject, setNewProject] = useState<Project>({name: "", description: "", id: ""})

    useEffect(() => {
        getUserProjects("testUser").then(resp => {setMyProjects(resp)})
    }, [])
    
    const onSubmit = () => {
        createProject(newProject).then(resp => {
            setMyProjects([...myProjects, resp])
            setNewProject({name: "", description: "", id: ""})
            setIsFormVisible(false)
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
                    <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold text-center" onClick={onSubmit}>
                        SUBMIT
                    </button>
                </div>
            }
        </div>
    )
}