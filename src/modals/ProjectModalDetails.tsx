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
import { IProject } from '../models/project';

interface ProjectModalProps {
    open: boolean;
    onClose: () => void;
    project: IProject | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ open, onClose, project }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Project Details</DialogTitle>
            <DialogContent>
                {project ? (
                    <Box>
                        <Typography variant="body1">ID: {project.id}</Typography>
                        <Typography variant="body1">Project Type: {project.projectType}</Typography>
                        <Typography variant="body1">Start Date: {new Date(project.startDate).toLocaleDateString()}</Typography>
                        <Typography variant="body1">End Date: {new Date(project.endDate).toLocaleDateString()}</Typography>
                        <Typography variant="body1">Project Manager: {project.projectManagerName}</Typography>
                        <Typography variant="body1">Status: {project.status ? 'Active' : 'Inactive'}</Typography>
                        <Typography variant="body1">Comment: {project.comment}</Typography>
                    </Box>
                ) : (
                    <Typography variant="body1">No project selected.</Typography>
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

export default ProjectModal;
