import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import { IEmployee } from '../models/employee';
import {addEmployee, getHrs} from '../store/actions/EmployeeActions';
import {toast} from "react-toastify";


const positions = ['Employee', 'HR Manager', 'Project Manager', 'Admin'];
interface AddEmployeeModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (employee: IEmployee) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose, onAdd }) => {
    const [employee, setEmployee] = useState<IEmployee>({
        id: 0,
        fullName: '',
        subdivision: '',
        position: '',
        peoplePartnerId: 0, // Change to number
        photo: null,
        outOfOfficeBalance: 0,
        isActive: true,
    });
    const [hrs, setHrs] = useState<IEmployee[]>([]);

    useEffect(() => {
        fetchHrs();
    }, []);

    const fetchHrs = async () => {
        try {
            const data = await getHrs();
            setHrs(data);
        } catch (error) {
            toast.error('Error fetching HRs');
        }
    };

    const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]: value
        }));
    };

    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name as string]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            await addEmployee(employee); // Отправка данных о сотруднике на сервер
            toast.success('Employee added successfully');
            onClose();
        } catch (error) {
            toast.error('Error adding employee');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill out the following details to add a new employee.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Full Name"
                    name="fullName"
                    fullWidth
                    value={employee.fullName}
                    onChange={handleChangeTextField}
                />
                <TextField
                    margin="dense"
                    label="Position"
                    name="position"
                    fullWidth
                    select // Добавим атрибут select для использования как выпадающий список
                    value={employee.position}
                    onChange={handleChangeTextField} // Изменение будет обработано в функции handleChangeTextField
                >
                    {positions.map((position) => (
                        <MenuItem key={position} value={position}>
                            {position}
                        </MenuItem>
                    ))}
                </TextField>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Subdivision</InputLabel>
                    <Select
                        name="subdivision"
                        value={employee.subdivision}
                        onChange={handleChangeSelect}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Engineering">Engineering</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel>People Partner</InputLabel>
                    <Select
                        name="peoplePartnerId"
                        value={employee.peoplePartnerId.toString()}
                        onChange={handleChangeSelect}
                    >
                        {hrs.map((employee: IEmployee) => (
                            <MenuItem key={employee.id} value={employee.id.toString()}>
                                {employee.fullName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    label="Out Of Office Balance"
                    name="outOfOfficeBalance"
                    type="number"
                    fullWidth
                    value={employee.outOfOfficeBalance}
                    onChange={handleChangeTextField}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEmployeeModal;
