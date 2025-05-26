
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Mail, IdCard, CheckCircle } from 'lucide-react';

interface CollegeVerificationProps {
  onVerificationComplete: () => void;
}

const CollegeVerification = ({ onVerificationComplete }: CollegeVerificationProps) => {
  const [step, setStep] = useState<'details' | 'otp' | 'verified'>('details');
  const [collegeId, setCollegeId] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!collegeId.trim() || !collegeEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both your college ID and email address.",
        variant: "destructive",
      });
      return;
    }

    if (!collegeEmail.includes('@') || !collegeEmail.includes('.edu')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid college email address (.edu domain).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${collegeEmail}`,
      });
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('verified');
      toast({
        title: "Verification Successful!",
        description: "Your college identity has been verified.",
      });
      
      // Complete verification after a short delay
      setTimeout(() => {
        onVerificationComplete();
      }, 2000);
    }, 1500);
  };

  if (step === 'verified') {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-6">
          <CheckCircle size={64} className="text-green-500 mx-auto animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Complete!</h2>
        <p className="text-gray-600 mb-4">
          Welcome to CampusHub! Your college identity has been verified.
        </p>
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-sm text-green-700">
            You now have access to all features including the marketplace and community.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <ShieldCheck size={48} className="text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Verify Your College</h2>
        <p className="text-gray-600 mt-2">
          Confirm your student status to access CampusHub
        </p>
      </div>

      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard size={20} />
              College Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collegeId">College ID Number</Label>
              <Input
                id="collegeId"
                placeholder="Enter your student ID (e.g., S12345678)"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collegeEmail">College Email Address</Label>
              <Input
                id="collegeEmail"
                type="email"
                placeholder="Enter your .edu email address"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Must be a valid college email with .edu domain
              </p>
            </div>

            <Button 
              onClick={handleSendOTP} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </>
              ) : (
                <>
                  <Mail size={16} className="mr-2" />
                  Send Verification Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'otp' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} />
              Enter Verification Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                We've sent a 6-digit verification code to:
              </p>
              <p className="font-medium text-blue-600 mb-6">{collegeEmail}</p>
            </div>

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={() => setStep('details')} 
                className="w-full"
                disabled={isLoading}
              >
                Back to College Details
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button 
                  onClick={handleSendOTP}
                  className="text-blue-600 hover:underline"
                  disabled={isLoading}
                >
                  Resend
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">🔐 Verification Process</h3>
        <p className="text-sm text-blue-700">
          This verification ensures only legitimate college students can access the marketplace and community features.
        </p>
      </div>
    </div>
  );
};

export default CollegeVerification;
