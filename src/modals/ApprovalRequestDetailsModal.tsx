import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Button,
    DialogActions
} from '@mui/material';
import { IApprovalRequest } from '../models/approvalRequest';

interface ApprovalRequestDetailsModal {
    open: boolean;
    onClose: () => void;
    request: IApprovalRequest;
}

const ApprovalRequestDetailsModal: React.FC<ApprovalRequestDetailsModal> = ({ open, onClose, request }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Approval Request Details</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1">Leave Request ID: {request.leaveRequestId}</Typography>
                <Typography variant="body1">Approver Name: {request.approverName}</Typography>
                <Typography variant="body1">Leave Request Details: {request.leaveRequestDetails}</Typography>
                <Typography variant="body1">Status: {request.status}</Typography>
                <Typography variant="body1">Comment: {request.comment}</Typography>
                <Typography variant="body1">Employee Name: {request.employeeName}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApprovalRequestDetailsModal;
