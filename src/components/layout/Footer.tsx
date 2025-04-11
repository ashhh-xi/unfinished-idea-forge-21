
import { Sparkles, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold">IdeaForge</span>
            </div>
            <p className="mt-2 text-muted-foreground">
              The marketplace for unfinished ideas, side projects, and creative sparks.
              Connect, collaborate, and build together.
            </p>
            <div className="flex mt-4 space-x-3">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:contact@ideaforge.com" className="text-muted-foreground hover:text-primary">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/browse" className="text-muted-foreground hover:text-primary">
                  Browse Ideas
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-muted-foreground hover:text-primary">
                  Share Your Idea
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} IdeaForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
