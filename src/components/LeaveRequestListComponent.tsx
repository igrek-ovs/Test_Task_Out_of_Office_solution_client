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
    Add as AddIcon
} from '@mui/icons-material';
import { getLeaveRequestsByFilter } from '../store/actions/LeaveRequestActions';
import { ILeaveRequest } from '../models/leaveRequest';
import {ILeaveRequestFilter} from '../models/leaveRequestFilter';
import LeaveRequestModal from "../modals/AddLeaveRequestModal";
const currentDate = new Date();
const defaultStartDate = new Date(currentDate.setMonth(currentDate.getMonth() - 11));
const defaultEndDate = new Date(currentDate.setMonth(currentDate.getMonth() + 11));
const LeaveRequestListComponent: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
    const [filter, setFilter] = useState<ILeaveRequestFilter>({
        sortBy: 'startDate',
        sortAscending: true,
        absenceReason: '',
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        status: '',
        reuestNumber: 0
    });
    const [isLoading, setIsLoading] = useState(false);

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

    // Функция для обработки поиска по номеру запроса
    const handleSearchByRequestNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Обработка изменения значения поля поиска
    };

    // Функция для открытия формы создания нового запроса
    const handleOpenNewRequestForm = () => {
        // Обработка открытия формы создания нового запроса
    };

    // Функции обработки сортировки, фильтрации и т. д. можно добавить здесь

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
                <IconButton
                    onClick={() => setIsModalOpen(true)}
                    sx={{ ml: 2 }}
                >
                    <AddIcon />
                </IconButton>
                <LeaveRequestModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={(newRequest) => {
                        setLeaveRequests([...leaveRequests, newRequest]); // Обновляем список запросов после добавления нового
                    }}
                />
            </Toolbar>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            {/* Заголовки таблицы */}
                        </TableHead>
                        <TableBody>
                            {leaveRequests.map((request) => (
                                <TableRow key={request.id}>
                                    {/* Данные строки таблицы */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default LeaveRequestListComponent;
