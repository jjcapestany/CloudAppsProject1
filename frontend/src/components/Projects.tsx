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

    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!message && !error) return;
        const timer = setTimeout(() => {
            setMessage("");
            setError("");
        }, 5000);
        return () => clearTimeout(timer);
    }, [message, error]);

    useEffect(() => {
        getUserProjects()
        .then(resp => {setMyProjects(resp)})
        .catch(() => setError("Failed to load projects"))
    }, [])
    
    const onCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setIsSubmitting(true)

        try {

            const resp = await createProject(newProject)
            setMyProjects([...myProjects, resp])
            setNewProject({name: "", description: "", id: ""})
            setIsFormVisible(false)
            setMessage("Project created successfully")
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Failed to create project')
        } finally {
            setIsSubmitting(false)
        }
    }

    const onJoinSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setIsSubmitting(true)

        try {
            const resp = await joinProject(joinProjectId)
            setMyProjects([...myProjects, resp])
            setJoinProjectId("")
            setIsJoinVisible(false)
            setMessage("Joined project successfully")
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Failed to join project')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="grow bg-[#333f48] text-white p-4 gap-4 items-center flex flex-col">

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {message}
                </div>
            )}

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