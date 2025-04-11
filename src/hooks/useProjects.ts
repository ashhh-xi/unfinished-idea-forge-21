
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Project } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";

export const useProjects = (filters?: {
  tag?: string;
  stage?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: async (): Promise<Project[]> => {
      try {
        let query = supabase
          .from('project_details')
          .select('*')
          .eq('visibility', 'public');
        
        // Apply filters if any
        if (filters?.tag) {
          query = query.contains('tags', [filters.tag]);
        }
        
        if (filters?.stage) {
          query = query.eq('stage', filters.stage);
        }
        
        if (filters?.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (error: any) {
        toast.error(error.message || "Error fetching projects");
        return [];
      }
    },
  });
};

export const useProjectDetails = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async (): Promise<Project | null> => {
      if (!projectId) return null;
      
      try {
        const { data, error } = await supabase
          .from('project_details')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error: any) {
        toast.error(error.message || "Error fetching project details");
        return null;
      }
    },
    enabled: !!projectId,
  });
};

export const useUserProjects = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userProjects", userId],
    queryFn: async (): Promise<Project[]> => {
      if (!userId) return [];
      
      try {
        const { data, error } = await supabase
          .from('project_details')
          .select('*')
          .eq('owner_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (error: any) {
        toast.error(error.message || "Error fetching user projects");
        return [];
      }
    },
    enabled: !!userId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: (data, variables, context) => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create project");
    },
  });
};
