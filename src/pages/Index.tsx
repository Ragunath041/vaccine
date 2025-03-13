import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { 
  CalendarCheck, 
  ShieldCheck, 
  Bell, 
  MessageSquare,
  BarChart4, 
  MapPin, 
  Download, 
  Globe,
  ArrowRight, 
  CheckCircle2,
  Baby,
  Shield,
  Clock
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-blue-100 rounded-full px-4 py-2 text-blue-700 text-sm font-medium">
                Child Health Tracking System
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Protect Your Child's Future
              </h1>
              <p className="text-lg text-gray-600">
                Digital vaccination tracking system designed for modern parents and healthcare providers.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">Automated vaccination schedules</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">Real-time health records</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">Expert medical support</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Baby className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Child Profiles</h3>
                <p className="text-gray-600">Create and manage digital health profiles for your children</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Health Security</h3>
                <p className="text-gray-600">Secure storage of vaccination records and medical history</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Alerts</h3>
                <p className="text-gray-600">Timely reminders for upcoming vaccinations</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
                <p className="text-gray-600">Access health records anytime, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose VacciCare?</h2>
            <p className="section-subtitle mx-auto">
              Our comprehensive vaccination management system helps parents and doctors track, manage, and optimize the vaccination journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="vaccine-card p-6">
              <div className="feature-icon-wrapper">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Appointment Booking</h3>
              <p className="text-gray-600">
                Book vaccination appointments with ease and get intelligent slot suggestions based on doctor availability.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="vaccine-card p-6">
              <div className="feature-icon-wrapper">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Comprehensive Records</h3>
              <p className="text-gray-600">
                Keep all your child's vaccination records in one secure place with complete history and upcoming schedules.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="vaccine-card p-6">
              <div className="feature-icon-wrapper">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Timely Reminders</h3>
              <p className="text-gray-600">
                Never miss a vaccination with automated reminders via email or SMS for upcoming appointments.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="vaccine-card p-6">
              <div className="feature-icon-wrapper">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">AI Chatbot Assistant</h3>
              <p className="text-gray-600">
                Get instant answers to your vaccination queries from our intelligent vaccination assistant.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="vaccine-card p-6">
              <div className="feature-icon-wrapper">
                <BarChart4 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Doctor Analytics</h3>
              <p className="text-gray-600">
                Doctors can access real-time analytics and reports to monitor vaccination trends and patient data.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="vaccine-card p-6">
              <div className="feature-icon-wrapper">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Vaccination Centers Map</h3>
              <p className="text-gray-600">
                Locate nearby vaccination centers with our integrated map feature for convenient access.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-vaccine-gray">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle mx-auto">
              A simple 3-step process to manage your child's vaccination journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="bg-vaccine-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-vaccine-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
              <p className="text-gray-600">
                Register as a parent or doctor and set up your profile with necessary details.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="bg-vaccine-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-vaccine-blue">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Manage Vaccination Records</h3>
              <p className="text-gray-600">
                Add your children's details and keep track of their vaccination history and upcoming schedules.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="bg-vaccine-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-vaccine-blue">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Appointments</h3>
              <p className="text-gray-600">
                Schedule appointments with doctors, receive reminders, and get vaccination certificates.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/register">
              <Button className="gap-2">
                <span>Start your journey</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">What Parents & Doctors Say</h2>
            <p className="section-subtitle mx-auto">
              Hear from those who have transformed their vaccination management experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="vaccine-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Parent of two</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "VacciCare has made keeping track of my children's vaccinations so much easier. The reminders are a lifesaver for a busy mom like me!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="vaccine-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Dr. Michael Chen</h4>
                  <p className="text-sm text-gray-500">Pediatrician</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The analytics dashboard has transformed how I monitor vaccination coverage in my practice. It's a game-changer for preventive healthcare."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="vaccine-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-semibold">David & Emma Patel</h4>
                  <p className="text-sm text-gray-500">Parents of a newborn</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As new parents, we were overwhelmed with vaccination schedules. VacciCare simplified everything and gave us peace of mind."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
