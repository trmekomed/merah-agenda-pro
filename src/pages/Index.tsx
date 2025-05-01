import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '@/components/calendar/Calendar';
import ActivityList from '@/components/activities/ActivityList';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ActivityForm from '@/components/activities/ActivityForm';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createActivity } from '@/services/activityService';
import { toast } from '@/components/ui/sonner';
const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false); // To force a refresh of the activity list
  const navigate = useNavigate();
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  const handleAddActivity = async (data: any) => {
    try {
      await createActivity(data);
      setIsAddDialogOpen(false);
      setRefresh(!refresh); // Toggle refresh to re-fetch activities
      toast.success("Kegiatan berhasil ditambahkan");
    } catch (error) {
      console.error("Failed to add activity:", error);
      toast.error("Gagal menambahkan kegiatan");
    }
  };
  return <div className="min-h-screen bg-dark-700 text-white">
      <header className="bg-dark-800 border-b border-dark-600 py-4 px-4 md:px-8">
        <h1 className="text-merah-500 font-thin text-sm">Kalender Relasi Media</h1>
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-merah-700 hover:bg-merah-800 shadow-lg" size="icon">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-dark-700 text-white border-dark-600 max-w-md">
          <ActivityForm onSubmit={handleAddActivity} onCancel={() => setIsAddDialogOpen(false)} mode="create" />
        </DialogContent>
      </Dialog>
    </div>;
};
export default Index;