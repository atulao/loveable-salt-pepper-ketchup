
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthCallbackPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle the hash parameters for Supabase auth
    const handleAuthRedirect = async () => {
      setLoading(true);
      try {
        // Check if we have an access token in the URL hash
        const hash = window.location.hash;
        
        if (hash) {
          // Let Supabase Auth handle the token
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            setError(error.message);
            toast({
              title: "Authentication failed",
              description: error.message,
              variant: "destructive",
            });
          } else if (data?.session) {
            toast({
              title: "Authentication successful",
              description: "You have been successfully authenticated",
            });
            // Redirect to home page
            navigate('/');
          }
        } else {
          setError("No authentication data found in URL");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred during authentication");
        toast({
          title: "Authentication failed",
          description: err.message || "An error occurred during authentication",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handleAuthRedirect();
  }, [navigate, toast]);

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-njit-navy">Authentication</CardTitle>
          <CardDescription>Verifying your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Processing your authentication...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-md text-red-800">
                <p className="font-medium">Authentication Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button onClick={handleGoToLogin} className="w-full">
                Go to Login
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-md text-green-800">
                <p className="font-medium">Authentication Successful</p>
                <p className="text-sm">You will be redirected to the homepage shortly.</p>
              </div>
              <Button onClick={() => navigate('/')} className="w-full">
                Go to Homepage
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallbackPage;
