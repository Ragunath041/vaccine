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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Syringe } from "lucide-react";
import { useAuth } from "@/lib/auth";

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const [activeRole, setActiveRole] = useState<"parent" | "doctor">("parent");
  
  // Basic info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Doctor specific info
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    setPasswordError("");
    
    const registrationData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role: activeRole,
      ...(activeRole === "doctor" && {
        specialization,
        licenseNumber,
        hospitalName,
        yearsOfExperience: parseInt(yearsOfExperience) || 0
      })
    };
    
    await registerUser(registrationData);
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
          
          <Tabs defaultValue="parent" onValueChange={(value) => setActiveRole(value as "parent" | "doctor")}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="parent">Parent/Guardian</TabsTrigger>
              <TabsTrigger value="doctor">Doctor/Admin</TabsTrigger>
            </TabsList>
            
            <Card className="border-t-4 border-t-vaccine-blue animate-in fade-in-50 duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>
                  Sign up as a {activeRole === "parent" ? "parent/guardian" : "doctor/healthcare provider"}
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
                  
                  {activeRole === "doctor" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input 
                          id="specialization" 
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input 
                          id="licenseNumber" 
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hospitalName">Hospital Name</Label>
                        <Input 
                          id="hospitalName" 
                          value={hospitalName}
                          onChange={(e) => setHospitalName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                        <Input 
                          id="yearsOfExperience" 
                          type="number" 
                          min="0"
                          value={yearsOfExperience}
                          onChange={(e) => setYearsOfExperience(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                  
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
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
