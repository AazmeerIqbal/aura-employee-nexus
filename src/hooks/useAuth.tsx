
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Define our user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

// Define the auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@aurahr.com",
    password: "password123",
    role: "Super Admin",
    permissions: ["*"] // Wildcard for all permissions
  },
  {
    id: "2",
    name: "HR Manager",
    email: "hr@aurahr.com",
    password: "password123",
    role: "HR Manager",
    permissions: [
      "view_dashboard",
      "view_employees",
      "manage_employees",
      "view_attendance",
      "manage_attendance",
      "view_departments",
      "view_salary"
    ]
  },
  {
    id: "3",
    name: "Finance User",
    email: "finance@aurahr.com",
    password: "password123",
    role: "Finance",
    permissions: ["view_dashboard", "view_employees", "view_salary", "manage_salary"]
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock API call
    try {
      setLoading(true);
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Create a "safe" user object without the password
      const safeUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        permissions: foundUser.permissions
      };
      
      setUser(safeUser);
      localStorage.setItem("user", JSON.stringify(safeUser));
      toast({
        title: "Welcome back!",
        description: `Logged in as ${safeUser.name}`,
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup API call
    try {
      setLoading(true);
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      const userExists = mockUsers.some(u => u.email === email);
      if (userExists) {
        throw new Error("User with this email already exists");
      }
      
      // In a real app, we would send this to the backend
      // For now, we'll just log it and pretend it worked
      console.log("Sign up data:", { name, email, password });
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      
      // Redirect to login
      navigate("/login");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.permissions.includes("*")) return true;
    
    // Check specific permission
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
