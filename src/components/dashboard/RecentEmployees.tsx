
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: string;
  name: string;
  image?: string;
  email: string;
  department: string;
  role: string;
  joinedDate: string;
}

interface RecentEmployeesProps {
  employees: Employee[];
}

const RecentEmployees = ({ employees }: RecentEmployeesProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle>Recent Employees</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between py-3 px-6 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={employee.image} alt={employee.name} />
                  <AvatarFallback>
                    {employee.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">{employee.department}</Badge>
                <p className="text-xs text-muted-foreground">Joined {employee.joinedDate}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEmployees;
