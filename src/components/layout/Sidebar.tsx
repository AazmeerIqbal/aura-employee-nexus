
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  Briefcase, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  LayoutDashboard, 
  Settings, 
  Users
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/", permission: "view_dashboard" },
    { title: "Employees", icon: <Users size={20} />, path: "/employees", permission: "view_employees" },
    { title: "Attendance", icon: <Clock size={20} />, path: "/attendance", permission: "view_attendance" },
    { title: "Salary", icon: <DollarSign size={20} />, path: "/salary", permission: "view_salary" },
    { title: "Departments", icon: <Briefcase size={20} />, path: "/departments", permission: "view_departments" },
    { title: "Reports", icon: <BarChart3 size={20} />, path: "/reports", permission: "view_reports" },
    { title: "Calendar", icon: <Calendar size={20} />, path: "/calendar", permission: "view_calendar" },
    { title: "Settings", icon: <Settings size={20} />, path: "/settings", permission: "view_settings" },
  ];

  return (
    <aside
      className={`bg-sidebar text-sidebar-foreground flex flex-col h-full ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 ease-in-out shadow-lg`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="text-xl font-bold flex items-center">
            <span>AuraHR</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md bg-sidebar-accent/20 text-sidebar-foreground hover:bg-sidebar-accent/30"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                }`
              }
              end={item.path === "/"}
            >
              <span className="flex items-center justify-center">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-sidebar-border/30">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent/20 flex items-center justify-center">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name || "User"}</span>
              <span className="text-xs opacity-75">{user?.role || "Admin"}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
