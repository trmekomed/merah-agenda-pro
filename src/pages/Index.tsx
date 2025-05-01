import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '@/components/calendar/Calendar';
import ActivityList from '@/components/activities/ActivityList';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ActivityForm from '@/components/activities/ActivityForm';
import { Plus, Search, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createActivity } from '@/services/activityService';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import SearchModal from '@/components/activities/SearchModal';
import { motion } from 'framer-motion';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();

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
      <header className="bg-dark-800 border-b border-dark-600 py-4 px-4 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-merah-500 font-medium text-lg">Kalender Relasi Media</h1>
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <span className="text-sm text-slate-300">{user.email}</span>
                <Button 
                  onClick={handleLogout} 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:text-merah-500"
                >
                  Keluar
                </Button>
              </>
            ) : isLoading ? (
              <span className="text-sm text-slate-300">Memuat...</span>
            ) : (
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline"
                className="border-merah-500 text-merah-500 hover:bg-merah-500 hover:text-white"
              >
                Masuk
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
          <div>
            <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />
          </div>
          <div>
            <ActivityList date={selectedDate} key={`${selectedDate.toISOString()}-${refresh}`} />
          </div>
        </div>
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
          onClick={() => {
            if (user) {
              setIsAddDialogOpen(true);
            } else {
              toast.error("Anda harus login untuk menambahkan kegiatan");
              navigate('/login');
            }
          }}
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

export default Index;
