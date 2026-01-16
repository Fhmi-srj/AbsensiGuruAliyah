import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../../../../images/logo.png';

function GuruLayout({ children }) {
    const [fabOpen, setFabOpen] = useState(false);
    const navigate = useNavigate();

    const handleAbsensiClick = (type) => {
        setFabOpen(false);
        navigate(`/guru/absensi/${type}`);
    };

    const navItems = [
        { to: '/guru', icon: 'fas fa-home', label: 'Beranda', end: true },
        { to: '/guru/pencarian', icon: 'fas fa-search', label: 'Cari' },
        { type: 'fab' }, // Placeholder for FAB
        { to: '/guru/riwayat', icon: 'fas fa-history', label: 'Riwayat' },
        { to: '/guru/profil', icon: 'fas fa-user', label: 'Profil' },
    ];

    const fabOptions = [
        { type: 'mengajar', icon: 'fas fa-chalkboard-teacher', label: 'Mengajar', position: 'left' },
        { type: 'kegiatan', icon: 'fas fa-calendar-check', label: 'Kegiatan', position: 'top' },
        { type: 'rapat', icon: 'fas fa-users', label: 'Rapat', position: 'right' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
            {/* Desktop Block Message */}
            <div className="hidden md:flex fixed inset-0 bg-gradient-to-br from-green-600 to-green-800 z-50 items-center justify-center">
                <div className="text-center text-white p-8">
                    <i className="fas fa-mobile-alt text-6xl mb-4"></i>
                    <h1 className="text-2xl font-bold mb-2">Gunakan Perangkat Mobile</h1>
                    <p className="text-green-100">Aplikasi Guru hanya tersedia di perangkat mobile.</p>
                    <p className="text-green-200 text-sm mt-4">Silakan buka di smartphone atau tablet Anda.</p>
                </div>
            </div>

            {/* Header - Logo and App Name */}
            <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 md:hidden shadow-sm border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <img
                        src={logoImage}
                        alt="Logo MA Mamba'ul Huda"
                        className="w-10 h-10 object-contain"
                    />
                    <div>
                        <h1 className="font-bold text-green-800 text-sm leading-tight">MA Mamba'ul Huda</h1>
                        <p className="text-[10px] text-green-600">Sistem Absensi Guru</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/guru/profil')}
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                    <i className="fas fa-cog text-green-600 text-lg"></i>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto pb-24 md:hidden">
                {children}
            </main>

            {/* FAB Overlay */}
            {fabOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setFabOpen(false)}
                />
            )}

            {/* FAB Options - Arc Layout Above Navbar (matching reference design) */}
            <div className={`fixed z-50 md:hidden transition-all duration-300 ${fabOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ bottom: '100px', left: '50%', transform: 'translateX(-50%)' }}>

                {/* Left - Mengajar */}
                <button
                    onClick={() => handleAbsensiClick('mengajar')}
                    className={`absolute transition-all duration-300 cursor-pointer flex items-center justify-center ${fabOpen ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        left: '-80px',
                        top: '-20px',
                        transitionDelay: fabOpen ? '50ms' : '0ms',
                        transform: fabOpen ? 'scale(1)' : 'scale(0.5)'
                    }}
                >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <i className="fas fa-chalkboard-teacher text-white text-base"></i>
                    </div>
                </button>

                {/* Top Center - Kegiatan (highest position) */}
                <button
                    onClick={() => handleAbsensiClick('kegiatan')}
                    className={`absolute transition-all duration-300 cursor-pointer flex items-center justify-center ${fabOpen ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        left: '50%',
                        top: '-60px',
                        transitionDelay: fabOpen ? '100ms' : '0ms',
                        transform: `translateX(-50%) ${fabOpen ? 'scale(1)' : 'scale(0.5)'}`
                    }}
                >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <i className="fas fa-calendar-check text-white text-base"></i>
                    </div>
                </button>

                {/* Right - Rapat */}
                <button
                    onClick={() => handleAbsensiClick('rapat')}
                    className={`absolute transition-all duration-300 cursor-pointer flex items-center justify-center ${fabOpen ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        right: '-80px',
                        top: '-20px',
                        transitionDelay: fabOpen ? '150ms' : '0ms',
                        transform: fabOpen ? 'scale(1)' : 'scale(0.5)'
                    }}
                >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <i className="fas fa-users text-white text-base"></i>
                    </div>
                </button>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden shadow-lg">
                <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
                    {navItems.map((item, idx) => {
                        if (item.type === 'fab') {
                            return (
                                <button
                                    key="fab"
                                    onClick={() => setFabOpen(!fabOpen)}
                                    className={`-mt-8 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer border-4 border-white ${fabOpen
                                        ? 'bg-red-500 rotate-45'
                                        : 'bg-gradient-to-br from-green-500 to-green-700'
                                        }`}
                                >
                                    <i className={`${fabOpen ? 'fas fa-times' : 'fas fa-clipboard-check'} text-white text-xl`}></i>
                                </button>
                            );
                        }
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setFabOpen(false)}
                                className={({ isActive }) =>
                                    `flex flex-col items-center justify-center py-2 px-3 transition-colors ${isActive ? 'text-green-600' : 'text-gray-400 hover:text-green-500'
                                    }`
                                }
                            >
                                <i className={`${item.icon} text-lg`}></i>
                                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}

export default GuruLayout;
