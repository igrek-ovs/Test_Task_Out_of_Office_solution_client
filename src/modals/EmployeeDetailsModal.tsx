import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IEmployee } from '../models/employee';
import { getPhoto } from '../store/actions/EmployeeActions';
import { toast } from 'react-toastify';

interface EmployeeDetailsModalProps {
    open: boolean;
    onClose: () => void;
    employee: IEmployee | null;
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({ open, onClose, employee }) => {
    const [photoSrc, setPhotoSrc] = useState<string | null>(null);
    const [loadingPhoto, setLoadingPhoto] = useState(false);

    useEffect(() => {
        const fetchPhoto = async () => {
            if (employee?.id) {
                setLoadingPhoto(true);
                try {
                    const photoFile = await getPhoto(employee.id);
                    const photoUrl = URL.createObjectURL(photoFile);
                    setPhotoSrc(photoUrl);
                } catch (error) {
                    toast.error('Failed to load photo');
                } finally {
                    setLoadingPhoto(false);
                }
            }
        };

        if (open) {
            fetchPhoto();
        } else {
            setPhotoSrc(null);
        }

        return () => {
            if (photoSrc) {
                console.log('Revoking URL:', photoSrc);
                URL.revokeObjectURL(photoSrc);
            }
        };
    }, [open, employee]);

    if (!employee) return null;

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
                {loadingPhoto ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    photoSrc && (
                        <Box sx={{ mt: 2 }}>
                            <img src={photoSrc} alt={`${employee.fullName}'s photo`} style={{ width: '100%', borderRadius: '8px' }} />
                        </Box>
                    )
                )}
            </Box>
        </Modal>
    );
};

export default EmployeeDetailsModal;
