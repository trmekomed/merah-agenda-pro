
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      toast({
        title: "Login berhasil",
        description: "Selamat datang kembali!",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login gagal",
        description: error.message || "Email atau password salah",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-700 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-800 rounded-lg shadow-lg p-6 border border-dark-600">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-merah-500">Kalender Relasi Media</h1>
          <p className="text-slate-400 mt-2">Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dark-700 border-dark-600 text-white w-full"
              placeholder="Masukkan email Anda"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-dark-700 border-dark-600 text-white w-full"
              placeholder="Masukkan password"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-merah-700 hover:bg-merah-800 text-white"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
