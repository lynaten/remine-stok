import React from "react";
import { Terminal, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertProps {
  type: boolean; // true for success, false for error
  children: React.ReactNode;
}

const AlertMessage: React.FC<AlertProps> = ({ type, children }) => {
  return (
    <Alert variant={type ? "default" : "destructive"}>
      {type ? (
        <Terminal className="h-4 w-4" /> // Success icon
      ) : (
        <AlertCircle className="h-4 w-4" /> // Error icon
      )}
      <AlertTitle>{type ? "Success" : "Error"}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
