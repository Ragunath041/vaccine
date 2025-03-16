import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Syringe, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

// Function to ensure doctor users exist in localStorage
const ensureDoctorUsers = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  // Check if we already have doctor users
  const doctorUsers = users.filter((u: { role: string }) => u.role === 'doctor');
  
  if (doctorUsers.length === 0) {
    // Add doctor users if none exist
    const defaultDoctorUsers = [
      {
        id: '1',
        email: 'arun.patel@example.com',
        firstName: 'Arun',
        lastName: 'Patel',
        role: 'doctor',
        phoneNumber: '9876543210',
        specialization: 'Pediatrician',
        licenseNumber: 'MED12345',
        hospitalName: 'City Hospital',
        yearsOfExperience: 10
      },
      {
        id: '2',
        email: 'priya.sharma@example.com',
        firstName: 'Priya',
        lastName: 'Sharma',
        role: 'doctor',
        phoneNumber: '9876543211',
        specialization: 'Vaccination Specialist',
        licenseNumber: 'MED12346',
        hospitalName: 'City Hospital',
        yearsOfExperience: 8
      },
      {
        id: '3',
        email: 'rajesh.kumar@example.com',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        role: 'doctor',
        phoneNumber: '9876543212',
        specialization: 'Child Specialist',
        licenseNumber: 'MED12347',
        hospitalName: 'City Hospital',
        yearsOfExperience: 12
      },
      {
        id: '4',
        email: 'deepa.gupta@example.com',
        firstName: 'Deepa',
        lastName: 'Gupta',
        role: 'doctor',
        phoneNumber: '9876543213',
        specialization: 'Pediatrician',
        licenseNumber: 'MED12348',
        hospitalName: 'City Hospital',
        yearsOfExperience: 7
      },
      {
        id: '5',
        email: 'suresh.verma@example.com',
        firstName: 'Suresh',
        lastName: 'Verma',
        role: 'doctor',
        phoneNumber: '9876543214',
        specialization: 'Immunologist',
        licenseNumber: 'MED12349',
        hospitalName: 'City Hospital',
        yearsOfExperience: 15
      },
      {
        id: '6',
        email: 'anita.singh@example.com',
        firstName: 'Anita',
        lastName: 'Singh',
        role: 'doctor',
        phoneNumber: '9876543215',
        specialization: 'Pediatrician',
        licenseNumber: 'MED12350',
        hospitalName: 'City Hospital',
        yearsOfExperience: 9
      },
      {
        id: '7',
        email: 'vikram.malhotra@example.com',
        firstName: 'Vikram',
        lastName: 'Malhotra',
        role: 'doctor',
        phoneNumber: '9876543216',
        specialization: 'Child Specialist',
        licenseNumber: 'MED12351',
        hospitalName: 'City Hospital',
        yearsOfExperience: 11
      }
    ];
    
    // Add doctor users to existing users
    const updatedUsers = [...users, ...defaultDoctorUsers];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    console.log('Added doctor users to localStorage');
  }
};

// Function to ensure parent users exist in localStorage
const ensureParentUsers = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  // Check if we already have parent users
  const parentUsers = users.filter((u: { role: string }) => u.role === 'parent');
  
  if (parentUsers.length === 0) {
    // Add parent users if none exist
    const defaultParentUsers = [
      {
        id: 'parent1',
        email: 'parent@example.com',
        firstName: 'Parent',
        lastName: 'User',
        role: 'parent',
        phoneNumber: '9876543200'
      }
    ];
    
    // Add parent users to existing users
    const updatedUsers = [...users, ...defaultParentUsers];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    console.log('Added parent users to localStorage');
  }
};

// Function to get localStorage version
const getLocalStorageVersion = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const children = JSON.parse(localStorage.getItem('children') || '[]');
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const vaccines = JSON.parse(localStorage.getItem('vaccines') || '[]');
  const vaccinationRecords = JSON.parse(localStorage.getItem('vaccination_records') || '[]');
  
  return {
    users: users.length,
    children: children.length,
    appointments: appointments.length,
    vaccines: vaccines.length,
    vaccinationRecords: vaccinationRecords.length
  };
};

const Login = () => {
  const { login, loading } = useAuth();
  const [activeRole, setActiveRole] = useState<"parent" | "doctor">("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storageVersion, setStorageVersion] = useState(getLocalStorageVersion());
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize users when component mounts
  useEffect(() => {
    ensureDoctorUsers();
    ensureParentUsers();
    setStorageVersion(getLocalStorageVersion());
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitting login form with email: ${email}, role: ${activeRole}`);
    await login(email, password, activeRole);
  };

  const handleClearLocalStorage = () => {
    if (confirm("Are you sure you want to clear localStorage? This will remove all data.")) {
      localStorage.clear();
      ensureDoctorUsers();
      ensureParentUsers();
      setStorageVersion(getLocalStorageVersion());
      toast({
        title: "localStorage cleared",
        description: "Default users have been re-added.",
      });
    }
  };

  const handleAutoFill = () => {
    if (activeRole === "parent") {
      setEmail("parent@example.com");
      setPassword("password");
    } else {
      setEmail("arun.patel@example.com");
      setPassword("password");
    }
    toast({
      title: "Credentials auto-filled",
      description: "You can now click Sign In to log in.",
    });
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
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your {activeRole === "parent" ? "parent" : "doctor"} account
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder={activeRole === "parent" ? "parent@example.com" : "doctor@example.com"}
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
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mb-4"
                    onClick={handleAutoFill}
                  >
                    Auto-fill Credentials
                  </Button>
                  
                  <p className="text-sm text-center text-gray-500 mb-2">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-vaccine-blue hover:underline">
                      Sign up
                    </Link>
                  </p>
                  
                  <p className="text-xs text-center text-gray-400">
                    For testing: {activeRole === "parent" ? "parent@example.com" : "arun.patel@example.com"} / password
                  </p>
                </CardFooter>
              </form>
            </Card>
          </Tabs>
          
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">localStorage Version</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleClearLocalStorage}
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Users: {storageVersion.users}</div>
              <div>Children: {storageVersion.children}</div>
              <div>Appointments: {storageVersion.appointments}</div>
              <div>Vaccines: {storageVersion.vaccines}</div>
              <div>Vaccination Records: {storageVersion.vaccinationRecords}</div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
