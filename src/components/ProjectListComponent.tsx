import React, { useState, useEffect } from 'react';
import {
    Box,
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
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button, SelectChangeEvent
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {deleteProject, getProjectsByFilter} from '../store/actions/ProjectActions';
import { IProject } from '../models/project';
import { IProjectFilter } from '../models/projectFilter';
import ProjectModal from "../modals/ProjectModal";

const currentDate = new Date();
const defaultStartDate = new Date(currentDate.setMonth(currentDate.getMonth() - 11));
const defaultEndDate = new Date(currentDate.setMonth(currentDate.getMonth() + 20));

const projectTypes = ['Development', 'Research', 'Marketing', 'Design', 'Consulting'];

const ProjectListComponent: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState<IProject[] | null>(null);
    const [filter, setFilter] = useState<IProjectFilter>({
        sortBy: 'startDate',
        sortAscending: true,
        projectType: '',
        startDateFrom: defaultStartDate,
        startDateTo: defaultEndDate,
        status: true,
        projectNumber: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

    useEffect(() => {
        fetchProjects();
    }, [filter]);

    const fetchProjects = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getProjectsByFilter(filter);
            setProjects(data);
        } catch (error) {
            setError('Failed to fetch projects. Please try again later.');
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchByProjectNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, projectNumber: event.target.value ? Number(event.target.value) : null });
    };

    const handleOpenNewProjectForm = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    };

    const handleOpenEditProjectForm = (project: IProject) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleSaveProject = async (project: IProject) => {
        setIsModalOpen(false);
        fetchProjects();
    };

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFilter({
            ...filter,
            [name]: value
        });
    };

    const handleDeleteProject = async (id: number) => {
        await deleteProject(id);
        fetchProjects();
    }

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Projects
                </Typography>
                <TextField
                    label="Search by project number"
                    onChange={handleSearchByProjectNumber}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <IconButton
                    onClick={handleOpenNewProjectForm}
                    sx={{ ml: 2 }}
                >
                    <AddIcon />
                </IconButton>
                <ProjectModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveProject}
                    project={selectedProject}
                />
            </Toolbar>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Project Type</InputLabel>
                    <Select
                        name="projectType"
                        value={filter.projectType}
                        onChange={handleFilterChange}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {projectTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={filter.status ? 'Active' : 'Inactive'}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value === 'Active' })}
                    >
                        <MenuItem value="All">
                            <em>All</em>
                        </MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Start Date From"
                    type="date"
                    name="startDateFrom"
                    value={filter.startDateFrom.toISOString().split('T')[0]}
                    onChange={(e) => setFilter({ ...filter, startDateFrom: new Date(e.target.value) })}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Start Date To"
                    type="date"
                    name="startDateTo"
                    value={filter.startDateTo.toISOString().split('T')[0]}
                    onChange={(e) => setFilter({ ...filter, startDateTo: new Date(e.target.value) })}
                    InputLabelProps={{ shrink: true }}
                />
                {/*<Button variant="contained" onClick={fetchProjects}>*/}
                {/*    Apply Filters*/}
                {/*</Button>*/}
            </Box>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                </Box>
            ) : projects && projects.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={filter.sortBy === 'projectType'}
                                        direction={filter.sortAscending ? 'asc' : 'desc'}
                                        onClick={() => setFilter({
                                            ...filter,
                                            sortBy: 'projectType',
                                            sortAscending: filter.sortBy === 'projectType' ? !filter.sortAscending : true
                                        })}
                                    >
                                        Project Type
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={filter.sortBy === 'startDate'}
                                        direction={filter.sortAscending ? 'asc' : 'desc'}
                                        onClick={() => setFilter({
                                            ...filter,
                                            sortBy: 'startDate',
                                            sortAscending: filter.sortBy === 'startDate' ? !filter.sortAscending : true
                                        })}
                                    >
                                        Start Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Project Manager</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell>{project.id}</TableCell>
                                    <TableCell>{project.projectType}</TableCell>
                                    <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{project.projectManagerName}</TableCell>
                                    <TableCell>{project.status ? 'Active' : 'Inactive'}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleOpenEditProjectForm(project)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteProject(project.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Typography variant="h6">
                        No projects found.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ProjectListComponent;
