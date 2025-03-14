import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Syringe } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

// Doctor credentials map
const DOCTOR_CREDENTIALS = {
  'doctor1@example.com': { id: "1", firstName: 'Arun', lastName: 'Patel', specialization: 'Pediatrician', password: 'doctor123' },
  'doctor2@example.com': { id: "2", firstName: 'Priya', lastName: 'Sharma', specialization: 'Vaccination Specialist', password: 'doctor123' },
  'doctor3@example.com': { id: "3", firstName: 'Rajesh', lastName: 'Kumar', specialization: 'Child Specialist', password: 'doctor123' },
  'doctor4@example.com': { id: "4", firstName: 'Deepa', lastName: 'Gupta', specialization: 'Pediatrician', password: 'doctor123' },
  'doctor5@example.com': { id: "5", firstName: 'Suresh', lastName: 'Verma', specialization: 'Immunologist', password: 'doctor123' },
  'doctor6@example.com': { id: "6", firstName: 'Anita', lastName: 'Singh', specialization: 'Pediatrician', password: 'doctor123' },
  'doctor7@example.com': { id: "7", firstName: 'Vikram', lastName: 'Malhotra', specialization: 'Child Specialist', password: 'doctor123' },
};

const Login = () => {
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if it's a doctor login
    if (email in DOCTOR_CREDENTIALS) {
      const doctor = DOCTOR_CREDENTIALS[email];
      
      if (password === doctor.password) {
        // Create a doctor user object - ensure ID is a string
        const doctorUser = {
          id: String(doctor.id),
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: email,
          role: 'doctor'
        };
        
        // Store in localStorage directly
        localStorage.setItem('user', JSON.stringify(doctorUser));
        localStorage.setItem('token', 'doctor_token_' + doctor.id);
        
        console.log("🔐 Logging in doctor with ID:", doctor.id, "Type:", typeof doctor.id);
        console.log("👨‍⚕️ Doctor user object stored:", doctorUser);
        
        toast({
          title: "Login successful",
          description: `Welcome back, Dr. ${doctor.lastName}!`,
        });
        
        // Navigate to the doctor's dashboard with email as state
        navigate('/doctor-dashboard', { state: { email: doctorUser.email } });
        return;
      } else {
        toast({
          variant: "destructive",
          title: "Invalid credentials",
          description: "Incorrect password for doctor account."
        });
        return;
      }
    } else {
      // For non-doctor emails, proceed with regular login
      try {
        await login(email, password, "parent");
        navigate('/parent-dashboard'); // Navigate to parent dashboard after login
      } catch (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Please try again."
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="bg-vaccine-light w-16 h-16 rounded-full flex items-center justify-center">
              <Syringe className="h-8 w-8 text-vaccine-blue" />
            </div>
          </div>
          
          <Card className="border-t-4 border-t-vaccine-blue animate-in fade-in-50 duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-vaccine-blue hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="pt-2 text-sm">
                  <p className="text-gray-500">
                    For doctor login, use doctor1@example.com - doctor7@example.com with password: doctor123
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full mb-4" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                
                <p className="text-sm text-center text-gray-500">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-vaccine-blue hover:underline">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
