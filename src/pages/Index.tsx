import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '@/components/calendar/Calendar';
import ActivityList from '@/components/activities/ActivityList';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import ActivityForm from '@/components/activities/ActivityForm';
import { Plus, Search, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createActivity } from '@/services/activityService';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import SearchModal from '@/components/activities/SearchModal';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
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

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Berhasil keluar");
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal keluar");
    }
  };

  const handleTableViewClick = () => {
    navigate('/table');
  };

  return (
    <div className="min-h-screen bg-dark-700 text-white">
      <header className="bg-dark-800 border-b border-dark-600 py-3 px-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          <h1 className={cn(
            "text-merah-500 font-medium",
            isMobile ? "text-sm" : "text-lg"
          )}>Kalender Relasi Media</h1>
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <span className={cn(
                  "text-slate-300",
                  isMobile ? "text-xs" : "text-sm"
                )}>{user.email}</span>
                <Button 
                  onClick={handleLogout} 
                  variant="ghost" 
                  size={isMobile ? "xs" : "sm"}
                  className="text-white hover:text-merah-500"
                >
                  Keluar
                </Button>
              </>
            ) : isLoading ? (
              <span className={cn(
                "text-slate-300",
                isMobile ? "text-xs" : "text-sm"
              )}>Memuat...</span>
            ) : (
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline"
                size={isMobile ? "xs" : "sm"}
                className="border-merah-500 text-merah-500 hover:bg-merah-500 hover:text-white"
              >
                Masuk
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className={cn(
        "container mx-auto px-3 py-4 md:px-4 md:py-6",
        isMobile ? "max-w-full" : "max-w-5xl"
      )}>
        <div className={cn(
          "grid gap-4 md:gap-8",
          isMobile ? "grid-cols-1" : "grid-cols-[1fr_1.5fr]"
        )}>
          <div>
            <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />
          </div>
          <div>
            <ActivityList date={selectedDate} key={`${selectedDate.toISOString()}-${refresh}`} />
          </div>
        </div>
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
          onClick={() => {
            if (user) {
              setIsAddDialogOpen(true);
            } else {
              toast.error("Anda harus login untuk menambahkan kegiatan");
              navigate('/login');
            }
          }}
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
          isMobile ? "w-[95%] max-w-[95%] p-4" : "max-w-md"
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

export default Index;
