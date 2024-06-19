import {IApprovalRequestFilter} from "../../models/approvalRequestFilter";
import {instance} from "../api";
import {toast} from "react-toastify";

export const getApprovalRequestsByFilter = async (filter:IApprovalRequestFilter)=>{
    try {
        const response = await instance.get('/ApprovalRequest/',{params:filter});
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const getApprovalRequestById = async (id:number)=>{
    try {
        const response = await instance.get(`/ApprovalRequest/${id}`);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const approveRequest = async (id:number)=>{
    try {
        const response = await instance.post(`/ApprovalRequest/approve/${id}`);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const rejectRequest = async (id: number, comment: string) => {
    try {
        const response = await instance.post(`/ApprovalRequest/reject/${id}`, comment, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message);
    }
};