import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    InputAdornment,
    TableSortLabel,
    Toolbar,
    Typography,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent, Popover,
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ToggleOn as ToggleOnIcon,
    ToggleOff as ToggleOffIcon,
    PersonAdd as PersonAddIcon,
    PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import {
    getEmployeesByFilter,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleDeactivateEmployee,
    assignEmployeeToProject, uploadPhoto
} from '../store/actions/EmployeeActions';
import { IEmployeeFilter } from '../models/employeeFilter';
import { IEmployee } from '../models/employee';
import { toast } from 'react-toastify';
import AddEmployeeModal from '../modals/AddEmployeeModal';
import EditEmployeeModal from "../modals/EditEmployeeModal";
import EmployeeDetailsModal from "../modals/EmployeeDetailsModal";

const EmployeeListComponent: React.FC = () => {
    const role = localStorage.getItem('role');
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [filter, setFilter] = useState<IEmployeeFilter>({
        sortBy: 'fullName',
        sortAscending: true,
        subdivision: '',
        isActive: undefined,
        outOfOfficeBalanceLeft: 0,
        outOfOfficeBalanceRight: 365,
        searchByName: '',
        position: (role === 'Admin') ? '' : 'Employee'
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [projectId, setProjectId] = useState<number | string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<IEmployee | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);



    const fetchEmployees = async () => {
        try {
            const data = await getEmployeesByFilter(filter);
            setEmployees(data);
        } catch (error) {
            toast.error('Error fetching employees');
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [filter]);


    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, employeeId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedEmployee(employeeId);
    };

    const handleRowClick = (employee: IEmployee) => {
        setSelectedEmployeeDetails(employee);
        setIsDetailsModalOpen(true);
    };


    const handlePhotoChange =async (event: React.ChangeEvent<HTMLInputElement>, employeeId:number) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedPhoto(event.target.files[0]);
            await uploadPhoto(employeeId, event.target.files[0]);
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setSelectedEmployee(null);
    };

    const handleAssignProject = async () => {
        if (selectedEmployee && projectId) {
            await assignEmployeeToProject(selectedEmployee, Number(projectId));
            handlePopoverClose();
        }
    };


    const handleSort = (property: keyof IEmployee) => {
        const isAscending = filter.sortBy === property && filter.sortAscending;
        setFilter((prevFilter) => ({
            ...prevFilter,
            sortBy: property,
            sortAscending: !isAscending
        }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            searchByName: event.target.value
        }));
    };

    const handleSubdivisionChange = (event: SelectChangeEvent<string>) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            subdivision: event.target.value
        }));
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const status = event.target.value;
        const isActive = status === 'All' ? undefined : status === 'Active';
        setFilter((prevFilter) => ({
            ...prevFilter,
            isActive: isActive
        } as IEmployeeFilter));
    };

    const handleBalanceLeftChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            outOfOfficeBalanceLeft: Number(event.target.value)
        }));
    };

    const handleBalanceRightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            outOfOfficeBalanceRight: Number(event.target.value)
        }));
    };

    const handleAddEmployee = async (employee: IEmployee) => {
        try {
            await addEmployee(employee);
            fetchEmployees();
        } catch (error) {
            toast.error('Error adding employee');
        }
    };

    const handleEditEmployee = (employee: IEmployee) => {
        setEditingEmployee(employee);
        setIsEditModalOpen(true);
    };


    const handleSaveEmployee = async (employee: IEmployee) => {
        try {
            await updateEmployee(employee);
            fetchEmployees();
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error('Error updating employee');
        }
    };

    const handleDeleteEmployee = async (id: number) => {
        try {
            await deleteEmployee(id);
            fetchEmployees();
        } catch (error) {
            toast.error('Error deleting employee');
        }
    };

    const handleToggleDeactivateEmployee = async (id: number) => {
        try {
            await toggleDeactivateEmployee(id);
            fetchEmployees();
        } catch (error) {
            toast.error('Error toggling employee status');
        }
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Employee List
                </Typography>
                <TextField
                    label="Search by name"
                    value={filter.searchByName}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                {(role === 'Admin' || role === 'HR Manager') && (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{ ml: 2 }}
                >
                    Add Employee
                </Button>)}
            </Toolbar>
            <Box sx={{ display: 'flex', mb: 2 }}>
                <FormControl sx={{ mr: 2, minWidth: 120 }}>
                    <InputLabel>Subdivision</InputLabel>
                    <Select value={filter.subdivision} onChange={handleSubdivisionChange}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Engineering">Engineering</MenuItem>
                        {/* Add more subdivisions as needed */}
                    </Select>
                </FormControl>
                <FormControl sx={{ mr: 2, minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={filter.isActive === undefined ? 'All' : (filter.isActive ? 'Active' : 'Inactive')} onChange={handleStatusChange}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Balance Left"
                    type="number"
                    value={filter.outOfOfficeBalanceLeft}
                    onChange={handleBalanceLeftChange}
                    sx={{ mr: 2 }}
                />
                <TextField
                    label="Balance Right"
                    type="number"
                    value={filter.outOfOfficeBalanceRight}
                    onChange={handleBalanceRightChange}
                    sx={{ mr: 2 }}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={filter.sortBy === 'fullName'}
                                    direction={filter.sortAscending ? 'asc' : 'desc'}
                                    onClick={() => handleSort('fullName')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={filter.sortBy === 'subdivision'}
                                    direction={filter.sortAscending ? 'asc' : 'desc'}
                                    onClick={() => handleSort('subdivision')}
                                >
                                    Subdivision
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={filter.sortBy === 'position'}
                                    direction={filter.sortAscending ? 'asc' : 'desc'}
                                    onClick={() => handleSort('position')}
                                >
                                    Position
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={filter.sortBy === 'isActive'}
                                    direction={filter.sortAscending ? 'asc' : 'desc'}
                                    onClick={() => handleSort('isActive')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={filter.sortBy === 'outOfOfficeBalance'}
                                    direction={filter.sortAscending ? 'asc' : 'desc'}
                                    onClick={() => handleSort('outOfOfficeBalance')}
                                >
                                    Balance
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id} onClick={(event) => {
                                const target = event.target as HTMLElement;
                                if (!target.closest('button')) {
                                    handleRowClick(employee);
                                }
                            }}>
                                <TableCell>{employee.fullName}</TableCell>
                                <TableCell>{employee.subdivision}</TableCell>
                                <TableCell>{employee.position}</TableCell>
                                <TableCell>{employee.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{employee.outOfOfficeBalance}</TableCell>
                                <TableCell align="center">
                                    {(role === 'Admin' || role === 'HR Manager') && (<Tooltip title="Edit">
                                        <IconButton onClick={() => handleEditEmployee(employee)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>)}
                                    {(role === 'Admin') && (<Tooltip title="Delete">
                                        <IconButton onClick={() => handleDeleteEmployee(employee.id)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>)}
                                    {(role === 'Admin' || role === 'HR Manager') && (<Tooltip title={employee.isActive ? "Deactivate" : "Activate"}>
                                        <IconButton onClick={() => handleToggleDeactivateEmployee(employee.id)}>
                                            {employee.isActive ? <ToggleOffIcon /> : <ToggleOnIcon />}
                                        </IconButton>
                                    </Tooltip>)}
                                    {role === 'Project Manager' && (
                                        <Tooltip title="Assign to Project">
                                            <IconButton onClick={(event) => handlePopoverOpen(event, employee.id)}>
                                                <PersonAddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Upload Photo">
                                        <IconButton component="label">
                                            <PhotoCameraIcon />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(event) => handlePhotoChange(event, employee.id)}
                                            />
                                        </IconButton>
                                    </Tooltip>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    {editingEmployee && (
                        <EditEmployeeModal
                            open={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            onSave={handleSaveEmployee}
                            employee={editingEmployee}
                        />
                    )}
                </Table>
            </TableContainer>
            <AddEmployeeModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddEmployee}
            />
            <EmployeeDetailsModal
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                employee={selectedEmployeeDetails}
            />

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Assign to Project</Typography>
                    <TextField
                        label="Project ID"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        type="number"
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleAssignProject}>Assign</Button>
                </Box>
            </Popover>

        </Box>

    );
};

export default EmployeeListComponent;
