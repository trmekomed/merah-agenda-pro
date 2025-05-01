import { useState } from 'react';
import { Activity } from '@/types/activity';
import { formatTime } from '@/utils/dateUtils';
import { Bell, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ActivityForm from './ActivityForm';
interface ActivityItemProps {
  activity: Activity;
  onUpdate: (id: string, data: Partial<Activity>) => void;
  onDelete: (id: string) => void;
}
const ActivityItem = ({
  activity,
  onUpdate,
  onDelete
}: ActivityItemProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const getLabelColor = (label: string) => {
    switch (label) {
      case 'RO 1':
        return 'bg-blue-600';
      case 'RO 2':
        return 'bg-green-600';
      case 'RO 3':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  const handleDelete = () => {
    if (confirm("Anda yakin ingin menghapus kegiatan ini?")) {
      onDelete(activity.id);
    }
  };
  return <>
      <div className="bg-dark-600 border-l-4 border-merah-700 rounded-r-lg mb-4 shadow-md overflow-hidden animate-slide-up">
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
          
          <div className="mt-3 text-sm text-slate-300">
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
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-dark-700 text-white border-dark-600">
          <ActivityForm initialData={activity} onSubmit={data => {
          onUpdate(activity.id, data);
          setIsEditDialogOpen(false);
        }} onCancel={() => setIsEditDialogOpen(false)} mode="edit" />
        </DialogContent>
      </Dialog>
    </>;
};
export default ActivityItem;