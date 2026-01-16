import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function Pengaturan() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('tampilan');
    const [settings, setSettings] = useState({
        // Tampilan
        sidebarCollapsed: localStorage.getItem('sidebar_collapsed') === 'true',
        darkMode: localStorage.getItem('dark_mode') === 'true',
        // Notifikasi
        notifikasiEmail: true,
        notifikasiBrowser: true,
        notifikasiKegiatan: true,
        notifikasiRapat: true,
    });
    const [logoutLoading, setLogoutLoading] = useState(false);

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));

        // Save to localStorage for persistence
        if (key === 'sidebarCollapsed') {
            localStorage.setItem('sidebar_collapsed', value);
        } else if (key === 'darkMode') {
            localStorage.setItem('dark_mode', value);
            // Note: Dark mode implementation would require additional CSS
        }
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        await logout();
    };

    const tabs = [
        { id: 'tampilan', label: 'Tampilan', icon: 'fa-palette' },
        { id: 'notifikasi', label: 'Notifikasi', icon: 'fa-bell' },
        { id: 'akun', label: 'Akun', icon: 'fa-user-cog' },
        { id: 'tentang', label: 'Tentang', icon: 'fa-info-circle' },
    ];

    return (
        <div className="animate-fadeIn">
            <header className="mb-6">
                <h1 className="text-[#1f2937] font-semibold text-xl mb-1">
                    Pengaturan
                </h1>
                <p className="text-[12px] text-[#6b7280]">
                    Konfigurasi sistem dan preferensi aplikasi
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === tab.id
                                        ? 'bg-green-50 text-green-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <i className={`fas ${tab.icon} w-5`}></i>
                                <span className="text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                        {/* Tampilan Tab */}
                        {activeTab === 'tampilan' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <i className="fas fa-palette text-green-600"></i>
                                    Pengaturan Tampilan
                                </h3>

                                {/* Sidebar Collapsed */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Sidebar Compact</h4>
                                        <p className="text-sm text-gray-500">Sidebar default dalam mode compact</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.sidebarCollapsed}
                                            onChange={(e) => handleSettingChange('sidebarCollapsed', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>

                                {/* Dark Mode */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Mode Gelap</h4>
                                        <p className="text-sm text-gray-500">Tampilan gelap untuk kenyamanan mata</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                            Coming Soon
                                        </span>
                                        <label className="relative inline-flex items-center cursor-not-allowed opacity-50">
                                            <input
                                                type="checkbox"
                                                checked={settings.darkMode}
                                                disabled
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifikasi Tab */}
                        {activeTab === 'notifikasi' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <i className="fas fa-bell text-green-600"></i>
                                    Pengaturan Notifikasi
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Notifikasi Browser</h4>
                                            <p className="text-sm text-gray-500">Terima notifikasi di browser</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                                Coming Soon
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Notifikasi Kegiatan</h4>
                                            <p className="text-sm text-gray-500">Pengingat kegiatan yang akan datang</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                                Coming Soon
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Notifikasi Rapat</h4>
                                            <p className="text-sm text-gray-500">Pengingat rapat yang dijadwalkan</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                                Coming Soon
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Akun Tab */}
                        {activeTab === 'akun' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <i className="fas fa-user-cog text-green-600"></i>
                                    Pengaturan Akun
                                </h3>

                                {/* Logout Section */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Keluar dari Akun</h4>
                                            <p className="text-sm text-gray-500">Akhiri sesi dan kembali ke halaman login</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            disabled={logoutLoading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            {logoutLoading ? (
                                                <><i className="fas fa-spinner fa-spin mr-2"></i>Keluar...</>
                                            ) : (
                                                <><i className="fas fa-sign-out-alt mr-2"></i>Keluar</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Clear Cache */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Hapus Cache Browser</h4>
                                            <p className="text-sm text-gray-500">Bersihkan data cache aplikasi</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                localStorage.clear();
                                                sessionStorage.clear();
                                                window.location.reload();
                                            }}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                        >
                                            <i className="fas fa-broom mr-2"></i>
                                            Hapus Cache
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                                    <h4 className="font-medium text-red-800 mb-2">
                                        <i className="fas fa-exclamation-triangle mr-2"></i>
                                        Zona Berbahaya
                                    </h4>
                                    <p className="text-sm text-red-600 mb-4">
                                        Tindakan berikut bersifat permanen dan tidak dapat dibatalkan.
                                    </p>
                                    <button
                                        disabled
                                        className="px-4 py-2 bg-red-100 text-red-400 rounded-lg text-sm font-medium cursor-not-allowed"
                                    >
                                        <i className="fas fa-trash mr-2"></i>
                                        Hapus Akun (Tidak Tersedia)
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tentang Tab */}
                        {activeTab === 'tentang' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <i className="fas fa-info-circle text-green-600"></i>
                                    Tentang Aplikasi
                                </h3>

                                <div className="text-center py-8">
                                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <i className="fas fa-school text-white text-3xl"></i>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">SIMAKA</h2>
                                    <p className="text-gray-500 text-sm">Sistem Informasi MA Al-Hikam</p>
                                    <p className="text-gray-400 text-xs mt-1">Versi 1.0.0</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                                        <i className="fas fa-code text-green-600 text-2xl mb-2"></i>
                                        <h4 className="font-medium text-gray-800 text-sm">Framework</h4>
                                        <p className="text-gray-500 text-xs">Laravel + React</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                                        <i className="fas fa-database text-green-600 text-2xl mb-2"></i>
                                        <h4 className="font-medium text-gray-800 text-sm">Database</h4>
                                        <p className="text-gray-500 text-xs">MySQL</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                                        <i className="fas fa-paint-brush text-green-600 text-2xl mb-2"></i>
                                        <h4 className="font-medium text-gray-800 text-sm">Styling</h4>
                                        <p className="text-gray-500 text-xs">Tailwind CSS</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                                        <i className="fas fa-shield-alt text-green-600 text-2xl mb-2"></i>
                                        <h4 className="font-medium text-gray-800 text-sm">Auth</h4>
                                        <p className="text-gray-500 text-xs">Laravel Sanctum</p>
                                    </div>
                                </div>

                                <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-100">
                                    <p>© 2026 MA Al-Hikam. All rights reserved.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pengaturan;
