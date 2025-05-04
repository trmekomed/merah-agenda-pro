
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '@/types/activity';
import { getAllActivities } from '@/services/activityService';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowLeft, ArrowUpDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatTime } from '@/utils/dateUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const TableView = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Activity>('start_time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState({
    label: '',
    location: '',
  });
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const data = await getAllActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleSort = (field: keyof Activity) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const isDateInRange = (dateStr: string) => {
    const date = parseISO(dateStr);
    
    if (!dateRange.from && !dateRange.to) return true;
    
    if (dateRange.from && !dateRange.to) {
      return isWithinInterval(date, {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.from)
      });
    }
    
    if (!dateRange.from && dateRange.to) {
      return isWithinInterval(date, {
        start: startOfDay(new Date(0)), // Beginning of time
        end: endOfDay(dateRange.to)
      });
    }
    
    if (dateRange.from && dateRange.to) {
      return isWithinInterval(date, {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to)
      });
    }
    
    return true;
  };

  const filteredAndSortedActivities = () => {
    let result = [...activities];
    
    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter(activity => isDateInRange(activity.start_time));
    }
    
    // Apply other filters
    if (filter.label) {
      result = result.filter(activity => activity.label === filter.label);
    }
    if (filter.location) {
      result = result.filter(activity => activity.location === filter.location);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'start_time' || sortField === 'end_time') {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = String(a[sortField]).toLowerCase();
        const valueB = String(b[sortField]).toLowerCase();
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });
    
    return result;
  };

  const paginatedActivities = () => {
    const filtered = filteredAndSortedActivities();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredAndSortedActivities().length / itemsPerPage);

  const handleBackClick = () => {
    navigate('/');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return "Semua Tanggal";
    
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`;
    }
    
    if (dateRange.from) {
      return `${format(dateRange.from, 'dd/MM/yyyy')} - ...`;
    }
    
    if (dateRange.to) {
      return `... - ${format(dateRange.to, 'dd/MM/yyyy')}`;
    }
    
    return "Semua Tanggal";
  };
  
  return (
    <div className="min-h-screen bg-dark-700 text-white">
      <header className="bg-dark-800 border-b border-dark-600 py-4 px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBackClick} className="mr-2 text-white hover:text-merah-500 hover:bg-dark-600">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-merah-500">Daftar Kegiatan</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filters Section */}
        <div className="bg-dark-600 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">Filter</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Date Range Filter */}
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1">Rentang Tanggal</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-dark-500 bg-dark-700",
                      !dateRange && "text-slate-400"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dark-700 border-dark-500" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={setDateRange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                  <div className="flex items-center justify-between p-3 border-t border-dark-500">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDateRange({ from: undefined, to: undefined })}
                      className="text-merah-500 hover:text-merah-400"
                    >
                      Reset
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => document.body.click()} // Close the popover
                      className="bg-merah-700 hover:bg-merah-600"
                    >
                      Terapkan
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Label Filter */}
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1">Label</label>
              <select
                value={filter.label}
                onChange={(e) => setFilter({...filter, label: e.target.value})}
                className="w-full bg-dark-700 border border-dark-500 rounded-md text-sm py-2 px-3"
              >
                <option value="">Semua Label</option>
                <option value="RO 1">RO 1</option>
                <option value="RO 2">RO 2</option>
                <option value="RO 3">RO 3</option>
              </select>
            </div>
            
            {/* Location Filter */}
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1">Lokasi</label>
              <select
                value={filter.location}
                onChange={(e) => setFilter({...filter, location: e.target.value})}
                className="w-full bg-dark-700 border border-dark-500 rounded-md text-sm py-2 px-3"
              >
                <option value="">Semua Lokasi</option>
                <option value="Kantor">Kantor</option>
                <option value="Online">Online</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Luar Kota">Luar Kota</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-dark-600 rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-dark-700 border-b border-dark-500">
                  <th className="p-4 border-b border-dark-500">
                    <button 
                      className="flex items-center text-slate-300 hover:text-white"
                      onClick={() => handleSort('title')}
                    >
                      Judul <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="p-4 border-b border-dark-500">
                    <button 
                      className="flex items-center text-slate-300 hover:text-white"
                      onClick={() => handleSort('start_time')}
                    >
                      Tanggal <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="p-4 border-b border-dark-500">
                    <button 
                      className="flex items-center text-slate-300 hover:text-white"
                      onClick={() => handleSort('start_time')}
                    >
                      Waktu <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="p-4 border-b border-dark-500">
                    <button 
                      className="flex items-center text-slate-300 hover:text-white"
                      onClick={() => handleSort('location')}
                    >
                      Lokasi <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="p-4 border-b border-dark-500">
                    <button 
                      className="flex items-center text-slate-300 hover:text-white"
                      onClick={() => handleSort('label')}
                    >
                      Label <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="p-4 border-b border-dark-500"><Skeleton className="h-6 w-full bg-dark-700" /></td>
                      <td className="p-4 border-b border-dark-500"><Skeleton className="h-6 w-24 bg-dark-700" /></td>
                      <td className="p-4 border-b border-dark-500"><Skeleton className="h-6 w-16 bg-dark-700" /></td>
                      <td className="p-4 border-b border-dark-500"><Skeleton className="h-6 w-16 bg-dark-700" /></td>
                      <td className="p-4 border-b border-dark-500"><Skeleton className="h-6 w-16 bg-dark-700" /></td>
                    </tr>
                  ))
                ) : paginatedActivities().length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      Tidak ada kegiatan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginatedActivities().map((activity) => (
                    <tr key={activity.id} className="hover:bg-dark-500/50 transition-colors">
                      <td className="p-4 border-b border-dark-500">
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          {activity.description && (
                            <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                              {activity.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 border-b border-dark-500">
                        {format(parseISO(activity.start_time), 'EEE, d MMM yyyy', { locale: id })}
                      </td>
                      <td className="p-4 border-b border-dark-500">
                        {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
                      </td>
                      <td className="p-4 border-b border-dark-500">
                        <span className="px-2 py-1 text-xs rounded-full bg-dark-500">
                          {activity.location}
                        </span>
                      </td>
                      <td className="p-4 border-b border-dark-500">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.label === 'RO 1' ? 'bg-blue-900 text-blue-100' :
                          activity.label === 'RO 2' ? 'bg-green-900 text-green-100' : 
                          'bg-yellow-900 text-yellow-100'
                        }`}>
                          {activity.label}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!isLoading && totalPages > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-dark-500">
              <div className="text-sm text-slate-400">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedActivities().length)} dari {filteredAndSortedActivities().length} kegiatan
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="border-dark-500 bg-dark-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(index + 1)}
                    className={cn(
                      "hidden md:inline-flex",
                      currentPage === index + 1 
                        ? "bg-merah-700 text-white hover:bg-merah-600" 
                        : "border-dark-500 bg-dark-700"
                    )}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="border-dark-500 bg-dark-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TableView;
