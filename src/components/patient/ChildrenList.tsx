
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  completedVaccines: number;
  upcomingVaccines: number;
}

interface ChildrenListProps {
  children: Child[];
}

export const ChildrenList = ({ children }: ChildrenListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children.map(child => (
        <Card key={child.id} className="overflow-hidden">
          <div className="h-2 bg-vaccine-blue"></div>
          <CardHeader>
            <CardTitle>{child.name}</CardTitle>
            <CardDescription>
              Born: {new Date(child.dateOfBirth).toLocaleDateString()}, {child.gender}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Completed Vaccines</p>
                <p className="text-2xl font-bold text-vaccine-blue">{child.completedVaccines}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Upcoming Vaccines</p>
                <p className="text-2xl font-bold text-vaccine-green">{child.upcomingVaccines}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm">View Details</Button>
              <Button size="sm">Schedule Vaccine</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Add Child Card */}
      <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
        <Plus className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Add a Child</h3>
        <p className="text-gray-500 text-center mb-4">
          Register your child to manage their vaccinations
        </p>
        <Button variant="outline">Add Child</Button>
      </Card>
    </div>
  );
};
