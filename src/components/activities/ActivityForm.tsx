
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
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Activity, ActivityLabel, ActivityLocation } from '@/types/activity';
import { calculateDurationInMinutes, formatDuration } from '@/utils/dateUtils';
import { parseISO } from 'date-fns';

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
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

const ActivityForm = ({ initialData, onSubmit, onCancel, mode }: ActivityFormProps) => {
  const [duration, setDuration] = useState('');

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      start_time: parseISO(initialData.start_time),
      end_time: parseISO(initialData.end_time),
    } : {
      title: '',
      start_time: new Date(),
      end_time: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
      description: '',
      label: 'RO 1' as ActivityLabel,
      location: 'Kantor' as ActivityLocation,
    },
  });

  const startTime = form.watch('start_time');
  const endTime = form.watch('end_time');

  useEffect(() => {
    if (startTime && endTime) {
      const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      setDuration(formatDuration(durationMinutes));
    }
  }, [startTime, endTime]);

  const handleSubmit = (data: ActivityFormData) => {
    const formattedData = {
      ...data,
      start_time: data.start_time.toISOString(),
      end_time: data.end_time.toISOString(),
    };
    onSubmit(formattedData);
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-4 text-white">
        {mode === 'create' ? 'Tambah Kegiatan Baru' : 'Edit Kegiatan'}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kegiatan</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Masukkan nama kegiatan" 
                    {...field} 
                    className="bg-dark-600 border-dark-500 text-white" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Mulai</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      date={field.value}
                      setDate={field.onChange}
                      className="bg-dark-600 border-dark-500 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Selesai</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      date={field.value}
                      setDate={field.onChange}
                      className="bg-dark-600 border-dark-500 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-dark-600 p-3 rounded-md border border-dark-500">
            <p className="text-sm text-slate-300">Durasi: <span className="font-medium text-white">{duration}</span></p>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keterangan</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Masukkan keterangan kegiatan" 
                    {...field} 
                    className="bg-dark-600 border-dark-500 text-white min-h-[100px]" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-dark-600 border-dark-500 text-white">
                        <SelectValue placeholder="Pilih label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark-600 border-dark-500 text-white">
                      <SelectItem value="RO 1">RO 1</SelectItem>
                      <SelectItem value="RO 2">RO 2</SelectItem>
                      <SelectItem value="RO 3">RO 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-dark-600 border-dark-500 text-white">
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="border-merah-700 text-merah-500 hover:bg-merah-700/20">
              Batal
            </Button>
            <Button type="submit" className="bg-merah-700 hover:bg-merah-800 text-white">
              {mode === 'create' ? 'Tambah Kegiatan' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ActivityForm;
