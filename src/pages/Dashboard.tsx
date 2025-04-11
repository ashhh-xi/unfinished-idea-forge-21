
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, PlusCircle, Lightbulb, MessageSquare, Bookmark, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated (mock)
    const checkAuth = () => {
      // For demo purposes, let's say the user is not authenticated
      setIsAuthenticated(false);
      
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please login to access your dashboard.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate, toast, isAuthenticated]);
  
  // Mock ideas data (to be replaced with API call)
  const myIdeas = [
    {
      id: 101,
      title: "Collaborative Playlist Generator",
      description: "App that creates playlists based on the combined music tastes of groups.",
      category: "Web App",
      status: "Concept",
      createdAt: "2024-03-12",
    },
    {
      id: 102,
      title: "Urban Garden Planning Tool",
      description: "Tool to help urban dwellers plan efficient and sustainable gardens in small spaces.",
      category: "Mobile App",
      status: "Prototype",
      createdAt: "2024-02-28",
    }
  ];
  
  const savedIdeas = [
    {
      id: 1,
      title: "AI-Powered Habit Tracker App",
      description: "An app that uses AI to analyze habits and provide personalized coaching.",
      category: "Mobile App",
      status: "Prototype",
      author: "Alex Johnson",
      savedAt: "2024-03-15",
    },
    {
      id: 6,
      title: "Fitness Gamification Platform",
      description: "Turn regular workouts into RPG-style adventures with real-world rewards.",
      category: "Mobile App",
      status: "Concept",
      author: "Emma Thompson",
      savedAt: "2024-03-10",
    }
  ];
  
  const messages = [
    {
      id: 201,
      from: "Sophia Williams",
      subject: "Collaboration on Music Platform",
      preview: "Hi there! I saw your collaborative music platform idea and would love to discuss...",
      date: "2024-03-16",
      read: false
    },
    {
      id: 202,
      from: "Daniel Kim",
      subject: "Interest in Sustainable Delivery",
      preview: "Hello! I'm a UX designer with experience in sustainability projects. Your delivery service concept...",
      date: "2024-03-14",
      read: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your ideas and collaborations</p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => navigate('/create')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Idea
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Overview Cards */}
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">My Ideas</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saved Ideas</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Messages</p>
              <p className="text-2xl font-bold">2</p>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                1 unread
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="my-ideas" className="mt-6">
        <TabsList>
          <TabsTrigger value="my-ideas" className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            My Ideas
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved Ideas
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-ideas" className="mt-6">
          <div className="space-y-4">
            {myIdeas.length > 0 ? (
              myIdeas.map(idea => (
                <Card key={idea.id} className="idea-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded mr-2">
                            {idea.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {idea.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
                        <p className="text-muted-foreground mb-4">
                          {idea.description}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          Created on {idea.createdAt}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/idea/${idea.id}/edit`)}>
                          Edit
                        </Button>
                        <Button variant="default" size="sm" onClick={() => navigate(`/idea/${idea.id}`)}>
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No ideas yet</h3>
                <p className="text-muted-foreground mb-4">
                  Share your first idea and connect with potential collaborators.
                </p>
                <Button onClick={() => navigate('/create')}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Idea
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <div className="space-y-4">
            {savedIdeas.length > 0 ? (
              savedIdeas.map(idea => (
                <Card key={idea.id} className="idea-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded mr-2">
                            {idea.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {idea.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
                        <p className="text-muted-foreground mb-4">
                          {idea.description}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="mr-2">By {idea.author}</span>
                          <span>•</span>
                          <span className="ml-2">Saved on {idea.savedAt}</span>
                        </div>
                      </div>
                      <Button variant="default" size="sm" onClick={() => navigate(`/idea/${idea.id}`)}>
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved ideas</h3>
                <p className="text-muted-foreground mb-4">
                  Browse ideas and save the ones that interest you.
                </p>
                <Button onClick={() => navigate('/browse')}>
                  Browse Ideas
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6">
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map(message => (
                <Card key={message.id} className={`idea-card ${!message.read ? 'border-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        {!message.read && (
                          <div className="inline-block bg-primary rounded-full h-2 w-2 mr-2"></div>
                        )}
                        <h3 className="text-xl font-bold mb-2">{message.subject}</h3>
                        <p className="text-muted-foreground mb-4">
                          {message.preview}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>From: {message.from}</span>
                          <span className="mx-2">•</span>
                          <span>{message.date}</span>
                        </div>
                      </div>
                      <Button variant="default" size="sm">
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground mb-4">
                  When someone contacts you about an idea, messages will appear here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
