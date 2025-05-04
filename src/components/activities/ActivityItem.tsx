
import { useState } from 'react';
import { Activity } from '@/types/activity';
import { formatTime } from '@/utils/dateUtils';
import { Bell, Copy, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ActivityForm from './ActivityForm';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ActivityItemProps {
  activity: Activity;
  onUpdate: (id: string, data: Partial<Activity>) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (activity: Activity) => void;
}

const ActivityItem = ({
  activity,
  onUpdate,
  onDelete,
  onDuplicate
}: ActivityItemProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'RO 1':
        return 'bg-blue-600 border-blue-500';
      case 'RO 2':
        return 'bg-green-600 border-green-500';
      case 'RO 3':
        return 'bg-yellow-600 border-yellow-500';
      default:
        return 'bg-gray-600 border-gray-500';
    }
  };

  const getBorderColor = (label: string) => {
    switch (label) {
      case 'RO 1':
        return 'border-l-blue-500';
      case 'RO 2':
        return 'border-l-green-500';
      case 'RO 3':
        return 'border-l-orange-500';
      default:
        return 'border-l-merah-700';
    }
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm("Anda yakin ingin menghapus kegiatan ini?")) {
      onDelete(activity.id);
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(activity);
    }
  };

  // Memastikan bahwa penanganan onOpenChange yang benar untuk dialog
  const handleDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "bg-dark-600 border-l-4 rounded-r-lg mb-4 shadow-md overflow-hidden",
          getBorderColor(activity.label)
        )}
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-white text-sm">{activity.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-dark-600 border-dark-500">
                <DropdownMenuItem onClick={handleEdit} className="text-white hover:bg-dark-500">
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate} className="text-white hover:bg-dark-500">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplikat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-merah-500 hover:bg-dark-500">
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-2 flex items-center">
            <Bell className="h-4 w-4 text-merah-500 mr-2" />
            <span className="text-merah-400 font-medium">
              {formatTime(activity.start_time)}
            </span>
          </div>
          
          <div className="mt-3 text-sm text-slate-300 line-clamp-2">
            {activity.description}
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-md text-white ${getLabelColor(activity.label)}`}>
                {activity.label}
              </span>
            </div>
            <div className="text-sm text-slate-400">
              {activity.location}
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={isEditDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={cn(
          "bg-dark-700 text-white border-dark-600",
          isMobile ? "w-[calc(100%-24px)] max-h-[80vh] overflow-y-auto p-3 max-w-none" : "max-w-md"
        )}>
          <ActivityForm 
            initialData={activity} 
            onSubmit={data => {
              onUpdate(activity.id, data);
              setIsEditDialogOpen(false);
            }} 
            onCancel={() => setIsEditDialogOpen(false)} 
            mode="edit" 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivityItem;
