import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Grid, Avatar } from '@mui/material';

interface RoleNavigatorProps {
    role: string;
}

interface Option {
    label: string;
    path: string;
}

const RoleNavigator: React.FC<RoleNavigatorProps> = ({ role }) => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const options: { [key: string]: Option[] } = {
        'HR Manager': [
            { label: 'Employees', path: '/lists/employees' },
            { label: 'Projects', path: '/lists/projects' },
            { label: 'Leave Requests', path: '/lists/leave-requests' },
            { label: 'Approval Requests', path: '/lists/approval-requests' },
        ],
        'Project Manager': [
            { label: 'Employees', path: '/lists/employees' },
            { label: 'Projects', path: '/lists/projects' },
            { label: 'Leave Requests', path: '/lists/leave-requests' },
            { label: 'Approval Requests', path: '/lists/approval-requests' },
        ],
        Employee: [
            { label: 'My Projects', path: '/lists/projects' },
            { label: 'My Leave Requests', path: '/lists/leave-requests' },
        ],
        Admin: [
            { label: 'Employees', path: '/lists/employees' },
            { label: 'Projects', path: '/lists/projects' },
            { label: 'Leave Requests', path: '/lists/leave-requests' },
            { label: 'Approval Requests', path: '/lists/approval-requests' },
        ],
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {role} Dashboard
            </Typography>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {options[role].map((option) => (
                    <Grid item key={option.label}>
                        <Button onClick={() => handleNavigation(option.path)}>
                            <Avatar>{option.label[0]}</Avatar>
                            <Typography variant="h6">{option.label}</Typography>
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default RoleNavigator;
