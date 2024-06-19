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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Done as DoneIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import {
    getLeaveRequestsByFilter,
    submitLeaveRequest,
    cancelLeaveRequest,
    updateLeaveRequest
} from '../store/actions/LeaveRequestActions';
import { ILeaveRequest } from '../models/leaveRequest';
import { ILeaveRequestFilter } from '../models/leaveRequestFilter';
import LeaveRequestModal from "../modals/AddLeaveRequestModal";
import { SelectChangeEvent } from '@mui/material/Select';
import UpdateLeaveRequestModal from "../modals/UpdateLeaveRequestModal";
import LeaveRequestDetailsModal from "../modals/LeaveRequestDetailsModal";

const currentDate = new Date();
const defaultStartDate = new Date(currentDate.setMonth(currentDate.getMonth() - 11));
const defaultEndDate = new Date(currentDate.setMonth(currentDate.getMonth() + 20));

const LeaveRequestListComponent: React.FC = () => {
    const role = localStorage.getItem('role');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
    const [filter, setFilter] = useState<ILeaveRequestFilter>({
        sortBy: 'startdate',
        sortAscending: true,
        absenceReason: '',
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        status: '',
        requestNumber: null,
        employeeId: role==='Employee' ? parseInt(localStorage.getItem('id')!) : null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ILeaveRequest | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedRequestDetails, setSelectedRequestDetails] = useState<ILeaveRequest | null>(null);

    useEffect(() => {
        fetchLeaveRequests();
    }, [filter]);

    const fetchLeaveRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getLeaveRequestsByFilter(filter);
            setLeaveRequests(data);
        } catch (error) {
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenRequestDetailsModal = (request: ILeaveRequest) => {
        setSelectedRequestDetails(request);
        setIsDetailsModalOpen(true);
    };

    const handleSearchByRequestNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, requestNumber: event.target.value ? parseInt(event.target.value) : null });
    };

    const handleSortRequest = (property: keyof ILeaveRequest) => {
        const isAscending = filter.sortBy === property && filter.sortAscending;
        setFilter({ ...filter, sortBy: property, sortAscending: !isAscending });
    };

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        const name = event.target.name as keyof typeof filter;
        setFilter({ ...filter, [name]: event.target.value });
    };

    const handleSubmitRequest = async (id: number) => {
        await submitLeaveRequest(id);
        fetchLeaveRequests();
    };

    const handleCancelRequest = async (id: number) => {
        await cancelLeaveRequest(id);
        fetchLeaveRequests();
    };

    const handleUpdateRequest = (request: ILeaveRequest) => {
        setSelectedRequest(request);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateLeaveRequest = async (updatedRequest: ILeaveRequest) => {
        await updateLeaveRequest(updatedRequest);
        fetchLeaveRequests();
        setIsUpdateModalOpen(false);
    };


    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Leave Requests
                </Typography>
                <TextField
                    label="Search by request number"
                    onChange={handleSearchByRequestNumber}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                {role === 'Admin' || role === 'Employee' && (
                    <>
                <IconButton
                    onClick={() => setIsModalOpen(true)}
                    sx={{ ml: 2 }}
                >
                    <AddIcon />
                </IconButton>
                    </>
                )}
                <LeaveRequestModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={fetchLeaveRequests}
                />
            </Toolbar>
            <Box sx={{ mb: 2 }}>
                <FormControl sx={{ mr: 2, minWidth: 120 }}>
                    <InputLabel>Absence Reason</InputLabel>
                    <Select
                        value={filter.absenceReason}
                        onChange={(event) => handleFilterChange(event as SelectChangeEvent<string>)}
                        name="absenceReason"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                        <MenuItem value="Vacation">Vacation</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ mr: 2, minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filter.status}
                        onChange={(event) => handleFilterChange(event as SelectChangeEvent<string>)}
                        name="status"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="New">New</MenuItem>
                        <MenuItem value="Submitted">Submitted</MenuItem>
                        <MenuItem value="Canceled">Canceled</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filter.startDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setFilter({ ...filter, startDate: new Date(e.target.value) })}
                    sx={{ mr: 2 }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filter.endDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setFilter({ ...filter, endDate: new Date(e.target.value) })}
                    sx={{ mr: 2 }}
                />
            </Box>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sortDirection={filter.sortBy === 'employeeName' ? (filter.sortAscending ? 'asc' : 'desc') : false}>
                                    <TableSortLabel
                                        active={filter.sortBy === 'employeeName'}
                                        direction={filter.sortBy === 'employeeName' ? (filter.sortAscending ? 'asc' : 'desc') : 'asc'}
                                        onClick={() => handleSortRequest('employeeName')}
                                    >
                                        Employee Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={filter.sortBy === 'startDate' ? (filter.sortAscending ? 'asc' : 'desc') : false}>
                                    <TableSortLabel
                                        active={filter.sortBy === 'startDate'}
                                        direction={filter.sortBy === 'startDate' ? (filter.sortAscending ? 'asc' : 'desc') : 'asc'}
                                        onClick={() => handleSortRequest('startDate')}
                                    >
                                        Start Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={filter.sortBy === 'endDate' ? (filter.sortAscending ? 'asc' : 'desc') : false}>
                                    <TableSortLabel
                                        active={filter.sortBy === 'endDate'}
                                        direction={filter.sortBy === 'endDate' ? (filter.sortAscending ? 'asc' : 'desc') : 'asc'}
                                        onClick={() => handleSortRequest('endDate')}
                                    >
                                        End Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    Absence Reason
                                </TableCell>
                                <TableCell>
                                    Status
                                </TableCell>
                                <TableCell>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaveRequests.map((request) => (
                                <TableRow key={request.id} onClick={(event) => {
                                    const target = event.target as HTMLElement;
                                    if (!target.closest('button')) { // Проверяем, что не было клика по кнопке
                                        handleOpenRequestDetailsModal(request);
                                    }
                                }}>
                                    <TableCell>{request.employeeName}</TableCell>
                                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{request.absenceReason}</TableCell>
                                    <TableCell>{request.status}</TableCell>
                                    <TableCell>
                                        {role === 'Admin' || role === 'Employee' && (
                                            <>
                                                <Tooltip title="Update">
                                                    <IconButton onClick={() => handleUpdateRequest(request)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Submit">
                                                    <IconButton onClick={() => handleSubmitRequest(request.id!)}>
                                                        <DoneIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Cancel">
                                                    <IconButton onClick={() => handleCancelRequest(request.id!)}>
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {selectedRequest && (
                <UpdateLeaveRequestModal
                    open={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdate={handleUpdateLeaveRequest}
                    request={selectedRequest}
                />
            )}
            {selectedRequestDetails && (
                <LeaveRequestDetailsModal
                    open={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    request={selectedRequestDetails}
                />
            )}
        </Box>
    );
};

export default LeaveRequestListComponent;
