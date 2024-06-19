import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Modal,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import { IEmployee } from '../models/employee';

interface EditEmployeeModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (employee: IEmployee) => void;
    employee: IEmployee | null;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ open, onClose, onSave, employee }) => {
    const role = localStorage.getItem('role');
    const [formData, setFormData] = useState<IEmployee>({
        id: 0,
        fullName: '',
        subdivision: '',
        position: '',
        isActive: true,
        outOfOfficeBalance: 0,
        peoplePartnerId: 0,
        photo: null,
    });

    useEffect(() => {
        if (employee) {
            setFormData(employee);
        }
    }, [employee]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name as string]: value,
        }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: 400 }}>
                <Typography variant="h6" component="h2">
                    Edit Employee
                </Typography>
                <TextField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Subdivision</InputLabel>
                    <Select
                        name="subdivision"
                        value={formData.subdivision}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Engineering">Engineering</MenuItem>
                        {/* Add more subdivisions as needed */}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Position</InputLabel>
                    <Select
                        name="position"
                        value={formData.position}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="HR Manager">HR Manager</MenuItem>
                        <MenuItem value="Employee">Employee</MenuItem>
                        <MenuItem value="Project Manager">Project Manager</MenuItem>
                    </Select>
                </FormControl>
                {/*<FormControl fullWidth margin="normal">*/}
                {/*    <InputLabel>Status</InputLabel>*/}
                {/*    <Select*/}
                {/*        name="isActive"*/}
                {/*        value={formData.isActive ? 'Active' : 'Inactive'}*/}
                {/*        onChange={handleSelectChange}*/}
                {/*    >*/}
                {/*        <MenuItem value="Active">Active</MenuItem>*/}
                {/*        <MenuItem value="Inactive">Inactive</MenuItem>*/}
                {/*    </Select>*/}
                {/*</FormControl>*/}
                {/*<TextField*/}
                {/*    label="Out of Office Balance"*/}
                {/*    name="outOfOfficeBalance"*/}
                {/*    type="number"*/}
                {/*    value={formData.outOfOfficeBalance}*/}
                {/*    onChange={handleChange}*/}
                {/*    fullWidth*/}
                {/*    margin="normal"*/}
                {/*/>*/}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button onClick={onClose} sx={{ marginRight: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditEmployeeModal;
