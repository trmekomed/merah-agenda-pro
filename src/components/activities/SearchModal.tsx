
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Activity } from '@/types/activity';
import { getAllActivities } from '@/services/activityService';
import { formatTime } from '@/utils/dateUtils';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Search } from 'lucide-react';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectActivity: (date: Date) => void;
}

const SearchModal = ({ open, onOpenChange, onSelectActivity }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const data = await getAllActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchActivities();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredActivities([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = activities.filter(activity => 
      activity.title.toLowerCase().includes(term) || 
      activity.location.toLowerCase().includes(term) ||
      activity.label.toLowerCase().includes(term)
    );
    
    setFilteredActivities(filtered);
  }, [searchTerm, activities]);

  const handleSelectActivity = (activity: Activity) => {
    const date = parseISO(activity.start_time);
    onSelectActivity(date);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-700 text-white border-dark-600 max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Cari Kegiatan</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari berdasarkan judul, lokasi, atau label..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-dark-600 border-dark-500 text-white"
            autoFocus
          />
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4 text-slate-400">Memuat...</div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-4 text-slate-400">
              {searchTerm.trim() === '' ? 'Mulai mengetik untuk mencari' : 'Tidak ada hasil ditemukan'}
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredActivities.map(activity => (
                <li 
                  key={activity.id} 
                  className="p-3 rounded-md bg-dark-600 hover:bg-dark-500 cursor-pointer"
                  onClick={() => handleSelectActivity(activity)}
                >
                  <h3 className="font-medium text-white">{activity.title}</h3>
                  <div className="flex items-center text-sm text-slate-300 mt-1">
                    <span className="mr-2">{format(parseISO(activity.start_time), "d MMM yyyy", { locale: id })}</span>
                    <span>{formatTime(activity.start_time)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs px-2 py-1 rounded-md bg-dark-700">
                      {activity.location}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-md bg-dark-700">
                      {activity.label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
