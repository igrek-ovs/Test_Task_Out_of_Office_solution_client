import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { ILeaveRequest } from '../models/leaveRequest';

interface UpdateLeaveRequestModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (updatedRequest: ILeaveRequest) => void;
    request: ILeaveRequest;
}

const UpdateLeaveRequestModal: React.FC<UpdateLeaveRequestModalProps> = ({ open, onClose, onUpdate, request }) => {
    const [startDate, setStartDate] = useState(request.startDate);
    const [endDate, setEndDate] = useState(request.endDate);
    const [absenceReason, setAbsenceReason] = useState(request.absenceReason);

    const handleUpdate = () => {
        const updatedRequest: ILeaveRequest = {
            ...request,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            absenceReason
        };
        onUpdate(updatedRequest);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Leave Request</DialogTitle>
            <DialogContent>
                <TextField
                    label="Employee Name"
                    value={request.employeeName}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    label="Start Date"
                    type="date"
                    value={new Date(startDate).toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={new Date(endDate).toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Absence Reason</InputLabel>
                    <Select
                        value={absenceReason}
                        onChange={(e) => setAbsenceReason(e.target.value)}
                    >
                        <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                        <MenuItem value="Vacation">Vacation</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleUpdate} color="primary">Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateLeaveRequestModal;
