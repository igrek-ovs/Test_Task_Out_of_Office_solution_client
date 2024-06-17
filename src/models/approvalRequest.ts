export interface IApprovalRequest {
    id?: number;
    approverId: number;
    approverName?: string;
    leaveRequestId: number;
    leaveRequestDetails?: string;
    status: string;
    comment?: string;
    employeeName?: string;
}
