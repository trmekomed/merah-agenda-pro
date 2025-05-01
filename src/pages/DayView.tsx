
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import { id } from 'date-fns/locale';
import ActivityList from '@/components/activities/ActivityList';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ActivityForm from '@/components/activities/ActivityForm';
import { Plus, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createActivity } from '@/services/activityService';
import { toast } from '@/components/ui/sonner';
import { formatDayAndDate } from '@/utils/dateUtils';

const DayView = () => {
  const { date } = useParams<{ date: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (date) {
      try {
        const parsedDate = parseISO(date);
        setSelectedDate(parsedDate);
      } catch (error) {
        console.error("Invalid date format:", error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [date, navigate]);

  const handleBackToCalendar = () => {
    navigate('/');
  };

  const handleAddActivity = async (data: any) => {
    try {
      await createActivity(data);
      setIsAddDialogOpen(false);
      setRefresh(!refresh);
      toast.success("Kegiatan berhasil ditambahkan");
    } catch (error) {
      console.error("Failed to add activity:", error);
      toast.error("Gagal menambahkan kegiatan");
    }
  };

  return (
    <div className="min-h-screen bg-dark-700 text-white">
      <header className="bg-dark-800 border-b border-dark-600 py-4 px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackToCalendar}
              className="mr-2 text-white hover:text-merah-500 hover:bg-dark-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-merah-500">Merah Agenda Pro</h1>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-merah-500" />
            <span className="text-sm font-medium">
              {formatDayAndDate(selectedDate)}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <ActivityList
          date={selectedDate}
          key={`${selectedDate.toISOString()}-${refresh}`}
        />
      </main>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-merah-700 hover:bg-merah-800 shadow-lg"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-dark-700 text-white border-dark-600 max-w-md">
          <ActivityForm
            onSubmit={handleAddActivity}
            onCancel={() => setIsAddDialogOpen(false)}
            mode="create"
            initialData={{
              title: '',
              start_time: selectedDate.toISOString(),
              end_time: new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString(),
              description: '',
              label: 'RO 1',
              location: 'Kantor',
              id: ''
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DayView;
