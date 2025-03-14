import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Syringe } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  
  // Basic info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("📝 Attempting registration with:", { firstName, lastName, email, password });
      
      // Validate all required fields
      if (!firstName || !lastName || !email || !password) {
        console.error("❌ Missing required fields");
        toast({
          variant: "destructive",
          title: "Error",
          description: "All fields are required"
        });
        setIsLoading(false);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error("❌ Invalid email format");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid email address"
        });
        setIsLoading(false);
        return;
      }
      
      // Validate password length
      if (password.length < 6) {
        console.error("❌ Password too short");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Password must be at least 6 characters long"
        });
        setIsLoading(false);
        return;
      }

      // Check if account already exists
      const storedUsersJson = localStorage.getItem('users');
      const users = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        console.error("❌ Email already registered");
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "An account with this email already exists"
        });
        setIsLoading(false);
        return;
      }
      
      // Create user object
      const user = {
        id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        firstName,
        lastName,
        email,
        password,
        role: "parent", // Always set parent role for registrations
        created_at: new Date().toISOString()
      };
      
      console.log("👤 New user object:", {...user, password: '[REDACTED]'});
      
      // Save to localStorage for demo purposes
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      console.log("💾 User saved to localStorage");
      
      // Also attempt to save to backend API
      try {
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Backend API registration successful:", data);
        }
      } catch (error) {
        console.log("⚠️ Backend API error, but user was saved locally:", error);
      }
      
      toast({
        title: "Registration Successful",
        description: "You can now login with your credentials",
      });
      
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      
      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("❌ Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An error occurred during registration",
      });
    } finally {
      setIsLoading(false);
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
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Sign up as a parent/guardian
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    type="tel" 
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms} 
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-vaccine-blue hover:underline">
                      terms of service
                    </Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-vaccine-blue hover:underline">
                      privacy policy
                    </Link>
                  </label>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit" 
                  className="w-full mb-4" 
                  disabled={loading || !agreeTerms}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                
                <p className="text-sm text-center text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-vaccine-blue hover:underline">
                    Sign in
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

export default Register;
