
import { Activity, CreateActivityDTO } from '@/types/activity';
import { supabase } from '@/integrations/supabase/client';

// Get all activities
export const getAllActivities = async (): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*');
  
  if (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
  
  return data || [];
};

// Get activity by ID
export const getActivityById = async (id: string): Promise<Activity | undefined> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching activity:", error);
    throw error;
  }
  
  return data;
};

// Create a new activity
export const createActivity = async (activityData: CreateActivityDTO): Promise<Activity> => {
  const { data, error } = await supabase
    .from('activities')
    .insert(activityData)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
  
  return data;
};

// Update an existing activity
export const updateActivity = async (id: string, activityData: Partial<Activity>): Promise<Activity | undefined> => {
  const { data, error } = await supabase
    .from('activities')
    .update(activityData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating activity:", error);
    throw error;
  }
  
  return data;
};

// Delete an activity
export const deleteActivity = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting activity:", error);
    throw error;
  }
  
  return true;
};
