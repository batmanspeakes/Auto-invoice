import React from 'react';
import { Button } from './ui/button';
import { RotateCw, Database } from 'lucide-react';

interface DatabaseErrorProps {
  error?: string;
  onRetry?: () => void;
}

const DatabaseError: React.FC<DatabaseErrorProps> = ({ 
  error = "Could not connect to the database", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <Database className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Database Connection Error</h1>
        
        <div className="bg-red-900/20 border border-red-800 rounded-md p-4 mb-6">
          <p className="text-sm text-center">{error}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-700/50 p-3 rounded text-sm">
            <p className="font-medium mb-1">Troubleshooting steps:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check if your Supabase project is online</li>
              <li>Verify network connectivity</li>
              <li>Confirm that the database tables are properly set up</li>
              <li>Try logging in/registering again</li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-3">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Retry Connection
              </Button>
            )}
            
            <Button
              variant="outline" 
              onClick={() => window.location.href = '/login'}
              className="w-full"
            >
              Go to Login Page
            </Button>
            
            <Button
              variant="link"
              onClick={() => window.location.href = 'https://app.supabase.com/'}
              className="w-full text-primary"
            >
              Visit Supabase Dashboard
            </Button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-gray-500 text-sm">
        For further assistance, please contact your administrator
      </p>
    </div>
  );
};

export default DatabaseError; 