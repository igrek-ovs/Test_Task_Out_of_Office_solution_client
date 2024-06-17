import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { IProject } from '../models/project';
import { getProjectManagers } from '../store/actions/EmployeeActions';
import {IEmployee} from "../models/employee";
import {addProject, updateProject} from "../store/actions/ProjectActions";

interface ProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (project: IProject) => void;
    project: IProject | null;
}

const projectTypes = ['Development', 'Research', 'Marketing', 'Design', 'Consulting'];

const ProjectModal: React.FC<ProjectModalProps> = ({ open, onClose, onSave, project }) => {
    const [projectType, setProjectType] = useState<string>(project ? project.projectType : '');
    const [startDate, setStartDate] = useState<Date | null>(project ? new Date(project.startDate) : new Date());
    const [endDate, setEndDate] = useState<Date | null>(project ? new Date(project.endDate) : new Date());
    const [projectManagerId, setProjectManagerId] = useState<number>(project ? project.projectManagerId : 0);
    const [comment, setComment] = useState<string>(project ? project.comment : '');
    const [projectManagers, setProjectManagers] = useState<IEmployee[]>([]);

    useEffect(() => {
        fetchProjectManagers();
    }, []);

    const fetchProjectManagers = async () => {
        const data = await getProjectManagers();
        setProjectManagers(data);
    };

    const saveToDbProject = async (project: IProject) => {
        if(project.id===0){
            await addProject(project);
        }
        else{
            await updateProject(project);
        }
    }

    const handleSave = () => {
        const newProject: IProject = {
            id: project ? project.id : 0,
            projectType,
            startDate: startDate as Date,
            endDate: endDate as Date,
            projectManagerId,
            projectManagerName: projectManagers.find(pm => pm.id === projectManagerId)?.fullName || '',
            comment,
            status: project ? project.status : true
        };

        saveToDbProject(newProject);

        onSave(newProject);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        {project ? 'Update Project' : 'Add Project'}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Project Type</InputLabel>
                    <Select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value as string)}
                    >
                        {projectTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate ? new Date(endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Project Manager</InputLabel>
                    <Select
                        value={projectManagerId}
                        onChange={(e) => setProjectManagerId(e.target.value as number)}
                    >
                        {projectManagers.map((pm) => (
                            <MenuItem key={pm.id} value={pm.id}>
                                {pm.fullName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button onClick={onClose} sx={{ marginRight: 2 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                        {project ? 'Update' : 'Add'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default ProjectModal;
