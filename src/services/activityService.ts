
import { Activity, CreateActivityDTO } from '@/types/activity';
import { v4 as uuid } from 'uuid';

// Sample initial activities data
const initialActivities: Activity[] = [
  {
    id: uuid(),
    title: 'Rapat Tim Pengembangan',
    start_time: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    description: 'Membahas progres pengembangan produk bulan ini',
    label: 'RO 1',
    location: 'Kantor',
  },
  {
    id: uuid(),
    title: 'Presentasi dengan Klien',
    start_time: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    description: 'Presentasi hasil riset pasar untuk klien baru',
    label: 'RO 2',
    location: 'Online',
  }
];

// In-memory storage for activities
let activities: Activity[] = [...initialActivities];

// Get all activities
export const getAllActivities = async (): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...activities]), 300);
  });
};

// Get activity by ID
export const getActivityById = async (id: string): Promise<Activity | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(activities.find(activity => activity.id === id)), 300);
  });
};

// Create a new activity
export const createActivity = async (activityData: CreateActivityDTO): Promise<Activity> => {
  const newActivity: Activity = {
    id: uuid(),
    ...activityData
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      activities.push(newActivity);
      resolve(newActivity);
    }, 300);
  });
};

// Update an existing activity
export const updateActivity = async (id: string, activityData: Partial<Activity>): Promise<Activity | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = activities.findIndex(activity => activity.id === id);
      if (index !== -1) {
        activities[index] = { ...activities[index], ...activityData };
        resolve(activities[index]);
      } else {
        resolve(undefined);
      }
    }, 300);
  });
};

// Delete an activity
export const deleteActivity = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = activities.length;
      activities = activities.filter(activity => activity.id !== id);
      resolve(initialLength > activities.length);
    }, 300);
  });
};
