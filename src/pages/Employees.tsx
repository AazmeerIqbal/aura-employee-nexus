
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EmployeeForm, { EmployeeFormValues } from "@/components/employees/EmployeeForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock employee data
const mockEmployees = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    department: "Engineering",
    role: "Frontend Developer",
    status: "active" as const,
    joinedDate: "April 12, 2023",
    image: "",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    department: "Marketing",
    role: "Marketing Specialist",
    status: "active" as const,
    joinedDate: "January 5, 2023",
    image: "",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    department: "Finance",
    role: "Financial Analyst",
    status: "inactive" as const,
    joinedDate: "June 18, 2022",
    image: "",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    department: "HR",
    role: "HR Specialist",
    status: "on-leave" as const,
    joinedDate: "March 10, 2022",
    image: "",
  },
  {
    id: "5",
    name: "David Martinez",
    email: "david.m@example.com",
    department: "Engineering",
    role: "Backend Developer",
    status: "active" as const,
    joinedDate: "August 22, 2023",
    image: "",
  },
  {
    id: "6",
    name: "Jennifer Lee",
    email: "jennifer.l@example.com",
    department: "Operations",
    role: "Operations Manager",
    status: "active" as const,
    joinedDate: "September 15, 2023",
    image: "",
  },
];

type View = "list" | "add" | "edit" | "view";

// Define proper employee type to match EmployeeTable expectations
interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "inactive" | "on-leave";
  joinedDate: string;
  image: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [currentView, setCurrentView] = useState<View>("list");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCurrentView("view");
  };
  
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCurrentView("edit");
  };
  
  const handleDeleteEmployee = (employeeId: string) => {
    // In a real app, you would make an API call
    // For now, we just filter the employee out of our state
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
    toast({
      title: "Employee deleted",
      description: "The employee has been removed successfully",
    });
  };
  
  const handleAddNew = () => {
    setSelectedEmployee(null);
    setCurrentView("add");
  };
  
  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (currentView === "add") {
      // Generate a random ID (in a real app, the backend would do this)
      const newEmployee: Employee = {
        ...data,
        id: `${employees.length + 1}`,
        status: data.status as "active" | "inactive" | "on-leave" || "active",
        role: data.role || "",
        email: data.email || "",
        department: data.department || "",
        joinedDate: data.joinedDate || new Date().toLocaleDateString(),
        image: data.image || "",
        name: data.name || "",
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "Employee added",
        description: "The employee has been added successfully",
      });
    } else if (currentView === "edit" && selectedEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === selectedEmployee.id ? { 
            ...emp, 
            ...data, 
            status: data.status as "active" | "inactive" | "on-leave" || emp.status 
          } : emp
        )
      );
      toast({
        title: "Employee updated",
        description: "The employee has been updated successfully",
      });
    }
    
    setIsSubmitting(false);
    setCurrentView("list");
  };
  
  const goBack = () => {
    setCurrentView("list");
    setSelectedEmployee(null);
  };
  
  return (
    <>
      <Helmet>
        <title>Employees | AuraHR</title>
      </Helmet>
      <div className="space-y-6">
        {currentView === "list" ? (
          <>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
              <p className="text-muted-foreground">
                Manage your organization's employee records
              </p>
            </div>
            <EmployeeTable
              employees={employees}
              onView={handleViewEmployee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onAddNew={handleAddNew}
            />
          </>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={goBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                  {currentView === "add"
                    ? "Add Employee"
                    : currentView === "edit"
                    ? "Edit Employee"
                    : "View Employee"}
                </h1>
              </div>
              <p className="text-muted-foreground ml-10">
                {currentView === "add"
                  ? "Add a new employee to your organization"
                  : currentView === "edit"
                  ? "Update employee information"
                  : "View employee details"}
              </p>
            </div>
            <div className="ml-10">
              <EmployeeForm
                defaultValues={selectedEmployee}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Employees;
