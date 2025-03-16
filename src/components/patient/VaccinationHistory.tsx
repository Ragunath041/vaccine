import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertCircle, Calendar, User, RefreshCw, Stethoscope, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VaccinationRecord {
  id: string;
  child_name: string;
  vaccine_name: string;
  vaccination_date: string;
  status: string;
  child_id?: string;
  doctor_name?: string;
  notes?: string;
}

interface VaccinationHistoryProps {
  records: VaccinationRecord[];
  onRefresh?: () => void;
}

export const VaccinationHistory = ({ records = [], onRefresh }: VaccinationHistoryProps) => {
  console.log("Vaccination records in component:", records);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vaccination History</h2>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refresh</span>
          </Button>
        )}
      </div>
      
      {records.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500">No vaccination records found</h3>
          <p className="mt-2 text-gray-400">
            Vaccination records will appear here once your child receives vaccines
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {records.map((record) => (
            <Card key={record.id} className="overflow-hidden">
              <div className={`h-2 ${record.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  <span>{record.vaccine_name}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {new Date(record.vaccination_date).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-600">Child: {record.child_name}</p>
                  </div>
                  <div className="flex items-center">
                    {record.status === 'completed' ? (
                      <>
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-600 text-sm">Completed</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="text-amber-600 text-sm">Scheduled</span>
                      </>
                    )}
                  </div>
                </div>
                
                {record.doctor_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Stethoscope className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-600">Administered by: {record.doctor_name}</p>
                  </div>
                )}
                
                {record.notes && (
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                    <p className="text-gray-600">{record.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
