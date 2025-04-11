
import React from "react";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card border-b shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 py-2 pr-4 rounded-full bg-secondary/60 focus:outline-none focus:ring-1 focus:ring-ring w-[200px] md:w-[300px]"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
