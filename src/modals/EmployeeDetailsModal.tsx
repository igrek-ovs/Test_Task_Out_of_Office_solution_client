import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IEmployee } from '../models/employee';

interface EmployeeDetailsModalProps {
    open: boolean;
    onClose: () => void;
    employee: IEmployee | null;
}

interface Photo {
    data: Uint8Array | string;
    fileName: string;
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({ open, onClose, employee }) => {
    if (!employee) return null;

    const getBase64Image = (bytes: Uint8Array | null, mimeType: string): string | null => {
        if (!bytes) return null;
        const binary = Array.from(bytes).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
        return `data:${mimeType};base64,${window.btoa(binary)}`;
    };

    const determineMimeType = (fileName: string | undefined): string => {
        if (!fileName) {
            return 'application/octet-stream'; // Default MIME type if fileName is undefined
        }
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'png': return 'image/png';
            case 'jpg':
            case 'jpeg': return 'image/jpeg';
            case 'gif': return 'image/gif';
            case 'bmp': return 'image/bmp';
            default: return 'application/octet-stream';
        }
    };


    const getPhotoSrc = (photo: Photo): string | null => {
        if (typeof photo.data === 'string') {
            return photo.data; // Assuming this is a URL
        }
        const mimeType = determineMimeType(photo.fileName);
        return getBase64Image(new Uint8Array(photo.data), mimeType);
    };

    const photo = employee.photo;
    const photoSrc = getPhotoSrc(photo);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                        {employee.fullName}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="body1"><strong>Subdivision:</strong> {employee.subdivision}</Typography>
                <Typography variant="body1"><strong>Position:</strong> {employee.position}</Typography>
                <Typography variant="body1"><strong>Status:</strong> {employee.isActive ? 'Active' : 'Inactive'}</Typography>
                <Typography variant="body1"><strong>Balance:</strong> {employee.outOfOfficeBalance}</Typography>
                {photoSrc && (
                    <Box sx={{ mt: 2 }}>
                        <img src={photoSrc} alt={`${employee.fullName}'s photo`} style={{ width: '100%', borderRadius: '8px' }} />
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default EmployeeDetailsModal;
