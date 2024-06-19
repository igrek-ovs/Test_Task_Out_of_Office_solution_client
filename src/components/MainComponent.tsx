import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Collapse, Grid, TextField, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import {getUserRole} from "../store/actions/EmployeeActions";

interface MainComponentProps {
    setRole: (role: string) => void;
}

const MainComponent: React.FC<MainComponentProps> = ({ setRole }) => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');
    const [showFullNameInput, setShowFullNameInput] = useState(false);
    const [fullName, setFullName] = useState('');

    const handleRoleSelection = (role: string) => {
        setSelectedRole(role);
        setShowFullNameInput(true);
    };

    const handleLogin = async () => {
        if (!fullName || !selectedRole) {
            toast.error('Please enter your full name and select a role.');
            return;
        }

        try {
            const response = await getUserRole(fullName, selectedRole);
            if (response) {
                setRole(selectedRole);
                localStorage.setItem('role', selectedRole);
                localStorage.setItem('fullName', fullName);
                localStorage.setItem('id', response.id);
                navigate('/role-navigator');
            } else {
                toast.error('Invalid user credentials or role.');
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Typography variant="h6">Select Role:</Typography>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => handleRoleSelection('HR Manager')}>
                                <Avatar>H</Avatar>
                                <Typography variant="body2">HR</Typography>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => handleRoleSelection('Project Manager')}>
                                <Avatar>P</Avatar>
                                <Typography variant="body2">Project Manager</Typography>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => handleRoleSelection('Employee')}>
                                <Avatar>E</Avatar>
                                <Typography variant="body2">Employee</Typography>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => handleRoleSelection('Admin')}>
                                <Avatar>A</Avatar>
                                <Typography variant="body2">Admin</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={showFullNameInput}>
                        <TextField
                            id="fullName"
                            label="Full Name"
                            variant="outlined"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" disabled={!fullName || !selectedRole} onClick={handleLogin}>
                        Login
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MainComponent;