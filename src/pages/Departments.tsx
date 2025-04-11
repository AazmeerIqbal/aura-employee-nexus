
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import DepartmentCard from "@/components/departments/DepartmentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
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
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Mock department data
const mockDepartments = [
  {
    id: "1",
    name: "Engineering",
    description: "Software development and technical operations",
    employeeCount: 45,
    maxCapacity: 60,
    manager: "Alex Johnson",
    color: "#3498db",
  },
  {
    id: "2",
    name: "Marketing",
    description: "Brand management and marketing campaigns",
    employeeCount: 25,
    maxCapacity: 30,
    manager: "Sarah Wilson",
    color: "#e74c3c",
  },
  {
    id: "3",
    name: "Finance",
    description: "Financial planning and accounting",
    employeeCount: 15,
    maxCapacity: 20,
    manager: "Michael Brown",
    color: "#2ecc71",
  },
  {
    id: "4",
    name: "Human Resources",
    description: "Employee management and recruitment",
    employeeCount: 10,
    maxCapacity: 15,
    manager: "Emily Davis",
    color: "#f39c12",
  },
  {
    id: "5",
    name: "Operations",
    description: "Day-to-day operations and logistics",
    employeeCount: 20,
    maxCapacity: 30,
    manager: "David Martinez",
    color: "#9b59b6",
  },
  {
    id: "6",
    name: "Customer Support",
    description: "Customer service and technical support",
    employeeCount: 30,
    maxCapacity: 40,
    manager: "Jennifer Lee",
    color: "#1abc9c",
  },
];

const formSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().min(1, "Description is required"),
  manager: z.string().optional(),
  maxCapacity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Capacity must be a positive number",
  }),
  color: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Departments = () => {
  const [departments, setDepartments] = useState(mockDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState<any>(null);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      manager: "",
      maxCapacity: "20",
      color: "#3498db",
    },
  });
  
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEdit = (department: any) => {
    setEditDepartment(department);
    form.reset({
      name: department.name,
      description: department.description,
      manager: department.manager || "",
      maxCapacity: String(department.maxCapacity),
      color: department.color,
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (departmentId: string) => {
    setDepartments(departments.filter((dept) => dept.id !== departmentId));
    toast({
      title: "Department deleted",
      description: "The department has been removed successfully",
    });
  };
  
  const handleAddNew = () => {
    setEditDepartment(null);
    form.reset({
      name: "",
      description: "",
      manager: "",
      maxCapacity: "20",
      color: "#3498db",
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = (data: FormData) => {
    if (editDepartment) {
      // Update existing department
      setDepartments(
        departments.map((dept) =>
          dept.id === editDepartment.id
            ? {
                ...dept,
                name: data.name,
                description: data.description,
                manager: data.manager || null,
                maxCapacity: Number(data.maxCapacity),
                color: data.color,
              }
            : dept
        )
      );
      toast({
        title: "Department updated",
        description: "The department has been updated successfully",
      });
    } else {
      // Add new department
      const newDepartment = {
        id: `${departments.length + 1}`,
        name: data.name,
        description: data.description,
        employeeCount: 0,
        maxCapacity: Number(data.maxCapacity),
        manager: data.manager || null,
        color: data.color,
      };
      setDepartments([...departments, newDepartment]);
      toast({
        title: "Department added",
        description: "The department has been added successfully",
      });
    }
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <Helmet>
        <title>Departments | AuraHR</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization's departments
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Department
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No departments found
            </div>
          ) : (
            filteredDepartments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDepartment ? "Edit Department" : "Add Department"}
            </DialogTitle>
            <DialogDescription>
              {editDepartment
                ? "Update department information"
                : "Add a new department to your organization"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Software development and technical operations"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            {...field}
                            className="w-12 h-9 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            {...field}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Department manager (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editDepartment ? "Update" : "Add"} Department
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Departments;
