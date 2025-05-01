
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('trm.ekomed@gmail.com');
  const [password, setPassword] = useState('kalenderMRT');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleSignUp = async () => {
    setIsLoading(true);
    
    try {
      await signUp(email, password);
      toast({
        title: "Akun dibuat",
        description: "Silakan login dengan akun baru Anda",
      });
      
      // Automatically sign in after creating account
      try {
        await signIn(email, password);
        toast({
          title: "Login berhasil",
          description: "Selamat datang!",
        });
      } catch (signInError: any) {
        console.error('Auto sign in error:', signInError);
        // If an email confirmation is required, this will fail
        toast({
          title: "Pembuatan akun berhasil",
          description: "Silakan periksa email Anda untuk konfirmasi atau coba login.",
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Pendaftaran gagal",
        description: error.message || "Gagal membuat akun",
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

        <form onSubmit={handleSignIn} className="space-y-4">
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
          
          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm mb-2">Belum memiliki akun?</p>
            <Button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading}
              variant="outline"
              className="w-full border-merah-500 text-merah-500 hover:bg-merah-500 hover:text-white"
            >
              {isLoading ? 'Memproses...' : 'Daftar Akun Baru'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
