import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/services/api";

// Types for our authentication context
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

type Role = "parent" | "doctor" | null;

type AuthContextType = {
  user: User | null;
  role: Role;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

type RegistrationData = {
  email: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  specialization?: string;
  licenseNumber?: string;
  hospitalName?: string;
  yearsOfExperience?: number;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role") as Role;
    
    if (token && storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string, loginRole: Role) => {
    if (!loginRole) return;
    
    setLoading(true);
    console.log(`Attempting login with email: ${email}, role: ${loginRole}`);
    
    try {
      // For a real application, this would be an API call to a backend
      // For this demo, we're checking against localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('All users in localStorage:', users);
      
      const foundUser = users.find((u: any) => u.email === email && u.role === loginRole);
      console.log('Found user:', foundUser);
      
      if (foundUser) {
        // For testing purposes, we'll skip password validation
        // In a real app, we would verify the password hash here
        
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          role: loginRole
        };
        
        // Generate a token (in a real app, this would come from the backend)
        const token = `mock-token-${Date.now()}`;
        
        setUser(userData);
        setRole(loginRole);
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", loginRole);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.firstName}!`,
        });
        
        // Redirect based on role
        if (loginRole === "parent") {
          navigate("/parent-dashboard");
        } else if (loginRole === "doctor") {
          navigate("/doctor-dashboard");
        }
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (data: RegistrationData) => {
    setLoading(true);
    
    try {
      const response = await auth.register(data);
      const result = response.data;

      const userData = {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: data.role
      };

      setUser(userData);
      setRole(data.role);
      
      // Store in localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", data.role);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
      
      // Redirect based on role
      if (data.role === "parent") {
        navigate("/parent-dashboard");
      } else if (data.role === "doctor") {
        navigate("/doctor-dashboard");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };
  
  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
