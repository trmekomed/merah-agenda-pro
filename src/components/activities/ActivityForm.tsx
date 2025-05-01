
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SimpleDateTimeInput } from '@/components/ui/simple-date-time-input';
import { Activity, ActivityLabel, ActivityLocation } from '@/types/activity';
import { calculateDurationInMinutes, formatDuration } from '@/utils/dateUtils';
import { parseISO } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ActivityFormProps {
  initialData?: Activity;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const activityFormSchema = z.object({
  title: z.string().min(1, 'Judul kegiatan wajib diisi'),
  start_time: z.date(),
  end_time: z.date(),
  description: z.string().optional(),
  label: z.enum(['RO 1', 'RO 2', 'RO 3']),
  location: z.enum(['Kantor', 'Online', 'Jakarta', 'Luar Kota']),
}).refine(data => data.end_time > data.start_time, {
  message: "Waktu selesai harus lebih dari waktu mulai",
  path: ["end_time"],
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

const ActivityForm = ({ initialData, onSubmit, onCancel, mode }: ActivityFormProps) => {
  const [duration, setDuration] = useState('');
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Parse string dates to Date objects
  const getInitialValues = () => {
    if (initialData) {
      return {
        ...initialData,
        start_time: parseISO(initialData.start_time),
        end_time: parseISO(initialData.end_time),
      };
    }
    
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    return {
      title: '',
      start_time: now,
      end_time: oneHourLater,
      description: '',
      label: 'RO 1' as ActivityLabel,
      location: 'Kantor' as ActivityLocation,
    };
  };

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: getInitialValues(),
  });

  const startTime = form.watch('start_time');
  const endTime = form.watch('end_time');

  // Update duration when start or end time changes
  useEffect(() => {
    if (startTime && endTime) {
      const durationMinutes = Math.max(0, (endTime.getTime() - startTime.getTime()) / (1000 * 60));
      setDuration(formatDuration(durationMinutes));
      
      // If end time is before start time, update end time
      if (endTime < startTime) {
        const newEndTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later
        form.setValue('end_time', newEndTime);
      }
    }
  }, [startTime, endTime, form]);

  const handleSubmit = (data: ActivityFormData) => {
    // Format dates as ISO strings for API
    const formattedData = {
      ...data,
      start_time: data.start_time.toISOString(),
      end_time: data.end_time.toISOString(),
    };
    onSubmit(formattedData);
  };

  return (
    <div className="p-2 mt-4 max-h-[60vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(isMobile && "text-sm")}>Nama Kegiatan</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Masukkan nama kegiatan" 
                    {...field} 
                    className={cn(
                      "bg-dark-600 border-dark-500 text-white",
                      isMobile && "text-sm"
                    )}
                  />
                </FormControl>
                <FormMessage className={cn(isMobile && "text-xs")} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(isMobile && "text-sm")}>Waktu Mulai</FormLabel>
                <FormControl>
                  <SimpleDateTimeInput
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage className={cn(isMobile && "text-xs")} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(isMobile && "text-sm")}>Waktu Selesai</FormLabel>
                <FormControl>
                  <SimpleDateTimeInput
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage className={cn("text-merah-500", isMobile && "text-xs")} />
              </FormItem>
            )}
          />

          <div className={cn(
            "bg-dark-600 p-3 rounded-md border border-dark-500 flex items-center space-x-2",
            isMobile && "p-2"
          )}>
            <div className="flex-grow">
              <p className={cn(
                "text-slate-300",
                isMobile ? "text-xs" : "text-sm"
              )}>
                Durasi: <span className="font-medium text-white">{duration}</span>
              </p>
            </div>
            {endTime < startTime && (
              <div className={cn(
                "flex items-center text-merah-500",
                isMobile ? "text-xs" : "text-sm"
              )}>
                <AlertCircle className={cn("mr-1", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                <span>Waktu tidak valid</span>
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(isMobile && "text-sm")}>Keterangan</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Masukkan keterangan kegiatan" 
                    {...field}
                    className={cn(
                      "bg-dark-600 border-dark-500 text-white min-h-[80px]",
                      isMobile && "text-sm min-h-[60px]"
                    )}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage className={cn(isMobile && "text-xs")} />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isMobile && "text-sm")}>Label</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={cn(
                        "bg-dark-600 border-dark-500 text-white",
                        isMobile && "text-sm h-8"
                      )}>
                        <SelectValue placeholder="Pilih label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark-600 border-dark-500 text-white">
                      <SelectItem value="RO 1">RO 1</SelectItem>
                      <SelectItem value="RO 2">RO 2</SelectItem>
                      <SelectItem value="RO 3">RO 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className={cn(isMobile && "text-xs")} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isMobile && "text-sm")}>Lokasi</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={cn(
                        "bg-dark-600 border-dark-500 text-white",
                        isMobile && "text-sm h-8"
                      )}>
                        <SelectValue placeholder="Pilih lokasi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark-600 border-dark-500 text-white">
                      <SelectItem value="Kantor">Kantor</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Jakarta">Jakarta</SelectItem>
                      <SelectItem value="Luar Kota">Luar Kota</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className={cn(isMobile && "text-xs")} />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              size={isMobile ? "sm" : "default"}
              className="border-merah-700 text-merah-500 hover:bg-merah-700/20"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="bg-merah-700 hover:bg-merah-800 text-white"
              size={isMobile ? "sm" : "default"}
            >
              {mode === 'create' ? 'Tambah Kegiatan' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ActivityForm;
