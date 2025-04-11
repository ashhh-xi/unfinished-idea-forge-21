
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Zap,
  Code, 
  PenTool, 
  Bookmark,
  ArrowRight
} from 'lucide-react';

// Mock trending ideas
const trendingIdeas = [
  {
    id: 1,
    title: "AI-Powered Habit Tracker App",
    description: "An app that uses AI to analyze habits and provide personalized coaching.",
    category: "Mobile App",
    status: "Prototype",
    author: "Alex Johnson",
    likes: 128,
    views: 1243,
    image: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Collaborative Music Creation Platform",
    description: "Web app for musicians to collaborate remotely on tracks in real-time.",
    category: "Web App",
    status: "MVP",
    author: "Sophia Williams",
    likes: 89,
    views: 975,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Sustainable Food Delivery Service",
    description: "Zero-waste food delivery service with reusable containers and electric vehicles.",
    category: "Startup",
    status: "Concept",
    author: "Daniel Kim",
    likes: 56,
    views: 631,
    image: "https://images.unsplash.com/photo-1513135467880-6c31e4505775?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

// Mock categories
const categories = [
  { name: "Web App", icon: <Code className="h-6 w-6" /> },
  { name: "Mobile App", icon: <Zap className="h-6 w-6" /> },
  { name: "Design", icon: <PenTool className="h-6 w-6" /> },
  { name: "Startup", icon: <TrendingUp className="h-6 w-6" /> },
];

const HomePage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Unfinished Ideas</span> Deserve to Be Built
            </h1>
            <p className="text-xl mb-10 text-muted-foreground">
              Connect with creators, find inspiration, and collaborate on side projects.
              Turn unfinished ideas into reality.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/browse">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Ideas
                  <Lightbulb className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Share Your Idea
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-accent/20 animate-pulse" />
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How IdeaForge Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A marketplace that brings creators and builders together to give life to unfinished ideas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="bg-primary/10 rounded-full p-5 w-20 h-20 mx-auto flex items-center justify-center mb-6">
                <Lightbulb className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Your Idea</h3>
              <p className="text-muted-foreground">
                Upload your unfinished projects, concepts, or side hustles for others to discover.
              </p>
            </div>
            
            <div className="text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-primary/10 rounded-full p-5 w-20 h-20 mx-auto flex items-center justify-center mb-6">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Collaborators</h3>
              <p className="text-muted-foreground">
                Connect with talented people who can help bring your vision to life.
              </p>
            </div>
            
            <div className="text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="bg-primary/10 rounded-full p-5 w-20 h-20 mx-auto flex items-center justify-center mb-6">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow Together</h3>
              <p className="text-muted-foreground">
                Build, launch, and scale your project with our community and resources.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trending Ideas */}
      <section className="py-20 bg-secondary/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Trending Ideas</h2>
            <Link to="/browse" className="flex items-center text-primary hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingIdeas.map((idea) => (
              <Link to={`/idea/${idea.id}`} key={idea.id}>
                <Card className="h-full idea-card overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={idea.image} 
                      alt={idea.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-1 rounded">
                        {idea.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {idea.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {idea.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">By {idea.author}</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Bookmark className="h-4 w-4 mr-1" />
                        {idea.likes}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover ideas across different domains and industries
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link to={`/browse?category=${category.name}`} key={index}>
                <div className="bg-card border rounded-lg p-6 text-center hover:border-primary hover:shadow-md transition-all">
                  <div className="bg-secondary/50 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    {category.icon}
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Share Your Idea?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of creators and builders today and transform your unfinished ideas into reality.
          </p>
          <Link to="/register">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
