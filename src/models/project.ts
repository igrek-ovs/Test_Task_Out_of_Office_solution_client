export interface IProject
{
    id:number;
    projectType:string;
    startDate:Date;
    endDate:Date;
    projectManagerId:number;
    projectManagerName:string;
    comment:string;
    status:boolean;
}
