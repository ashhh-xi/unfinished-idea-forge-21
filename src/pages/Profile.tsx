
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/types/profile";
import { Project } from "@/types/project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from "@/components/projects/ProjectCard";
import { format } from "date-fns";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isOwnProfile = user?.id === id;
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async (): Promise<Profile | null> => {
      try {
        const response = await api.get(`/auth/profile/${id}`);
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.error || "Failed to fetch profile");
        }
      } catch (error: any) {
        toast.error(error.message || "Error fetching profile");
        return null;
      }
    },
    enabled: !!id,
  });
  
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["userProjects", id],
    queryFn: async (): Promise<Project[]> => {
      try {
        const response = await api.get(`/projects/user/${id}`);
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.error || "Failed to fetch projects");
        }
      } catch (error: any) {
        toast.error(error.message || "Error fetching projects");
        return [];
      }
    },
    enabled: !!id,
  });
  
  if (profileLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-32 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p>The user profile you're looking for doesn't exist or you don't have permission to view it.</p>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.username} />
            <AvatarFallback className="text-2xl">{profile.full_name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <div className="bg-muted px-3 py-1 rounded-full text-xs">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </div>
              <div className="bg-muted px-3 py-1 rounded-full text-xs">
                Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
              </div>
            </div>
            {profile.bio && (
              <p className="mt-4 max-w-2xl">{profile.bio}</p>
            )}
          </div>
        </div>
        
        {/* Tabs for different content */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            {isOwnProfile && (
              <>
                <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="projects">
            {projectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : projects?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  {isOwnProfile ? "You haven't created any projects yet." : "This user hasn't created any projects yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </TabsContent>
          
          {isOwnProfile && (
            <>
              <TabsContent value="collaborations">
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">Your collaboration requests will appear here.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="purchases">
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">Your purchases will appear here.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">Your notifications will appear here.</p>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
