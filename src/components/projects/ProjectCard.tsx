
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Project } from "@/types/project";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: Project;
}

const stageColors = {
  'idea': 'bg-yellow-500',
  'half-built': 'bg-blue-500',
  'ready': 'bg-green-500',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link to={`/idea/${project.id}`}>
      <Card className="h-full transition-all hover:shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl line-clamp-1">{project.title}</CardTitle>
            <Badge 
              className={`${
                stageColors[project.stage as keyof typeof stageColors] || 'bg-gray-500'
              } text-white`}
            >
              {project.stage}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.owner_avatar || ''} alt={project.owner_username} />
              <AvatarFallback>{project.owner_name?.[0] || project.owner_username?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <span>{project.owner_username}</span>
            <span className="text-xs text-muted-foreground">
              · {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {project.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 justify-between text-sm">
          <div>
            {project.price ? (
              <span className="font-semibold">${project.price.toLocaleString()}</span>
            ) : (
              <span className="text-muted-foreground">Price not set</span>
            )}
          </div>
          {project.licensing && (
            <Badge variant="secondary">{project.licensing}</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
