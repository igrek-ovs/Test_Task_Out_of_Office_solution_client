import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainComponent from "../components/MainComponent";
import RoleNavigator from "../components/RoleNavigator";
import EmployeeListComponent from "../components/EmployeeListComponent";
import LeaveRequestListComponent from "../components/LeaveRequestListComponent";
import ProjectListComponent from "../components/ProjectListComponent";
import ApprovalRequestsComponent from "../components/ApprovalRequestsComponent";


const Routing = () => {
    const [role, setRole] = useState<string | null>(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainComponent setRole={setRole} />} />
                <Route path="/role-navigator" element={role ? <RoleNavigator role={role} /> : <Navigate to="/" />} />
                <Route path="/lists/employees" element={<EmployeeListComponent />} />
                 <Route path="/lists/projects" element={<ProjectListComponent />} />
                 <Route path="/lists/leave-requests" element={<LeaveRequestListComponent />} />
                 <Route path="/lists/approval-requests" element={<ApprovalRequestsComponent />} />
            </Routes>
        </Router>
    );
}

export default Routing;