
import React from "react";
import { Helmet } from "react-helmet";
import StatCard from "@/components/dashboard/StatCard";
import RecentEmployees from "@/components/dashboard/RecentEmployees";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import { Users, Clock, Briefcase, DollarSign, User, CalendarClock } from "lucide-react";

const Dashboard = () => {
  // Mock data for employees
  const recentEmployees = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.j@example.com",
      department: "Engineering",
      role: "Frontend Developer",
      joinedDate: "Apr 12, 2025",
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah.w@example.com",
      department: "Marketing",
      role: "Marketing Specialist",
      joinedDate: "Apr 05, 2025",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.b@example.com",
      department: "Finance",
      role: "Financial Analyst",
      joinedDate: "Mar 28, 2025",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.d@example.com",
      department: "HR",
      role: "HR Specialist",
      joinedDate: "Mar 15, 2025",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | AuraHR</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your organization's key metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Employees"
            value="210"
            icon={Users}
            trend={{ value: 5.2, positive: true }}
            color="primary"
          />
          <StatCard
            title="Present Today"
            value="185"
            icon={Clock}
            trend={{ value: 2.1, positive: true }}
            color="success"
          />
          <StatCard
            title="Departments"
            value="8"
            icon={Briefcase}
            color="info"
          />
          <StatCard
            title="Avg. Salary"
            value="$75,750"
            icon={DollarSign}
            trend={{ value: 3.4, positive: true }}
            color="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AttendanceChart />
          </div>
          <div>
            <RecentEmployees employees={recentEmployees} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Upcoming Events</h3>
              <CalendarClock className="text-muted-foreground" size={20} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="font-medium">Project Deadline</p>
                  <p className="text-sm text-muted-foreground">Web Portal Update</p>
                </div>
                <span className="text-sm font-medium">Apr 20</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="font-medium">Team Meeting</p>
                  <p className="text-sm text-muted-foreground">Quarterly Planning</p>
                </div>
                <span className="text-sm font-medium">Apr 15</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Company Event</p>
                  <p className="text-sm text-muted-foreground">Team Building</p>
                </div>
                <span className="text-sm font-medium">Apr 30</span>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">New Hires</h3>
              <User className="text-muted-foreground" size={20} />
            </div>
            <div className="space-y-4">
              {recentEmployees.slice(0, 3).map((employee) => (
                <div key={employee.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium mr-3">
                      {employee.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  <div className="text-sm">{employee.joinedDate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
