import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import { ILeaveRequest } from '../models/leaveRequest';

interface LeaveRequestDetailsModalProps {
    open: boolean;
    onClose: () => void;
    request: ILeaveRequest | null;
}

const LeaveRequestDetailsModal: React.FC<LeaveRequestDetailsModalProps> = ({ open, onClose, request }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogContent>
                {request ? (
                    <Box>
                        <Typography variant="body1">ID: {request.id}</Typography>
                        <Typography variant="body1">Employee Name: {request.employeeName}</Typography>
                        <Typography variant="body1">Start Date: {new Date(request.startDate).toLocaleDateString()}</Typography>
                        <Typography variant="body1">End Date: {new Date(request.endDate).toLocaleDateString()}</Typography>
                        <Typography variant="body1">Absence Reason: {request.absenceReason}</Typography>
                        <Typography variant="body1">Status: {request.status}</Typography>
                        {request.comment && <Typography variant="body1">Comment: {request.comment}</Typography>}
                    </Box>
                ) : (
                    <Typography variant="body1">No leave request selected.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LeaveRequestDetailsModal;
