
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";

// Mock attendance data
const mockAttendanceRecords = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Alex Johnson",
    department: "Engineering",
    date: new Date(),
    status: "present" as const,
    checkInTime: "09:00 AM",
    checkOutTime: "05:30 PM",
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Sarah Wilson",
    department: "Marketing",
    date: new Date(),
    status: "present" as const,
    checkInTime: "08:45 AM",
    checkOutTime: "05:15 PM",
  },
  {
    id: "3",
    employeeId: "3",
    employeeName: "Michael Brown",
    department: "Finance",
    date: new Date(),
    status: "absent" as const,
    checkInTime: "",
    checkOutTime: "",
  },
  {
    id: "4",
    employeeId: "4",
    employeeName: "Emily Davis",
    department: "HR",
    date: new Date(),
    status: "late" as const,
    checkInTime: "10:15 AM",
    checkOutTime: "06:00 PM",
  },
  {
    id: "5",
    employeeId: "5",
    employeeName: "David Martinez",
    department: "Engineering",
    date: new Date(),
    status: "present" as const,
    checkInTime: "09:05 AM",
    checkOutTime: "05:45 PM",
  },
  {
    id: "6",
    employeeId: "6",
    employeeName: "Jennifer Lee",
    department: "Operations",
    date: new Date(),
    status: "half-day" as const,
    checkInTime: "09:00 AM",
    checkOutTime: "01:30 PM",
  },
];

const employees = [
  { id: "1", name: "Alex Johnson", department: "Engineering" },
  { id: "2", name: "Sarah Wilson", department: "Marketing" },
  { id: "3", name: "Michael Brown", department: "Finance" },
  { id: "4", name: "Emily Davis", department: "HR" },
  { id: "5", name: "David Martinez", department: "Engineering" },
  { id: "6", name: "Jennifer Lee", department: "Operations" },
];

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  
  const form = useForm({
    defaultValues: {
      employeeId: "",
      status: "present" as const,
      checkInTime: "",
      checkOutTime: "",
    },
  });
  
  const onSubmit = (data: any) => {
    // Generate a new ID for the record
    const newId = `${attendanceRecords.length + 1}`;
    
    // Find the employee details
    const employee = employees.find((emp) => emp.id === data.employeeId);
    
    if (employee) {
      // Create a new attendance record
      const newRecord = {
        id: newId,
        employeeId: data.employeeId,
        employeeName: employee.name,
        department: employee.department,
        date: date,
        status: data.status as "present" | "absent" | "late" | "half-day",
        checkInTime: data.checkInTime || "",
        checkOutTime: data.checkOutTime || "",
      };
      
      // Add the new record to the state
      setAttendanceRecords([...attendanceRecords, newRecord]);
      
      // Show a success toast notification
      toast({
        title: "Attendance recorded",
        description: `${employee.name}'s attendance has been recorded for ${format(date, "MMM dd, yyyy")}`,
      });
      
      // Reset the form and close the dialog
      form.reset();
      setIsDialogOpen(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Attendance | AuraHR</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="text-muted-foreground">
              Track and manage employee attendance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock className="text-muted-foreground" />
            <div className="text-right">
              <div className="font-medium">{format(new Date(), "EEEE")}</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(), "MMMM dd, yyyy")}
              </div>
            </div>
          </div>
        </div>

        <AttendanceTable
          records={attendanceRecords}
          onMarkAttendance={() => setIsDialogOpen(true)}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <DialogDescription>
                Record attendance for an employee
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Date</FormLabel>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="border rounded-md"
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="half-day">Half-day</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("status") !== "absent" && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="checkInTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check In</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="checkOutTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check Out</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Attendance;
