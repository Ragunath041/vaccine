
import { MapPin } from "lucide-react";

export const MapButton = () => {
  return (
    <button
      className="fixed bottom-8 left-8 bg-vaccine-green text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
    >
      <MapPin className="h-6 w-6" />
      <span className="sr-only">Find vaccination centers</span>
    </button>
  );
};
