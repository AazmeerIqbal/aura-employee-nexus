
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Pencil, Save, Trash2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock roles data
const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    permissions: [
      "view_dashboard",
      "view_employees",
      "manage_employees",
      "view_attendance",
      "manage_attendance",
      "view_salary",
      "manage_salary",
      "view_departments",
      "manage_departments",
      "view_reports",
      "manage_reports",
      "view_settings",
      "manage_settings",
      "view_calendar",
    ],
    userCount: 1,
    editable: false,
  },
  {
    id: "2",
    name: "HR Manager",
    permissions: [
      "view_dashboard",
      "view_employees",
      "manage_employees",
      "view_attendance",
      "manage_attendance",
      "view_departments",
      "view_salary",
      "view_reports",
      "view_calendar",
    ],
    userCount: 3,
    editable: true,
  },
  {
    id: "3",
    name: "Finance",
    permissions: [
      "view_dashboard",
      "view_employees",
      "view_salary",
      "manage_salary",
      "view_reports",
    ],
    userCount: 2,
    editable: true,
  },
  {
    id: "4",
    name: "Team Lead",
    permissions: [
      "view_dashboard",
      "view_employees",
      "view_attendance",
      "manage_attendance",
      "view_calendar",
    ],
    userCount: 5,
    editable: true,
  },
];

// Available permissions
const availablePermissions = [
  { id: "view_dashboard", name: "View Dashboard", description: "Access to view dashboard" },
  { id: "view_employees", name: "View Employees", description: "Access to view employee list" },
  { id: "manage_employees", name: "Manage Employees", description: "Add, edit, delete employees" },
  { id: "view_attendance", name: "View Attendance", description: "Access to view attendance records" },
  { id: "manage_attendance", name: "Manage Attendance", description: "Record and modify attendance" },
  { id: "view_salary", name: "View Salary", description: "Access to view salary information" },
  { id: "manage_salary", name: "Manage Salary", description: "Add and update salary records" },
  { id: "view_departments", name: "View Departments", description: "Access to view department list" },
  { id: "manage_departments", name: "Manage Departments", description: "Add, edit, delete departments" },
  { id: "view_reports", name: "View Reports", description: "Access to view reports" },
  { id: "manage_reports", name: "Manage Reports", description: "Create and configure reports" },
  { id: "view_settings", name: "View Settings", description: "Access to view system settings" },
  { id: "manage_settings", name: "Manage Settings", description: "Modify system settings" },
  { id: "view_calendar", name: "View Calendar", description: "Access to view calendar" },
];

const Settings = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [newRoleMode, setNewRoleMode] = useState(false);
  const { toast } = useToast();
  
  const handleEditRole = (role: typeof roles[0]) => {
    setEditingRoleId(role.id);
    setNewRoleName(role.name);
    setRolePermissions([...role.permissions]);
    setNewRoleMode(false);
  };
  
  const handleTogglePermission = (permissionId: string) => {
    setRolePermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((p) => p !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };
  
  const handleSaveRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Error",
        description: "Role name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (rolePermissions.length === 0) {
      toast({
        title: "Error",
        description: "Role must have at least one permission",
        variant: "destructive",
      });
      return;
    }
    
    if (newRoleMode) {
      // Add new role
      const newRole = {
        id: `${roles.length + 1}`,
        name: newRoleName,
        permissions: rolePermissions,
        userCount: 0,
        editable: true,
      };
      setRoles([...roles, newRole]);
      toast({
        title: "Success",
        description: `Role "${newRoleName}" has been created`,
      });
    } else {
      // Update existing role
      setRoles(
        roles.map((role) =>
          role.id === editingRoleId
            ? { ...role, name: newRoleName, permissions: rolePermissions }
            : role
        )
      );
      toast({
        title: "Success",
        description: `Role "${newRoleName}" has been updated`,
      });
    }
    
    setEditingRoleId(null);
    setNewRoleName("");
    setRolePermissions([]);
    setNewRoleMode(false);
  };
  
  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setNewRoleName("");
    setRolePermissions([]);
    setNewRoleMode(false);
  };
  
  const handleDeleteRole = (roleId: string) => {
    const roleToDelete = roles.find((role) => role.id === roleId);
    if (roleToDelete && roleToDelete.userCount > 0) {
      toast({
        title: "Cannot delete",
        description: `Role "${roleToDelete.name}" has ${roleToDelete.userCount} assigned users`,
        variant: "destructive",
      });
      return;
    }
    
    setRoles(roles.filter((role) => role.id !== roleId));
    toast({
      title: "Success",
      description: "Role has been deleted",
    });
  };
  
  const handleStartNewRole = () => {
    setNewRoleMode(true);
    setEditingRoleId(null);
    setNewRoleName("");
    setRolePermissions([]);
  };
  
  return (
    <>
      <Helmet>
        <title>Settings | AuraHR</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your application settings and user permissions
          </p>
        </div>
        
        <Tabs defaultValue="roles">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="company">Company Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>
                    Manage user roles and their permissions
                  </CardDescription>
                </div>
                <Button onClick={handleStartNewRole}>
                  Add New Role
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead className="hidden md:table-cell">Access Level</TableHead>
                      <TableHead className="hidden lg:table-cell">Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          {editingRoleId === role.id ? (
                            <Input
                              value={newRoleName}
                              onChange={(e) => setNewRoleName(e.target.value)}
                            />
                          ) : (
                            <div className="font-medium">{role.name}</div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {editingRoleId === role.id ? (
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                              {availablePermissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Switch
                                    id={`${role.id}-${permission.id}`}
                                    checked={rolePermissions.includes(permission.id)}
                                    onCheckedChange={() =>
                                      handleTogglePermission(permission.id)
                                    }
                                  />
                                  <Label
                                    htmlFor={`${role.id}-${permission.id}`}
                                    className="text-sm"
                                  >
                                    {permission.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.length > 3 ? (
                                <>
                                  {role.permissions.slice(0, 3).map((permissionId) => {
                                    const permission = availablePermissions.find(
                                      (p) => p.id === permissionId
                                    );
                                    return (
                                      <Badge
                                        key={permissionId}
                                        variant="outline"
                                        className="mr-1 mb-1"
                                      >
                                        {permission?.name}
                                      </Badge>
                                    );
                                  })}
                                  <Badge variant="outline">
                                    +{role.permissions.length - 3} more
                                  </Badge>
                                </>
                              ) : (
                                role.permissions.map((permissionId) => {
                                  const permission = availablePermissions.find(
                                    (p) => p.id === permissionId
                                  );
                                  return (
                                    <Badge
                                      key={permissionId}
                                      variant="outline"
                                      className="mr-1"
                                    >
                                      {permission?.name}
                                    </Badge>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {role.userCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingRoleId === role.id ? (
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="icon"
                                onClick={handleSaveRole}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              {role.editable && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditRole(role)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteRole(role.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {newRoleMode && (
                      <TableRow>
                        <TableCell>
                          <Input
                            placeholder="Enter role name"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {availablePermissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-2"
                              >
                                <Switch
                                  id={`new-${permission.id}`}
                                  checked={rolePermissions.includes(permission.id)}
                                  onCheckedChange={() =>
                                    handleTogglePermission(permission.id)
                                  }
                                />
                                <Label
                                  htmlFor={`new-${permission.id}`}
                                  className="text-sm"
                                >
                                  {permission.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          0
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="icon"
                              onClick={handleSaveRole}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>
                  Configure your company information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Aura Technology Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email Address</Label>
                    <Input id="company-email" defaultValue="info@aurahr.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone Number</Label>
                    <Input id="company-phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Address</Label>
                    <Input id="company-address" defaultValue="123 Innovation Street" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage system security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-factor Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Require 2FA for all admin users
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Password Expiration</div>
                      <div className="text-sm text-muted-foreground">
                        Force password reset every 90 days
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Login Attempts</div>
                      <div className="text-sm text-muted-foreground">
                        Lock account after 5 failed login attempts
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Session Timeout</div>
                      <div className="text-sm text-muted-foreground">
                        Automatically log out users after 30 minutes of inactivity
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
