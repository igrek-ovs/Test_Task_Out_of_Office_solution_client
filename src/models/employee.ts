export interface IEmployee {
    id: number;
    fullName: string;
    subdivision: string;
    position: string;
    peoplePartnerId:number;
    photo: any;
    isActive: boolean | undefined;
    outOfOfficeBalance: number;
}