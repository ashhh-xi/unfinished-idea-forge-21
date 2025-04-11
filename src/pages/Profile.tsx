
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin, 
  Globe, 
  MapPin,
  Briefcase,
  Lightbulb,
  Award
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock user data
const userData = {
  id: 42,
  name: "Alex Johnson",
  username: "alexj",
  avatar: "https://i.pravatar.cc/150?img=42",
  bio: "Mobile app developer and AI enthusiast with 5+ years of experience. Passionate about building tools that make people's lives better and more productive.",
  location: "San Francisco, CA",
  email: "alex.johnson@example.com",
  website: "https://alexjohnson.dev",
  company: "TechInnovate Labs",
  joinedDate: "March 2023",
  skills: ["React Native", "Machine Learning", "UX Design", "Node.js", "Python", "TypeScript"],
  socialLinks: {
    github: "alexjdev",
    twitter: "alexj_dev",
    linkedin: "alex-johnson-dev"
  },
  ideas: [
    {
      id: 101,
      title: "AI-Powered Habit Tracker App",
      description: "An app that uses AI to analyze habits and provide personalized coaching.",
      category: "Mobile App",
      status: "Prototype",
      createdAt: "Dec 15, 2023",
    },
    {
      id: 102,
      title: "Collaborative Music Creation Platform",
      description: "Web app for musicians to collaborate remotely on tracks in real-time.",
      category: "Web App",
      status: "MVP",
      createdAt: "Jan 5, 2024",
    }
  ],
  collaborations: [
    {
      id: 201,
      title: "Urban Garden Planning Tool",
      description: "Tool to help urban dwellers plan efficient and sustainable gardens in small spaces.",
      category: "Mobile App",
      role: "Frontend Developer",
      joinedAt: "Feb 10, 2024",
    }
  ],
  achievements: [
    {
      id: 301,
      title: "Top Contributor",
      description: "Recognized for valuable feedback and active participation",
      awardedAt: "Feb 2024",
      icon: "Award"
    },
    {
      id: 302,
      title: "Idea of the Month",
      description: "AI Habit Tracker voted community favorite",
      awardedAt: "Jan 2024",
      icon: "Trophy"
    }
  ]
};

const Profile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // In a real app, we would fetch user data based on the ID
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You are no longer following ${userData.name}` 
        : `You are now following ${userData.name}`
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
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>{userData.name[0]}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold mt-4">{userData.name}</h1>
                <p className="text-muted-foreground">@{userData.username}</p>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleFollow}>
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline" onClick={handleContact}>
                    Contact
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {userData.bio}
                </p>
                
                {userData.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{userData.location}</span>
                  </div>
                )}
                
                {userData.company && (
                  <div className="flex items-center text-sm">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{userData.company}</span>
                  </div>
                )}
                
                {userData.website && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={userData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {userData.website.replace(/(^\w+:|^)\/\//, '')}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined {userData.joinedDate}</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-semibold mb-3">Connect</h3>
                <div className="flex gap-3">
                  {userData.socialLinks.github && (
                    <a 
                      href={`https://github.com/${userData.socialLinks.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  
                  {userData.socialLinks.twitter && (
                    <a 
                      href={`https://twitter.com/${userData.socialLinks.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  
                  {userData.socialLinks.linkedin && (
                    <a 
                      href={`https://linkedin.com/in/${userData.socialLinks.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  
                  {userData.email && (
                    <a 
                      href={`mailto:${userData.email}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:w-2/3">
          <Tabs defaultValue="ideas">
            <TabsList className="mb-6">
              <TabsTrigger value="ideas">Ideas</TabsTrigger>
              <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ideas">
              <h2 className="text-xl font-semibold mb-4">Ideas by {userData.name}</h2>
              <div className="space-y-4">
                {userData.ideas.map(idea => (
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
                          <div className="text-sm text-muted-foreground">
                            Created on {idea.createdAt}
                          </div>
                        </div>
                        <Button variant="default" size="sm" asChild>
                          <a href={`/idea/${idea.id}`}>View</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {userData.ideas.length === 0 && (
                <div className="text-center py-12">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No ideas yet</h3>
                  <p className="text-muted-foreground">
                    {userData.name} hasn't shared any ideas yet
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="collaborations">
              <h2 className="text-xl font-semibold mb-4">Collaborations</h2>
              <div className="space-y-4">
                {userData.collaborations.map(collab => (
                  <Card key={collab.id} className="idea-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded mr-2">
                              {collab.category}
                            </span>
                            <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                              {collab.role}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{collab.title}</h3>
                          <p className="text-muted-foreground mb-4">
                            {collab.description}
                          </p>
                          <div className="text-sm text-muted-foreground">
                            Joined on {collab.joinedAt}
                          </div>
                        </div>
                        <Button variant="default" size="sm" asChild>
                          <a href={`/idea/${collab.id}`}>View</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {userData.collaborations.length === 0 && (
                <div className="text-center py-12">
                  <User className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No collaborations yet</h3>
                  <p className="text-muted-foreground">
                    {userData.name} isn't collaborating on any ideas yet
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="achievements">
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <div className="space-y-4">
                {userData.achievements.map(achievement => (
                  <Card key={achievement.id}>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-primary/10 rounded-full p-3 mr-4">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Awarded in {achievement.awardedAt}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {userData.achievements.length === 0 && (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
                  <p className="text-muted-foreground">
                    {userData.name} hasn't earned any achievements yet
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
