
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import SalaryTable from "@/components/salary/SalaryTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Mock salary data
const mockSalaryRecords = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Alex Johnson",
    employeeImage: "",
    department: "Engineering",
    amount: 95000,
    currency: "USD",
    effectiveDate: new Date(2023, 3, 1), // April 1, 2023
    type: "annual" as const,
    status: "active" as const,
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Sarah Wilson",
    employeeImage: "",
    department: "Marketing",
    amount: 85000,
    currency: "USD",
    effectiveDate: new Date(2023, 1, 15), // Feb 15, 2023
    type: "annual" as const,
    status: "active" as const,
  },
  {
    id: "3",
    employeeId: "3",
    employeeName: "Michael Brown",
    employeeImage: "",
    department: "Finance",
    amount: 110000,
    currency: "USD",
    effectiveDate: new Date(2023, 5, 1), // June 1, 2023
    type: "annual" as const,
    status: "active" as const,
  },
  {
    id: "4",
    employeeId: "4",
    employeeName: "Emily Davis",
    employeeImage: "",
    department: "HR",
    amount: 78000,
    currency: "USD",
    effectiveDate: new Date(2023, 2, 10), // March 10, 2023
    type: "annual" as const,
    status: "active" as const,
  },
  {
    id: "5",
    employeeId: "5",
    employeeName: "David Martinez",
    employeeImage: "",
    department: "Engineering",
    amount: 98500,
    currency: "USD",
    effectiveDate: new Date(2023, 7, 1), // Aug 1, 2023
    type: "annual" as const,
    status: "active" as const,
  },
  {
    id: "6",
    employeeId: "6",
    employeeName: "Jennifer Lee",
    employeeImage: "",
    department: "Operations",
    amount: 90000,
    currency: "USD",
    effectiveDate: new Date(2023, 8, 15), // Sept 15, 2023
    type: "annual" as const,
    status: "active" as const,
  },
];

// Mock employees for dropdown
const employees = [
  { id: "1", name: "Alex Johnson", department: "Engineering" },
  { id: "2", name: "Sarah Wilson", department: "Marketing" },
  { id: "3", name: "Michael Brown", department: "Finance" },
  { id: "4", name: "Emily Davis", department: "HR" },
  { id: "5", name: "David Martinez", department: "Engineering" },
  { id: "6", name: "Jennifer Lee", department: "Operations" },
];

const formSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  type: z.enum(["monthly", "annual", "hourly"]),
  effectiveDate: z.string().min(1, "Effective date is required"),
});

type FormData = z.infer<typeof formSchema>;

const Salary = () => {
  const [salaryRecords, setSalaryRecords] = useState(mockSalaryRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      amount: "",
      currency: "USD",
      type: "annual",
      effectiveDate: format(new Date(), "yyyy-MM-dd"),
    },
  });
  
  const handleAddSalary = () => {
    setEditRecord(null);
    form.reset({
      employeeId: "",
      amount: "",
      currency: "USD",
      type: "annual",
      effectiveDate: format(new Date(), "yyyy-MM-dd"),
    });
    setIsDialogOpen(true);
  };
  
  const handleEditSalary = (record: any) => {
    setEditRecord(record);
    form.reset({
      employeeId: record.employeeId,
      amount: String(record.amount),
      currency: record.currency,
      type: record.type,
      effectiveDate: format(record.effectiveDate, "yyyy-MM-dd"),
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = (data: FormData) => {
    const employee = employees.find((emp) => emp.id === data.employeeId);
    
    if (employee) {
      if (editRecord) {
        // Update existing record
        setSalaryRecords(
          salaryRecords.map((record) =>
            record.id === editRecord.id
              ? {
                  ...record,
                  employeeId: data.employeeId,
                  employeeName: employee.name,
                  department: employee.department,
                  amount: Number(data.amount),
                  currency: data.currency,
                  effectiveDate: parse(data.effectiveDate, "yyyy-MM-dd", new Date()),
                  type: data.type,
                }
              : record
          )
        );
        toast({
          title: "Salary updated",
          description: `${employee.name}'s salary has been updated successfully`,
        });
      } else {
        // Add new record
        const newRecord = {
          id: `${salaryRecords.length + 1}`,
          employeeId: data.employeeId,
          employeeName: employee.name,
          employeeImage: "",
          department: employee.department,
          amount: Number(data.amount),
          currency: data.currency,
          effectiveDate: parse(data.effectiveDate, "yyyy-MM-dd", new Date()),
          type: data.type,
          status: "active" as const,
        };
        setSalaryRecords([...salaryRecords, newRecord]);
        toast({
          title: "Salary added",
          description: `${employee.name}'s salary has been added successfully`,
        });
      }
      setIsDialogOpen(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Salary | AuraHR</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salary Records</h1>
          <p className="text-muted-foreground">
            Manage employee compensation and salary history
          </p>
        </div>
        
        <SalaryTable
          records={salaryRecords}
          onAddSalary={handleAddSalary}
          onEditSalary={handleEditSalary}
        />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editRecord ? "Edit Salary" : "Add Salary Record"}
              </DialogTitle>
              <DialogDescription>
                {editRecord
                  ? "Update salary information for the employee"
                  : "Add a new salary record for an employee"}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!!editRecord}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name} - {employee.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="75000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="effectiveDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Effective Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editRecord ? "Update" : "Add"} Record
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Salary;
