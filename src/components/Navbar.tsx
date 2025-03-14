import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Syringe, LogOut, User, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, role, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-vaccine-blue">
            <Syringe className="h-5 w-5" />
            <span>VacciCare</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {role === "doctor" ? (
                <Link to="/doctor-dashboard">
                  <Button variant="outline" size="sm" className="gap-1">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/parent-dashboard">
                  <Button variant="outline" size="sm" className="gap-1">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              )}
              <Button 
                onClick={logout} 
                variant="ghost" 
                size="sm"
                className="gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {user ? (
                <>
                  <Link 
                    to={role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"} 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/appointments" 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }} 
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Register</span>
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
