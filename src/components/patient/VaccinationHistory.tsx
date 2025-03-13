
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText } from "lucide-react";

interface Vaccination {
  id: string;
  childName: string;
  vaccineName: string;
  date: string;
  doctorName: string;
  notes: string;
  certificateAvailable: boolean;
}

interface VaccinationHistoryProps {
  vaccinations: Vaccination[];
}

export const VaccinationHistory = ({ vaccinations }: VaccinationHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vaccination History</CardTitle>
        <CardDescription>
          Complete record of your children's vaccinations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {vaccinations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No vaccination history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vaccinations.map(vaccination => (
              <div 
                key={vaccination.id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1 mb-3 md:mb-0">
                  <h4 className="font-medium">{vaccination.childName} - {vaccination.vaccineName}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(vaccination.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm">{vaccination.doctorName}</p>
                  <p className="text-sm text-gray-500">{vaccination.notes}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {vaccination.certificateAvailable && (
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      <span>Certificate</span>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" />
                    <span>Details</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
