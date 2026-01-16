import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE, authFetch } from '../../config/api';

function Profil() {
    const { user } = useAuth();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Validate passwords match
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok' });
            setLoading(false);
            return;
        }

        // Validate password length
        if (passwordData.new_password.length < 6) {
            setMessage({ type: 'error', text: 'Password baru minimal 6 karakter' });
            setLoading(false);
            return;
        }

        try {
            const response = await authFetch(`${API_BASE}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Password berhasil diubah!' });
                setPasswordData({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                });
                setIsChangingPassword(false);
            } else {
                setMessage({ type: 'error', text: data.message || 'Gagal mengubah password' });
            }
        } catch (error) {
            console.error('Password change error:', error);
            setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' });
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            'operator': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Operator' },
            'kepala_sekolah': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Kepala Sekolah' },
            'guru': { bg: 'bg-green-100', text: 'text-green-800', label: 'Guru' }
        };
        return badges[role] || { bg: 'bg-gray-100', text: 'text-gray-800', label: role };
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const badge = getRoleBadge(user?.role);

    return (
        <div className="animate-fadeIn">
            <header className="mb-6">
                <h1 className="text-[#1f2937] font-semibold text-xl mb-1">
                    Profil Saya
                </h1>
                <p className="text-[12px] text-[#6b7280]">
                    Lihat dan kelola informasi akun Anda
                </p>
            </header>

            {/* Message Alert */}
            {message.text && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    <span className="text-sm">{message.text}</span>
                    <button
                        onClick={() => setMessage({ type: '', text: '' })}
                        className="ml-auto text-gray-500 hover:text-gray-700"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-center">
                        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-white text-3xl font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">{user?.name || 'User'}</h2>
                        <p className="text-gray-500 text-sm">@{user?.username || 'username'}</p>
                        <span className={`inline-block mt-3 px-3 py-1 ${badge.bg} ${badge.text} rounded-full text-xs font-medium`}>
                            {badge.label}
                        </span>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-gray-500">Status</span>
                            <span className={`flex items-center gap-1.5 ${user?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                <span className={`w-2 h-2 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {user?.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Login Terakhir</span>
                            <span className="text-gray-700 text-xs">{formatDate(user?.last_login_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Account Info & Security */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fas fa-user-circle text-green-600"></i>
                            Informasi Akun
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Nama Lengkap</label>
                                <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800">
                                    {user?.name || '-'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Username</label>
                                <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800">
                                    {user?.username || '-'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Role</label>
                                <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800">
                                    {badge.label}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">ID Pengguna</label>
                                <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800">
                                    #{user?.id || '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fas fa-shield-alt text-green-600"></i>
                            Keamanan Akun
                        </h3>

                        {!isChangingPassword ? (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-800">Password</h4>
                                    <p className="text-sm text-gray-500">Ubah password akun Anda secara berkala</p>
                                </div>
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                    <i className="fas fa-key mr-2"></i>
                                    Ubah Password
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password Saat Ini
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Konfirmasi Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.new_password_confirmation}
                                        onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <><i className="fas fa-spinner fa-spin mr-2"></i>Menyimpan...</>
                                        ) : (
                                            <><i className="fas fa-save mr-2"></i>Simpan Password</>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setPasswordData({
                                                current_password: '',
                                                new_password: '',
                                                new_password_confirmation: ''
                                            });
                                            setMessage({ type: '', text: '' });
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profil;
