export interface IProjectFilter
{
    sortBy:string;
    sortAscending:boolean;
    projectType:string;
    startDateFrom:Date;
    startDateTo:Date;
    status:boolean;
    projectNumber:number | null;
    assignedEmployeeId:number | null;
}