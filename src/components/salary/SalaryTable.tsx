
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  DollarSign, 
  Edit, 
  Plus, 
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeImage?: string;
  department: string;
  amount: number;
  currency: string;
  effectiveDate: Date;
  type: "monthly" | "annual" | "hourly";
  status: "active" | "upcoming" | "expired";
}

interface SalaryTableProps {
  records: SalaryRecord[];
  onAddSalary: () => void;
  onEditSalary: (record: SalaryRecord) => void;
}

const SalaryTable = ({
  records,
  onAddSalary,
  onEditSalary,
}: SalaryTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortField, setSortField] = useState<"name" | "amount" | "date">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const departments = [
    "all",
    ...Array.from(new Set(records.map((record) => record.department))),
  ];

  // Sort and filter records
  const filteredRecords = records
    .filter((record) => {
      const matchesSearch = record.employeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || record.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.employeeName.localeCompare(b.employeeName)
          : b.employeeName.localeCompare(a.employeeName);
      } else if (sortField === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else {
        return sortDirection === "asc"
          ? a.effectiveDate.getTime() - b.effectiveDate.getTime()
          : b.effectiveDate.getTime() - a.effectiveDate.getTime();
      }
    });

  const toggleSort = (field: "name" | "amount" | "date") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "upcoming":
        return "text-blue-600";
      case "expired":
        return "text-muted-foreground";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center w-full sm:w-auto space-x-2">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAddSalary} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Salary Record
        </Button>
      </div>

      <div className="rounded-md border shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center">
                  Employee
                  {sortField === "name" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  {sortField === "amount" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead
                className="hidden lg:table-cell cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center">
                  Effective Date
                  {sortField === "date" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No salary records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={record.employeeImage}
                          alt={record.employeeName}
                        />
                        <AvatarFallback>
                          {record.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-xs md:hidden">{record.department}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {record.department}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center font-medium ${getStatusStyle(
                        record.status
                      )}`}
                    >
                      <DollarSign className="mr-1 h-4 w-4" />
                      {formatCurrency(record.amount, record.currency)}
                    </div>
                    <div className="sm:hidden text-xs">
                      {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {format(record.effectiveDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditSalary(record)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <b>{filteredRecords.length}</b> of <b>{records.length}</b>{" "}
          records
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            1
          </Button>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalaryTable;
