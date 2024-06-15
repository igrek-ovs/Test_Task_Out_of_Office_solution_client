import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    SelectChangeEvent
} from '@mui/material';
import { addLeaveRequest } from '../store/actions/LeaveRequestActions';
import { ILeaveRequest } from '../models/leaveRequest';

interface LeaveRequestModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (leaveRequest: ILeaveRequest) => void;
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ open, onClose, onAdd }) => {
    const [leaveRequest, setLeaveRequest] = useState<ILeaveRequest>({
        employeeId: 0, // Идентификатор сотрудника
        absenceReason: '', // Причина отсутствия
        startDate: new Date(), // Дата начала
        endDate: new Date(), // Дата окончания
        comment: '' // Комментарий
    });

    const absenceReasons = ['Vacation', 'Sick leave', 'Personal day', 'Other'];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setLeaveRequest(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setLeaveRequest(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setLeaveRequest(prevState => ({
            ...prevState,
            [field]: new Date(event.target.value)
        }));
    };

    const handleSubmit = async () => {
        try {
            await addLeaveRequest(leaveRequest);
            onAdd(leaveRequest);
            onClose();
        } catch (error) {
            // Handle error
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
                <Typography variant="h5" gutterBottom>Create New Leave Request</Typography>
                <Stack spacing={2}>
                    <TextField name="employeeId" label="Employee ID" value={leaveRequest.employeeId} onChange={handleChange} />
                    <FormControl fullWidth>
                        <InputLabel id="absence-reason-label">Absence Reason</InputLabel>
                        <Select
                            labelId="absence-reason-label"
                            id="absence-reason"
                            name="absenceReason"
                            value={leaveRequest.absenceReason}
                            onChange={handleSelectChange}
                        >
                            {absenceReasons.map(reason => (
                                <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        name="startDate"
                        type="date"
                        label="Start Date"
                        value={leaveRequest.startDate.toISOString().split('T')[0]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(e, 'startDate')}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        name="endDate"
                        type="date"
                        label="End Date"
                        value={leaveRequest.endDate.toISOString().split('T')[0]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(e, 'endDate')}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField name="comment" label="Comment" multiline rows={4} value={leaveRequest.comment} onChange={handleChange} />
                    <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default LeaveRequestModal;
