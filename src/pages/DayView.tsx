
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import { id } from 'date-fns/locale';
import ActivityList from '@/components/activities/ActivityList';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ActivityForm from '@/components/activities/ActivityForm';
import { Plus, ArrowLeft, Calendar as CalendarIcon, Search, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createActivity } from '@/services/activityService';
import { toast } from '@/components/ui/sonner';
import { formatDayAndDate } from '@/utils/dateUtils';
import { useAuth } from '@/context/AuthContext';
import SearchModal from '@/components/activities/SearchModal';
import { motion } from 'framer-motion';

const DayView = () => {
  const { date } = useParams<{ date: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, navigate, isLoading]);

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
    if (!user) {
      toast.error("Anda harus login untuk menambahkan kegiatan");
      navigate('/login');
      return;
    }
    
    try {
      // Add the user's email to the created_by field
      const activityData = {
        ...data,
        created_by: user.email || ''
      };
      
      await createActivity(activityData);
      setIsAddDialogOpen(false);
      setRefresh(!refresh);
      toast.success("Kegiatan berhasil ditambahkan");
    } catch (error) {
      console.error("Failed to add activity:", error);
      toast.error("Gagal menambahkan kegiatan");
    }
  };

  const handleTableViewClick = () => {
    navigate('/table');
  };

  return (
    <div className="min-h-screen bg-dark-700 text-white">
      <header className="bg-dark-800 border-b border-dark-600 py-4 px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBackToCalendar} className="mr-2 text-white hover:text-merah-500 hover:bg-dark-600">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-merah-500">Kalender Relasi Media</h1>
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
        <ActivityList date={selectedDate} key={`${selectedDate.toISOString()}-${refresh}`} />
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="h-12 w-12 rounded-full bg-dark-600 flex items-center justify-center shadow-lg text-white"
          onClick={() => setIsSearchModalOpen(true)}
        >
          <Search className="h-5 w-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="h-16 w-16 rounded-full bg-merah-700 flex items-center justify-center shadow-lg"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-8 w-8" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="h-12 w-12 rounded-full bg-dark-600 flex items-center justify-center shadow-lg text-white"
          onClick={handleTableViewClick}
        >
          <Table2 className="h-5 w-5" />
        </motion.button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              id: '',
              created_by: user?.email || '' // Add the missing created_by field
            }} 
          />
        </DialogContent>
      </Dialog>

      <SearchModal 
        open={isSearchModalOpen} 
        onOpenChange={setIsSearchModalOpen} 
        onSelectActivity={setSelectedDate}
      />
    </div>
  );
};

export default DayView;
