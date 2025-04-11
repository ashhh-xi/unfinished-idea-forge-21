
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProjectDetails } from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import { ShoppingCart, MessageSquare, Users, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const IdeaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProjectDetails(id || "");
  const { user } = useAuth();
  
  const isOwner = user?.id === project?.owner_id;
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <p className="mb-6">The project you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/browse">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/browse" className="text-sm text-muted-foreground flex items-center mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Link>
        
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <Badge 
                className={`${
                  project.stage === 'idea' ? 'bg-yellow-500' : 
                  project.stage === 'half-built' ? 'bg-blue-500' : 
                  'bg-green-500'
                } text-white`}
              >
                {project.stage}
              </Badge>
            </div>
            
            <div className="flex items-center mt-3 space-x-4">
              <Link to={`/profile/${project.owner_id}`} className="flex items-center space-x-2 hover:underline">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={project.owner_avatar || ''} alt={project.owner_username} />
                  <AvatarFallback>{project.owner_name?.[0] || project.owner_username?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{project.owner_username}</span>
              </Link>
              <span className="text-muted-foreground text-sm">
                Posted {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
              </span>
              {project.updated_at !== project.created_at && (
                <span className="text-muted-foreground text-sm">
                  (Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })})
                </span>
              )}
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Description */}
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{project.description}</p>
          </div>
          
          {/* Project details */}
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Stage</p>
                <p className="font-medium">{project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}</p>
              </div>
              {project.licensing && (
                <div>
                  <p className="text-sm text-muted-foreground">Licensing</p>
                  <p className="font-medium">{project.licensing}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">
                  {project.price ? `$${project.price.toLocaleString()}` : 'Not for sale'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{format(new Date(project.created_at), 'PPP')}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-4">
            {!isOwner && user && (
              <>
                {project.price ? (
                  <Button className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Purchase for ${project.price.toLocaleString()}
                  </Button>
                ) : null}
                
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Request to Collaborate
                </Button>
              </>
            )}
            
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </Button>
            
            {isOwner && (
              <Button variant="outline" className="gap-2">
                Edit Project
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
