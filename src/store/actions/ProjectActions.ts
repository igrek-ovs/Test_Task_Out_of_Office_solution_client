import {IProjectFilter} from "../../models/projectFilter";
import {instance} from "../api";
import {toast} from "react-toastify";
import {IProject} from "../../models/project";

export const getProjectsByFilter =async(filter:IProjectFilter) => {
    try {
        const response = await instance.get('/Projects/', {params: filter});
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const getProjectById = async (id:number) => {
    try {
        const response = await instance.get(`/Projects/${id}`);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const addProject = async (project:IProject) => {
    try {
        const response = await instance.post('/Projects',project);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const updateProject = async (project:IProject) => {
    try {
        const response = await instance.put(`/Projects/`, project);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const deleteProject = async (id:number) => {
    try {
        const response = await instance.delete(`/Projects/${id}`);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const deactivateProject = async(id:number) => {
    try {
        const response = await instance.patch(`/Projects/${id}/deactivate`);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}