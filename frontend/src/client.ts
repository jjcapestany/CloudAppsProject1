import axios from "axios"
import type { Hardware, Project } from "./types"

export const getUserProjects = async (userName: string): Promise<Project[]> => {
    // const response = await axios.get(`/api/projects/${userName}`);
    // return response.data;
    return [
        { name: "Project A", description: "Description A", id: "1" },
        { name: "Project B", description: "Description B", id: "2" }
    ];
}

export const createProject = async (project: Project): Promise<Project> => {
    // const response = await axios.post(`/api/projects/${userName}, project`);
    // return response.data;
    return project
}

export const joinProject = async (projectId: string, userName: string): Promise<Project> => {
    // const response = await axios.post(`/api/projects/join`, { projectId, userName });
    // return response.data;
    return { name: "Joined Project", description: "Joined Description", id: projectId }
}

export const getHardwareResources = async (): Promise<Hardware[]> => {
    // const response = await axios.get(`/api/hardware/${userName}`);
    // return response.data;
    return [
        { set: "HW Set 1", capacity: 10, available: 6, checkedOut: 4 },
        { set: "HW Set 2", capacity: 8, available: 3, checkedOut: 5 }
    ];
}

export const requestHardware = async (requests: { set: string, quantity: number }[]): Promise<void> => {
    // const response = await axios.post(`/api/hardware/request`, { requests });
    // return response.data;
}

export const returnHardware = async (returns: { set: string, quantity: number }[]): Promise<void> => {
    // const response = await axios.post(`/api/hardware/return`, { returns });
    // return response.data;
}