import {toast} from "react-toastify";
import {instance} from "../api";
import {ILeaveRequestFilter} from "../../models/leaveRequestFilter";
import {ILeaveRequest} from "../../models/leaveRequest";

export const getLeaveRequestsByFilter = async (filter: ILeaveRequestFilter) => {
    try {
        const response = await instance.get('/LeaveRequest/', {params: filter});
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const getLeaveRequestById = async (id: number) => {
    try {
        const response = await instance.get(`/LeaveRequest/${id}`);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const addLeaveRequest = async (leaveRequest: ILeaveRequest) => {
    try {
        const response = await instance.post('/LeaveRequest', leaveRequest);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const updateLeaveRequest = async (id:number, leaveRequest: ILeaveRequest) => {
    try {
        const response = await instance.put(`/LeaveRequest/${id}`, leaveRequest);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const deleteLeaveRequest = async (id: number) => {
    try {
        const response = await instance.delete(`/LeaveRequest/${id}`);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}