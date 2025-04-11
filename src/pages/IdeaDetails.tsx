
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  ThumbsUp,
  Calendar, 
  Eye,
  Clock,
  FileText,
  Code,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

// Mock idea data
const ideaData = {
  id: 1,
  title: "AI-Powered Habit Tracker App",
  description: "An intelligent mobile application that leverages machine learning algorithms to track and analyze user habits. The app provides personalized coaching and actionable insights to help users build better habits and break negative ones.",
  longDescription: `
    # Project Overview
    
    This is a mobile application concept that combines habit tracking with AI-powered insights. The app would use machine learning to analyze user behavior patterns and provide personalized coaching.
    
    ## Current Progress
    
    So far, I've completed the following:
    - Basic UI/UX design in Figma
    - App architecture planning
    - Initial algorithm research for habit pattern recognition
    
    ## Technical Requirements
    
    - React Native for cross-platform compatibility
    - TensorFlow Lite for on-device machine learning
    - Firebase for backend and authentication
    - User data analytics pipeline
    
    ## Challenges
    
    The main challenges I've encountered are:
    1. Creating accurate prediction algorithms with limited initial data
    2. Designing meaningful visualizations for habit patterns
    3. Balancing privacy concerns with data collection needs
  `,
  category: "Mobile App",
  status: "Prototype",
  author: {
    id: 42,
    name: "Alex Johnson",
    username: "alexj",
    avatar: "https://i.pravatar.cc/150?img=42",
    bio: "Mobile app developer and AI enthusiast. Building tools to help people live better lives.",
    skills: ["React Native", "Machine Learning", "UX Design"],
  },
  createdAt: "2023-12-15",
  updatedAt: "2024-03-05",
  likes: 128,
  views: 1243,
  bookmarks: 76,
  collaboration: {
    status: "Open",
    roles: ["Frontend Developer", "ML Engineer", "UI/UX Designer"]
  },
  files: [
    { name: "app_mockups.pdf", type: "pdf", size: "2.4 MB" },
    { name: "architecture.png", type: "image", size: "1.1 MB" },
    { name: "demo.mp4", type: "video", size: "8.2 MB" }
  ],
  tags: ["mobile", "ai", "machine-learning", "productivity", "health"],
  image: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  similar: [
    {
      id: 7,
      title: "Mindfulness Meditation Timer",
      category: "Mobile App",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 8,
      title: "Personal Finance AI Advisor",
      category: "Web App",
      image: "https://images.unsplash.com/photo-1579621970590-9d624316781b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 9,
      title: "Health Data Visualization Platform",
      category: "Web App",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ]
};

const IdeaDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  // In a real app, we would fetch the idea data based on the ID
  
  const handleBookmark = () => {
    toast({
      title: "Idea Bookmarked",
      description: "This idea has been added to your bookmarks.",
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link Copied",
        description: "Link to this idea has been copied to clipboard.",
      });
    });
  };
  
  const handleContact = () => {
    toast({
      title: "Contact Feature",
      description: "This feature will be available soon.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-8/12">
          {/* Hero Image */}
          <div className="rounded-lg overflow-hidden h-72 sm:h-96 mb-6">
            <img 
              src={ideaData.image}
              alt={ideaData.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Title and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Badge variant="outline" className="mr-2">{ideaData.category}</Badge>
                <Badge variant="secondary">{ideaData.status}</Badge>
              </div>
              <h1 className="text-3xl font-bold">{ideaData.title}</h1>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" onClick={handleBookmark}>
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created: {ideaData.createdAt}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Updated: {ideaData.updatedAt}
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {ideaData.likes} likes
            </div>
            <div className="flex items-center">
              <Bookmark className="h-4 w-4 mr-1" />
              {ideaData.bookmarks} bookmarks
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {ideaData.views} views
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg mb-6">
                    {ideaData.description}
                  </p>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    {ideaData.longDescription.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('# ')) {
                        return <h2 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.substring(2)}</h2>
                      } else if (paragraph.startsWith('## ')) {
                        return <h3 key={index} className="text-xl font-bold mt-5 mb-3">{paragraph.substring(3)}</h3>
                      } else if (paragraph.startsWith('- ')) {
                        return (
                          <ul key={index} className="list-disc pl-5 my-4">
                            {paragraph.split('\n').map((item, i) => (
                              <li key={i}>{item.substring(2)}</li>
                            ))}
                          </ul>
                        )
                      } else if (/^\d\./.test(paragraph)) {
                        return (
                          <ol key={index} className="list-decimal pl-5 my-4">
                            {paragraph.split('\n').map((item, i) => {
                              const numMatch = item.match(/^\d+\.\s(.*)/);
                              return numMatch ? <li key={i}>{numMatch[1]}</li> : null;
                            })}
                          </ol>
                        )
                      } else {
                        return <p key={index} className="my-4">{paragraph}</p>
                      }
                    })}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {ideaData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="files" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Files</CardTitle>
                  <CardDescription>Files and resources attached to this idea</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ideaData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="discussion" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion</CardTitle>
                  <CardDescription>Comments and questions about this idea</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <p className="text-muted-foreground mb-4">No comments yet. Be the first to start the discussion!</p>
                    <Button onClick={handleContact}>Add Comment</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-4/12">
          {/* Creator Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={ideaData.author.avatar} alt={ideaData.author.name} />
                  <AvatarFallback>{ideaData.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="font-semibold">{ideaData.author.name}</p>
                  <p className="text-sm text-muted-foreground">@{ideaData.author.username}</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground text-sm">
                {ideaData.author.bio}
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {ideaData.author.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full mt-4" onClick={handleContact}>
                <User className="h-4 w-4 mr-2" />
                Contact Creator
              </Button>
            </CardContent>
          </Card>
          
          {/* Collaboration Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Collaboration</CardTitle>
              <CardDescription>This project is {ideaData.collaboration.status.toLowerCase()} for collaboration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Roles Needed</h4>
                <div className="space-y-2">
                  {ideaData.collaboration.roles.map((role, index) => (
                    <div key={index} className="flex items-center">
                      <Code className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={handleContact}>
                <Sparkles className="h-4 w-4 mr-2" />
                Request to Collaborate
              </Button>
            </CardContent>
          </Card>
          
          {/* AI Insights Card */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Market Potential</h4>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Strong potential</span>
                    <span>75%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Technical Complexity</h4>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Moderate</span>
                    <span>60%</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">AI Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    This habit tracking app has strong potential with its AI-driven approach to personalized coaching. 
                    The market is competitive but the machine learning component creates a differentiated offering.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Similar Ideas */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ideaData.similar.map((idea) => (
                  <div key={idea.id} className="flex items-center">
                    <div className="h-12 w-12 rounded overflow-hidden">
                      <img 
                        src={idea.image}
                        alt={idea.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium line-clamp-1">{idea.title}</p>
                      <p className="text-xs text-muted-foreground">{idea.category}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/idea/${idea.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
