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