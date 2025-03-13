
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-8xl font-bold text-vaccine-blue mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">Return to Home</Button>
        </Link>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
