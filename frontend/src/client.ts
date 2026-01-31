import axios from "axios"
import type { Project } from "./types"

export const getUserProjects = async (userName: string): Promise<Project[]> => {
    // const response = await axios.get(`/api/projects/${userName}`);
    // return response.data;
    return [
        { name: "Project A", description: "Description A", id: "1" },
        { name: "Project B", description: "Description B", id: "2" }
    ];
}

export const createProject = async (project: Project): Promise<Project> => {
    // const response = await axios.post(`/api/projects/${userName}`);
    // return response.data;
    return project
}