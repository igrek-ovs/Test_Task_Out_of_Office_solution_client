import {instance} from "../api";
import {IEmployee} from "../../models/employee";
import {toast} from "react-toastify";
import {IEmployeeFilter} from "../../models/employeeFilter";

export const addEmployee = async (employee: IEmployee) => {
    try {
        const response = await instance.post('/Employee', employee);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const updateEmployee = async (employee: IEmployee) => {
    try {
        const response = await instance.put('/Employee', employee);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const deleteEmployee = async (id: number) => {
    try {
        const response = await instance.delete(`/Employee/${id}`);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const toggleDeactivateEmployee = async (id: number) => {
    try {
        const response = await instance.post(`/Employee/toggle-deactivate/${id}`);
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const getEmployeesByFilter = async (filter: IEmployeeFilter) => {
    try {
        const response = await instance.get('/Employee/', {params: filter});
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const getHrs = async () => {
    try {
        const response = await instance.get('/Employee/get-hrs');
        return response.data;
    }
    catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const getProjectManagers = async() => {
    try {
        const response = await instance.get('Employee/get-project-managers');
        return response.data;
    }
    catch (error:any){
        toast.error(error.response.data.message);
    }
}

export const getUserRole = async(fullName:string, position:string) => {
    try {
        const response = await instance.get(`Employee/get-user-role/`, {params: {fullName, position} });
        return response.data;
    }
    catch (error:any){
        toast.error(error.response.data.message);
    }
}

export const assignEmployeeToProject = async(employeeId:number, projectId:number) => {
    try {
        const response = await instance.post(`Employee/assign-to-project/`, null, {params: {employeeId, projectId}});
        return response.data;
    }
    catch (error:any){
        toast.error(error.response.data.message);
    }
}


export const uploadPhoto = async (employeeId: number, photo: File) => {
    try {
        const formData = new FormData();
        formData.append('photo', photo);

        const response = await instance.post(`Employee/upload-photo/${employeeId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to upload photo');
    }
}