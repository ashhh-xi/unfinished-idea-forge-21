
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { 
  Search, 
  Menu, 
  X, 
  PlusCircle,
  Lightbulb,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Mock authentication state (replace with actual auth later)
  const isAuthenticated = false;
  
  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Browse', path: '/browse', icon: <Lightbulb className="h-4 w-4" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <Sparkles className="h-4 w-4" />, auth: true },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">IdeaForge</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navLinks.map((link) => 
                (!link.auth || isAuthenticated) && (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === link.path
                        ? 'text-primary-foreground bg-primary'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {link.icon}
                    <span className="ml-1">{link.name}</span>
                  </Link>
                )
              )}
            </div>
          </div>
          
          <div className="hidden sm:flex items-center">
            <div className="relative mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                className="block w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search ideas..."
              />
            </div>
            
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center ml-4">
                <Link to="/create">
                  <Button variant="default" className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Idea
                  </Button>
                </Link>
                <Button variant="ghost" className="ml-2">
                  Profile
                </Button>
              </div>
            ) : (
              <div className="flex items-center ml-4">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="ml-2">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-background focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => 
              (!link.auth || isAuthenticated) && (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'text-primary-foreground bg-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                  onClick={toggleMenu}
                >
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </Link>
              )
            )}
            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                className="block w-full pl-10 pr-4 py-2 border rounded-md bg-background text-foreground"
                placeholder="Search ideas..."
              />
            </div>
            
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link 
                  to="/create" 
                  onClick={toggleMenu}
                  className="flex items-center w-full px-3 py-2 text-base font-medium rounded-md bg-primary text-primary-foreground"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Idea
                </Link>
                <Link 
                  to="/profile" 
                  onClick={toggleMenu}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary rounded-md"
                >
                  Profile
                </Link>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <Link 
                  to="/login" 
                  onClick={toggleMenu}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary rounded-md"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={toggleMenu}
                  className="block w-full px-3 py-2 text-base font-medium rounded-md bg-primary text-primary-foreground"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
