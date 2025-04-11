
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Github, Mail, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Registration Successful",
        description: "Welcome to IdeaForge! Your account has been created.",
      });
      navigate('/browse');
    }, 1500);
  };
  
  const handleOAuthSignUp = (provider: string) => {
    toast({
      title: `${provider} Sign Up`,
      description: "This feature will be available soon.",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold">IdeaForge</span>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              Join our community of creators and builders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    placeholder="your.email@example.com" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Create a secure password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">I am a...</Label>
                  <Select onValueChange={setRole} value={role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="creator">Creator with ideas</SelectItem>
                      <SelectItem value="builder">Builder/Developer</SelectItem>
                      <SelectItem value="investor">Investor/Advisor</SelectItem>
                      <SelectItem value="other">Just exploring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleOAuthSignUp('GitHub')}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleOAuthSignUp('Google')} 
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
