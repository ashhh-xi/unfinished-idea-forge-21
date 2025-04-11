
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Project } from "@/types/project";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      try {
        const response = await api.get("/projects/public");
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
  });
};

export const useProjectDetails = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async (): Promise<Project | null> => {
      if (!projectId) return null;
      
      try {
        const response = await api.get(`/projects/${projectId}`);
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.error || "Failed to fetch project details");
        }
      } catch (error: any) {
        toast.error(error.message || "Error fetching project details");
        return null;
      }
    },
    enabled: !!projectId,
  });
};
