
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllActivities, createActivity, updateActivity, deleteActivity } from '@/services/activityService';
import { Activity, CreateActivityDTO } from '@/types/activity';
import { getActivitiesForDay } from '@/utils/dateUtils';
import { toast } from '@/components/ui/sonner';

export function useActivities(date?: Date) {
  const queryClient = useQueryClient();
  
  // Query for fetching all activities with react-query
  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: getAllActivities,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Filter activities for specific day if date is provided
  const filteredActivities = date 
    ? getActivitiesForDay(activities, date) 
    : activities;
  
  // Mutation for creating a new activity
  const createMutation = useMutation({
    mutationFn: (newActivity: CreateActivityDTO) => createActivity(newActivity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success("Kegiatan berhasil ditambahkan");
    },
    onError: (error) => {
      console.error("Failed to create activity:", error);
      toast.error("Gagal menambahkan kegiatan");
    }
  });
  
  // Mutation for updating an activity
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Activity> }) => 
      updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success("Kegiatan berhasil diperbarui");
    },
    onError: (error) => {
      console.error("Failed to update activity:", error);
      toast.error("Gagal memperbarui kegiatan");
    }
  });
  
  // Mutation for deleting an activity
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success("Kegiatan berhasil dihapus");
    },
    onError: (error) => {
      console.error("Failed to delete activity:", error);
      toast.error("Gagal menghapus kegiatan");
    }
  });
  
  return {
    activities: filteredActivities,
    allActivities: activities,
    isLoading,
    error,
    createActivity: createMutation.mutate,
    updateActivity: updateMutation.mutate,
    deleteActivity: deleteMutation.mutate,
  };
}
