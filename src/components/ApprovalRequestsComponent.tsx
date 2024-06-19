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
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Search as SearchIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { getApprovalRequestsByFilter, approveRequest, rejectRequest } from '../store/actions/ApprovalRequestActions';
import { IApprovalRequest } from '../models/approvalRequest';
import { IApprovalRequestFilter } from '../models/approvalRequestFilter';
import { toast } from 'react-toastify';
import ApprovalRequestDetailsModal from "../modals/ApprovalRequestDetailsModal";

const ApprovalRequestsComponent: React.FC = () => {
    const [approvalRequests, setApprovalRequests] = useState<IApprovalRequest[] | null>(null);
    const [filter, setFilter] = useState<IApprovalRequestFilter>({
        sortBy: 'leaveRequestId',
        sortAscending: true,
        status: '',
        requestNumber: undefined,
        searchByFullName: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedRequestDetails, setSelectedRequestDetails] = useState<IApprovalRequest | null>(null);


    useEffect(() => {
        fetchApprovalRequests();
    }, [filter]);

    const fetchApprovalRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getApprovalRequestsByFilter(filter);
            setApprovalRequests(data);
        } catch (error) {
            setError('Failed to fetch approval requests. Please try again later.');
            setApprovalRequests([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenRequestDetailsModal = (request: IApprovalRequest) => {
        setSelectedRequestDetails(request);
        setIsDetailsModalOpen(true);
    };

    const handleSearchByRequestNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, requestNumber: event.target.value ? Number(event.target.value) : undefined });
    };

    const handleFilterChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = event.target;
        setFilter({
            ...filter,
            [name as string]: value
        });
    };

    const handleApproveRequest = async (id: number) => {
        try {
            await approveRequest(id);
            toast.success('Request approved successfully.');
            fetchApprovalRequests();
        } catch (error) {
            toast.error('Failed to approve the request.');
        }
    };

    const handleRejectRequest = async (id: number) => {
        const comment = prompt('Please enter the reason for rejection:');
        if (comment) {
            try {
                await rejectRequest(id, comment);
                toast.success('Request rejected successfully.');
                fetchApprovalRequests();
            } catch (error) {
                toast.error('Failed to reject the request.');
            }
        }
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Approval Requests
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
            </Toolbar>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={filter.status}
                        onChange={(event) => handleFilterChange(event as React.ChangeEvent<{ name?: string; value: unknown }>)}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        <MenuItem value="Pending">New</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Search by full name"
                    name="searchByFullName"
                    value={filter.searchByFullName}
                    onChange={handleFilterChange}
                />
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
            ) : approvalRequests && approvalRequests.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={filter.sortBy === 'leaveRequestId'}
                                        direction={filter.sortAscending ? 'asc' : 'desc'}
                                        onClick={() => setFilter({
                                            ...filter,
                                            sortBy: 'leaveRequestId',
                                            sortAscending: filter.sortBy === 'leaveRequestId' ? !filter.sortAscending : true
                                        })}
                                    >
                                        Leave Request ID
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Approver Name</TableCell>
                                <TableCell>Leave Request Details</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Comment</TableCell>
                                <TableCell>Employee Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {approvalRequests.map((request) => (
                                <TableRow key={request.id} onClick={(event) => {
                                    const target = event.target as HTMLElement;
                                    if (!target.closest('button')) { // Проверяем, что не было клика по кнопке
                                        handleOpenRequestDetailsModal(request);
                                    }
                                }}>
                                    <TableCell>{request.leaveRequestId}</TableCell>
                                    <TableCell>{request.approverName}</TableCell>
                                    <TableCell>{request.leaveRequestDetails}</TableCell>
                                    <TableCell>{request.status}</TableCell>
                                    <TableCell>{request.comment}</TableCell>
                                    <TableCell>{request.employeeName}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Approve">
                                            <IconButton onClick={() => handleApproveRequest(request.id!)}>
                                                <CheckIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                            <IconButton onClick={() => handleRejectRequest(request.id!)}>
                                                <CloseIcon />
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
                        No approval requests found.
                    </Typography>
                </Box>
            )}
            {selectedRequestDetails && (
                <ApprovalRequestDetailsModal
                    open={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    request={selectedRequestDetails}
                />
            )}
        </Box>
    );
};

export default ApprovalRequestsComponent;
