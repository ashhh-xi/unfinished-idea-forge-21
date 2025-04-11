
import React, { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import ProjectCard from "@/components/projects/ProjectCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BrowseIdeas = () => {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data: projects, isLoading, error } = useProjects();
  
  // Extract all unique tags from projects
  const allTags = Array.from(
    new Set(
      projects?.flatMap((project) => project.tags || []) || []
    )
  ).sort();
  
  // Filter projects based on search term and selected tags
  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = search
      ? project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase())
      : true;
      
    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.every((tag) => project.tags?.includes(tag))
        : true;
        
    return matchesSearch && matchesTags;
  });
  
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Ideas</h1>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-lg"
          />
          
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 20).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading projects. Please try again later.</p>
          </div>
        ) : filteredProjects?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No projects found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseIdeas;
