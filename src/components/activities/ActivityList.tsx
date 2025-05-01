import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Activity } from '@/types/activity';
import ActivityItem from './ActivityItem';
import { getAllActivities, updateActivity, deleteActivity } from '@/services/activityService';
import { getActivitiesForDay } from '@/utils/dateUtils';
import { formatDayAndDate } from '@/utils/dateUtils';
import { id } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface ActivityListProps {
  date: Date;
}

const ActivityList = ({ date }: ActivityListProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const data = await getAllActivities();
        setActivities(data);
        const filtered = getActivitiesForDay(data, date);
        setFilteredActivities(filtered);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [date]);

  const handleUpdate = async (id: string, data: Partial<Activity>) => {
    try {
      await updateActivity(id, data);
      const updatedActivities = await getAllActivities();
      setActivities(updatedActivities);
      setFilteredActivities(getActivitiesForDay(updatedActivities, date));
      toast({
        title: "Kegiatan diperbarui",
        description: "Kegiatan telah berhasil diperbarui",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to update activity:", error);
      toast({
        title: "Gagal memperbarui kegiatan",
        description: "Terjadi kesalahan saat memperbarui kegiatan",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity(id);
      const updatedActivities = await getAllActivities();
      setActivities(updatedActivities);
      setFilteredActivities(getActivitiesForDay(updatedActivities, date));
      toast({
        title: "Kegiatan dihapus",
        description: "Kegiatan telah berhasil dihapus",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to delete activity:", error);
      toast({
        title: "Gagal menghapus kegiatan",
        description: "Terjadi kesalahan saat menghapus kegiatan",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-white">
        {formatDayAndDate(date)}
      </h2>
      
      <div className="mt-2 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-merah-500 font-semibold uppercase">
            Kegiatan Hari Ini
          </h3>
          <span className="text-white bg-merah-700 rounded-full px-3 py-1 text-sm">
            {filteredActivities.length} Kegiatan
          </span>
        </div>
      </div>

      {isLoading ? (
        Array(3).fill(0).map((_, i) => (
          <div key={i} className="mb-4">
            <Skeleton className="h-24 w-full bg-dark-600" />
          </div>
        ))
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          Tidak ada kegiatan pada hari ini.
        </div>
      ) : (
        filteredActivities.map((activity) => (
          <ActivityItem 
            key={activity.id}
            activity={activity}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default ActivityList;
