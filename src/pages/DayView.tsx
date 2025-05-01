
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parseISO } from 'date-fns';
import ActivityList from '@/components/activities/ActivityList';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import ActivityForm from '@/components/activities/ActivityForm';
import { Plus, ArrowLeft, Calendar as CalendarIcon, Search, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { formatDayAndDate } from '@/utils/dateUtils';
import { useAuth } from '@/context/AuthContext';
import SearchModal from '@/components/activities/SearchModal';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useActivities } from '@/hooks/use-activities';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const DayViewContent = () => {
  const { date } = useParams<{ date: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { createActivity } = useActivities();

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
      
      createActivity(activityData);
      setIsAddDialogOpen(false);
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
      <header className="bg-dark-800 border-b border-dark-600 py-3 px-3 md:py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size={isMobile ? "icon-xs" : "icon"} 
              onClick={handleBackToCalendar} 
              className="mr-2 text-white hover:text-merah-500 hover:bg-dark-600"
            >
              <ArrowLeft className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
            </Button>
            <h1 className={cn(
              "text-merah-500 font-bold",
              isMobile ? "text-base" : "text-2xl"
            )}>Kalender Relasi Media</h1>
          </div>
          <div className="flex items-center">
            <CalendarIcon className={cn(
              "mr-2 text-merah-500",
              isMobile ? "h-4 w-4" : "h-5 w-5"
            )} />
            <span className={cn(
              "font-medium",
              isMobile ? "text-xs" : "text-sm" 
            )}>
              {formatDayAndDate(selectedDate)}
            </span>
          </div>
        </div>
      </header>

      <main className={cn(
        "container mx-auto px-3 py-4",
        isMobile ? "max-w-full" : "max-w-3xl md:px-4 md:py-6"
      )}>
        <ActivityList date={selectedDate} />
      </main>

      {/* Floating Action Buttons */}
      <div className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center",
        isMobile ? "space-x-2" : "space-x-4"
      )}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "rounded-full bg-dark-600 flex items-center justify-center shadow-lg text-white",
            isMobile ? "h-10 w-10" : "h-12 w-12"
          )}
          onClick={() => setIsSearchModalOpen(true)}
        >
          <Search className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "rounded-full bg-merah-700 flex items-center justify-center shadow-lg",
            isMobile ? "h-14 w-14" : "h-16 w-16"
          )}
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className={isMobile ? "h-7 w-7" : "h-8 w-8"} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "rounded-full bg-dark-600 flex items-center justify-center shadow-lg text-white",
            isMobile ? "h-10 w-10" : "h-12 w-12"
          )}
          onClick={handleTableViewClick}
        >
          <Table2 className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
        </motion.button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className={cn(
          "bg-dark-700 text-white border-dark-600",
          isMobile ? "w-[calc(100%-24px)] max-h-[80vh] p-3 max-w-none" : "max-w-md"
        )}>
          <DialogTitle className={cn(
            "font-bold text-white",
            isMobile ? "text-lg" : "text-xl"
          )}>Tambah Kegiatan Baru</DialogTitle>
          <DialogDescription className={cn(
            "text-slate-400",
            isMobile && "text-sm"
          )}>
            Isi semua kolom untuk menambahkan kegiatan ke kalender.
          </DialogDescription>
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
              created_by: user?.email || '' 
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

const DayView = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DayViewContent />
    </QueryClientProvider>
  );
};

export default DayView;
