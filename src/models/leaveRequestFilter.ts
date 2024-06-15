export interface ILeaveRequestFilter {
    sortBy: string;
    sortAscending: boolean;
    absenceReason: string;
    startDate: Date;
    endDate: Date;
    status: string;
    reuestNumber: number;
}