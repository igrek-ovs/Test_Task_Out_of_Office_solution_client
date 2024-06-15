export interface ILeaveRequest {
    id?: number;
    employeeId?: number;
    employeeName?:string;
    absenceReason:string;
    startDate: Date;
    endDate: Date;
    comment?: string;
    status?: string;
    approvalRequestId?: number;
    approvalStatus?:string;
}