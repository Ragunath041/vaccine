import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

// API URL
const API_URL = "http://localhost:5000/api";

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
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: loginRole }),
      });

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userData = {
        id: data.user.id || data.user.user_id, // Try both possible ID fields
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: loginRole
      };

      console.log("Setting user data:", userData); // Debug log

      setUser(userData);
      setRole(loginRole);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", loginRole);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.firstName}!`,
      });
      
      // Redirect based on role
      if (loginRole === "parent") {
        navigate("/parent-dashboard");
      } else if (loginRole === "doctor") {
        navigate("/doctor-dashboard");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (data: RegistrationData) => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      setUser(result.user);
      setRole(data.role);
      
      // Store in localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
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
