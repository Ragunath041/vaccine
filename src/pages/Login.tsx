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
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Syringe } from "lucide-react";
import { useAuth } from "@/lib/auth";

const Login = () => {
  const { login, loading } = useAuth();
  const [activeRole, setActiveRole] = useState<"parent" | "doctor">("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, activeRole);
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
                  
                  <p className="text-sm text-center text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-vaccine-blue hover:underline">
                      Sign up
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

export default Login;
