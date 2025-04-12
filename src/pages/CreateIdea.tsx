
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Lightbulb, 
  Plus, 
  X, 
  Upload, 
  FileText,
  Sparkles,
  EyeOff
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const categories = [
  "Web App", 
  "Mobile App", 
  "Desktop App",
  "Startup",
  "Design",
  "Open Source",
  "Game",
  "Hardware",
  "Other"
];

const statuses = ["Concept", "Prototype", "MVP", "On Hold"];

const CreateIdea = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Concept');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isNdaRequired, setIsNdaRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // In a real app, this would be a proper form validation with react-hook-form
  
  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag) && tags.length < 10) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };
  
  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };
  
  const handleGenerateTags = () => {
    if (description.length < 10) {
      toast({
        title: "Description too short",
        description: "Please add a more detailed description to generate tags.",
      });
      return;
    }
    
    // Mock AI-generated tags
    const aiTags = ["innovation", "tech", "productivity", "mobile"];
    setTags([...new Set([...tags, ...aiTags])]);
    
    toast({
      title: "Tags Generated",
      description: "Tags have been generated based on your description.",
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !description || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Idea Created",
        description: "Your idea has been successfully created.",
      });
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Idea</h1>
          <p className="text-muted-foreground">
            Share your unfinished project with the community
          </p>
        </div>
        <Card className="p-2 bg-primary/10 border-none">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">
              Ideas with clear descriptions get <span className="text-primary">3x</span> more collaborators
            </p>
          </div>
        </Card>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell us about your idea
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                placeholder="Give your idea a clear, descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Be specific and concise (e.g., "AI-Powered Habit Tracker App")
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your idea, its purpose, and what makes it unique..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                The more details you provide, the better potential collaborators can understand your vision
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((stat) => (
                      <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How far along is your idea?
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add tags to help others discover your idea"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateTags}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Auto
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Add up to 10 tags. Press enter or click "+" to add.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Supporting Materials</CardTitle>
            <CardDescription>
              Attach files, links, or other resources to better illustrate your idea
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Attach Files</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                <input 
                  type="file" 
                  className="hidden" 
                  id="file-upload"
                  onChange={handleFileChange}
                  multiple
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="font-medium">Drag files here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload images, PDFs, design files, or other related documents
                  </p>
                </label>
              </div>
              
              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Uploaded files:</p>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveFile(file)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Repository (optional)</Label>
              <Input 
                id="github" 
                placeholder="https://github.com/username/repo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="figma">Figma/Design Link (optional)</Label>
              <Input 
                id="figma" 
                placeholder="https://figma.com/..."
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Privacy & Collaboration</CardTitle>
            <CardDescription>
              Control who can see your idea and how others can interact with it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Private Idea</h3>
                <p className="text-sm text-muted-foreground">
                  Only visible to users you specifically invite
                </p>
              </div>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Require NDA</h3>
                <p className="text-sm text-muted-foreground">
                  Users must sign an NDA before viewing full details
                </p>
              </div>
              <Switch
                checked={isNdaRequired}
                onCheckedChange={setIsNdaRequired}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="collaboration">Collaboration Preferences</Label>
              <Select defaultValue="open">
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open to Collaboration</SelectItem>
                  <SelectItem value="selective">Selective Collaboration</SelectItem>
                  <SelectItem value="closed">Not Looking for Collaborators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          
          <div className="flex items-center gap-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Draft Saved",
                  description: "Your idea has been saved as a draft.",
                });
              }}
            >
              Save Draft
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Idea"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateIdea;
