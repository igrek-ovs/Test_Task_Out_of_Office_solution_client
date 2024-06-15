import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Grid, Typography, Button } from '@mui/material';

interface MainComponentProps {
    setRole: (role: string) => void;
}

const MainComponent: React.FC<MainComponentProps> = ({ setRole }) => {
    const navigate = useNavigate();

    const handleRoleSelection = (role: string) => {
        setRole(role);
        navigate('/role-navigator');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid item>
                    <Button onClick={() => handleRoleSelection('HR')}>
                        <Avatar>H</Avatar>
                        <Typography variant="h6">HR</Typography>
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={() => handleRoleSelection('Project Manager')}>
                        <Avatar>P</Avatar>
                        <Typography variant="h6">Project Manager</Typography>
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={() => handleRoleSelection('Employee')}>
                        <Avatar>E</Avatar>
                        <Typography variant="h6">Employee</Typography>
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={() => handleRoleSelection('Admin')}>
                        <Avatar>A</Avatar>
                        <Typography variant="h6">Admin</Typography>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MainComponent;
