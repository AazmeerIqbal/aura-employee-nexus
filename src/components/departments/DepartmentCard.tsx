
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  maxCapacity: number;
  manager?: string;
  color?: string;
}

interface DepartmentCardProps {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (departmentId: string) => void;
}

const DepartmentCard = ({
  department,
  onEdit,
  onDelete,
}: DepartmentCardProps) => {
  const employeePercentage = Math.round(
    (department.employeeCount / department.maxCapacity) * 100
  );
  
  const getProgressColor = () => {
    if (employeePercentage < 50) return "bg-green-500";
    if (employeePercentage < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="overflow-hidden border">
      <div
        className="h-2"
        style={{
          backgroundColor: department.color || "#3498db",
        }}
      />
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{department.name}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {department.employeeCount} / {department.maxCapacity}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {department.description}
        </p>
        <div className="space-y-1">
          <div className="flex text-xs justify-between items-center">
            <span>Capacity</span>
            <span>{employeePercentage}%</span>
          </div>
          <Progress
            value={employeePercentage}
            className={`h-2 ${getProgressColor()}`}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="mr-1 h-4 w-4" />
          <span>{department.manager || "No manager"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(department)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(department.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DepartmentCard;
