
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '@/types/activity';
import { getAllActivities } from '@/services/activityService';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowLeft, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/utils/dateUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';

const TableView = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Activity>('start_time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState({
    label: '',
    location: '',
  });
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

  const filteredAndSortedActivities = () => {
    let result = [...activities];
    
    // Apply filters
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

  const handleBackClick = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-dark-700 text-white">
      <header className="bg-dark-800 border-b border-dark-600 py-4 px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBackClick} className="mr-2 text-white hover:text-merah-500 hover:bg-dark-600">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-merah-500">Daftar Kegiatan</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <select
                value={filter.label}
                onChange={(e) => setFilter({...filter, label: e.target.value})}
                className="bg-dark-600 border border-dark-500 rounded-md text-sm py-1 px-2"
              >
                <option value="">Semua Label</option>
                <option value="RO 1">RO 1</option>
                <option value="RO 2">RO 2</option>
                <option value="RO 3">RO 3</option>
              </select>
            </div>
            <div className="flex items-center">
              <select
                value={filter.location}
                onChange={(e) => setFilter({...filter, location: e.target.value})}
                className="bg-dark-600 border border-dark-500 rounded-md text-sm py-1 px-2"
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
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-dark-600">
                <th className="p-3 border-b border-dark-500">
                  <button 
                    className="flex items-center text-slate-300 hover:text-white"
                    onClick={() => handleSort('title')}
                  >
                    Judul <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </th>
                <th className="p-3 border-b border-dark-500">
                  <button 
                    className="flex items-center text-slate-300 hover:text-white"
                    onClick={() => handleSort('start_time')}
                  >
                    Tanggal <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </th>
                <th className="p-3 border-b border-dark-500">
                  <button 
                    className="flex items-center text-slate-300 hover:text-white"
                    onClick={() => handleSort('start_time')}
                  >
                    Waktu <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </th>
                <th className="p-3 border-b border-dark-500">
                  <button 
                    className="flex items-center text-slate-300 hover:text-white"
                    onClick={() => handleSort('location')}
                  >
                    Lokasi <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </th>
                <th className="p-3 border-b border-dark-500">
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
                    <td className="p-3 border-b border-dark-500"><Skeleton className="h-6 w-full bg-dark-600" /></td>
                    <td className="p-3 border-b border-dark-500"><Skeleton className="h-6 w-24 bg-dark-600" /></td>
                    <td className="p-3 border-b border-dark-500"><Skeleton className="h-6 w-16 bg-dark-600" /></td>
                    <td className="p-3 border-b border-dark-500"><Skeleton className="h-6 w-16 bg-dark-600" /></td>
                    <td className="p-3 border-b border-dark-500"><Skeleton className="h-6 w-16 bg-dark-600" /></td>
                  </tr>
                ))
              ) : filteredAndSortedActivities().length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    Tidak ada kegiatan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredAndSortedActivities().map((activity) => (
                  <tr key={activity.id} className="hover:bg-dark-600">
                    <td className="p-3 border-b border-dark-500">{activity.title}</td>
                    <td className="p-3 border-b border-dark-500">
                      {format(parseISO(activity.start_time), 'EEE, d MMM yyyy', { locale: id })}
                    </td>
                    <td className="p-3 border-b border-dark-500">
                      {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
                    </td>
                    <td className="p-3 border-b border-dark-500">
                      <span className="px-2 py-1 text-xs rounded-full bg-dark-500">
                        {activity.location}
                      </span>
                    </td>
                    <td className="p-3 border-b border-dark-500">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.label === 'RO 1' ? 'bg-blue-900' :
                        activity.label === 'RO 2' ? 'bg-green-900' : 'bg-yellow-900'
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
      </main>
    </div>
  );
};

export default TableView;
