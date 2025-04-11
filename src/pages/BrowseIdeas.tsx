
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Bookmark,
  Grid2x2, 
  List,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

// Mock ideas data
const ideasData = [
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
  },
  {
    id: 4,
    title: "Augmented Reality Educational Platform",
    description: "AR platform for interactive learning experiences in STEM subjects for K-12 students.",
    category: "Education",
    status: "Prototype",
    author: "Maria Rodriguez",
    likes: 72,
    views: 843,
    image: "https://images.unsplash.com/photo-1607275887866-440d21712bb5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 5,
    title: "Decentralized P2P Marketplace",
    description: "A blockchain-based marketplace for trading goods and services without intermediaries.",
    category: "Web App",
    status: "MVP",
    author: "James Wilson",
    likes: 104,
    views: 1192,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 6,
    title: "Fitness Gamification Platform",
    description: "Turn regular workouts into RPG-style adventures with real-world rewards.",
    category: "Mobile App",
    status: "Concept",
    author: "Emma Thompson",
    likes: 67,
    views: 721,
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

// Category and status options
const categories = ["All", "Web App", "Mobile App", "Design", "Startup", "Education"];
const statuses = ["All", "Concept", "Prototype", "MVP", "On Hold"];

const BrowseIdeas = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["All"]);
  
  const toggleCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      const newSelected = selectedCategories.includes("All")
        ? [category]
        : selectedCategories.includes(category)
          ? selectedCategories.filter(c => c !== category)
          : [...selectedCategories, category];
      
      setSelectedCategories(newSelected.length ? newSelected : ["All"]);
    }
  };
  
  const toggleStatus = (status: string) => {
    if (status === "All") {
      setSelectedStatuses(["All"]);
    } else {
      const newSelected = selectedStatuses.includes("All")
        ? [status]
        : selectedStatuses.includes(status)
          ? selectedStatuses.filter(s => s !== status)
          : [...selectedStatuses, status];
      
      setSelectedStatuses(newSelected.length ? newSelected : ["All"]);
    }
  };
  
  const filteredIdeas = ideasData.filter(idea => {
    const categoryMatch = selectedCategories.includes("All") || selectedCategories.includes(idea.category);
    const statusMatch = selectedStatuses.includes("All") || selectedStatuses.includes(idea.status);
    return categoryMatch && statusMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Browse Ideas</h1>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ideas by title, description, or author..."
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Categories
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Status
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none rounded-l-md"
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none rounded-r-md"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Ideas Grid/List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
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
      ) : (
        <div className="space-y-4">
          {filteredIdeas.map((idea) => (
            <Link to={`/idea/${idea.id}`} key={idea.id}>
              <Card className="idea-card overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img 
                      src={idea.image} 
                      alt={idea.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="md:w-3/4 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-1 rounded">
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm">By {idea.author}</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Bookmark className="h-4 w-4 mr-1" />
                        {idea.likes}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No ideas match your filters</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategories(["All"]);
              setSelectedStatuses(["All"]);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrowseIdeas;
