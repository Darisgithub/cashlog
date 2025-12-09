import { useState } from 'react';
import { supabase } from '../lib/supaClient';
import Swal from 'sweetalert2';

function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = isLogin
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

            if (error) throw error;

            if (!isLogin) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registrasi Berhasil',
                    text: 'Silakan cek email Anda untuk verifikasi atau login langsung jika tidak perlu verifikasi.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: error.error_description || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                    {isLogin ? 'Selamat Datang' : 'Buat Akun'}
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                    {isLogin ? 'Login untuk mengelola keuangan Anda' : 'Daftar untuk mulai mencatat keuangan'}
                </p>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                            placeholder="Masukan email anda"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                            placeholder="Masukan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                        {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
