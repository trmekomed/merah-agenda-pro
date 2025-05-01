import { useState } from 'react';
import ActivityItem from './ActivityItem';
import { formatDayAndDate } from '@/utils/dateUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from '@/types/activity';
import { useActivities } from '@/hooks/use-activities';
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
    deleteActivity
  } = useActivities(date);
  const handleUpdate = (id: string, data: Partial<Activity>) => {
    updateActivity({
      id,
      data
    });
  };
  const handleDelete = (id: string) => {
    deleteActivity(id);
  };
  return <div className="mt-6">
      <h2 className="font-semibold mb-4 text-white text-base">
        {formatDayAndDate(date)}
      </h2>
      
      <div className="mt-2 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-merah-500 uppercase text-sm font-normal">Kegiatan</h3>
          <span className="text-white bg-merah-700 rounded-full px-3 py-1 text-sm">
            {activities.length} Kegiatan
          </span>
        </div>
      </div>

      {isLoading ? Array(3).fill(0).map((_, i) => <div key={i} className="mb-4">
            <Skeleton className="h-24 w-full bg-dark-600" />
          </div>) : activities.length === 0 ? <div className="text-center py-8 text-slate-400">
          Tidak ada kegiatan pada hari ini.
        </div> : activities.map(activity => <ActivityItem key={activity.id} activity={activity} onUpdate={handleUpdate} onDelete={handleDelete} />)}
    </div>;
};
export default ActivityList;