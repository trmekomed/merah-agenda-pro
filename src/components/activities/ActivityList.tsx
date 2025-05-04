import { useState } from 'react';
import ActivityItem from './ActivityItem';
import { formatDayAndDate } from '@/utils/dateUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from '@/types/activity';
import { useActivities } from '@/hooks/use-activities';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ActivityForm from './ActivityForm';
import { CalendarOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuth } from '@/context/AuthContext';
import { getHolidayInfo } from '@/utils/holidaysUtils';
import { format } from 'date-fns';

interface ActivityListProps {
  date: Date;
}

const ActivityList = ({
  date
}: ActivityListProps) => {
  const {
    activities,
    isLoading,
    updateActivity,
    deleteActivity,
    createActivity
  } = useActivities(date);

  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [duplicateActivity, setDuplicateActivity] = useState<Activity | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useAuth();
  
  const holidayInfo = getHolidayInfo();
  const dateKey = format(date, 'yyyy-MM-dd');
  const holidayName = holidayInfo.get(dateKey);

  const handleUpdate = (id: string, data: Partial<Activity>) => {
    updateActivity({
      id,
      data
    });
  };

  const handleDelete = (id: string) => {
    deleteActivity(id);
  };

  const handleDuplicate = (activity: Activity) => {
    // Create a copy of the activity with today's date
    const today = new Date();
    const startTime = new Date(activity.start_time);
    const endTime = new Date(activity.end_time);
    
    // Set today's date but keep original time
    const newStartTime = new Date(today);
    newStartTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    
    const newEndTime = new Date(today);
    newEndTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
    
    // Ensure end time is after start time
    if (newEndTime <= newStartTime) {
      newEndTime.setTime(newStartTime.getTime() + (60 * 60 * 1000)); // Add 1 hour
    }
    
    const duplicateData = {
      ...activity,
      title: `${activity.title} (Copy)`,
      start_time: newStartTime.toISOString(),
      end_time: newEndTime.toISOString(),
    };
    
    setDuplicateActivity(duplicateData);
    setIsDuplicateDialogOpen(true);
  };

  const handleDuplicateSubmit = (data: any) => {
    if (user) {
      createActivity({
        ...data,
        created_by: user.email || ''
      });
      setIsDuplicateDialogOpen(false);
    }
  };

  return (
    <div className="mt-6 pb-24">
      <h2 className="font-semibold mb-4 text-white text-base">
        {formatDayAndDate(date)}
      </h2>
      
      {holidayName && (
        <div className="mb-4 p-3 bg-dark-600/50 border border-merah-500/30 rounded-lg">
          <p className="text-merah-400 text-sm font-medium">
            {holidayName} <span className="text-xs text-slate-400">(Hari Libur)</span>
          </p>
        </div>
      )}
      
      <div className="mt-2 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-merah-500 uppercase text-sm font-normal">Kegiatan</h3>
          <span className="text-white bg-merah-700 rounded-full px-3 py-1 text-sm">
            {activities.length} Kegiatan
          </span>
        </div>
      </div>

      {isLoading ? (
        Array(3).fill(0).map((_, i) => (
          <div key={i} className="mb-4">
            <Skeleton className="h-24 w-full bg-dark-600" />
          </div>
        ))
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-dark-600/20 rounded-lg border border-dark-500">
          <CalendarOff className="mx-auto h-12 w-12 text-slate-500 mb-3" />
          <p className="text-slate-400">Tidak ada kegiatan pada hari ini.</p>
        </div>
      ) : (
        activities.map(activity => (
          <ActivityItem 
            key={activity.id} 
            activity={activity} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        ))
      )}

      {/* Dialog for duplicating activity */}
      <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <DialogContent className={cn(
          "bg-dark-700 text-white border-dark-600",
          isMobile ? "w-[calc(100%-24px)] max-h-[80vh] overflow-y-auto p-3 max-w-none" : "max-w-md"
        )}>
          <DialogTitle className={cn(
            "font-bold text-white",
            isMobile ? "text-lg" : "text-xl"
          )}>
            Duplikat Kegiatan
          </DialogTitle>
          {duplicateActivity && (
            <ActivityForm 
              initialData={duplicateActivity} 
              onSubmit={handleDuplicateSubmit} 
              onCancel={() => setIsDuplicateDialogOpen(false)} 
              mode="create" 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityList;
