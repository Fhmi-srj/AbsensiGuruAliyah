import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';

function Beranda() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // State for dashboard data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        user: { name: '', nip: '', jabatan: '' },
        today: { date: '', scheduleCount: 0 },
        todaySchedule: [],
        todayActivities: [],
        todayMeetings: [],
        stats: { totalMengajar: 0, hadir: 0, izin: 0, sakit: 0, percentage: 0 },
        reminders: []
    });

    // Helper function untuk menentukan status berdasarkan waktu
    const getStatusColor = (status) => {
        switch (status) {
            case 'attended':
                return { border: 'border-l-green-500', bg: 'bg-green-500', text: 'text-green-600' };
            case 'ongoing':
            case 'missed':
                return { border: 'border-l-red-500', bg: 'bg-red-500', text: 'text-red-600' };
            case 'upcoming':
            default:
                return { border: 'border-l-blue-500', bg: 'bg-blue-500', text: 'text-blue-600' };
        }
    };

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                console.log('Fetching dashboard from:', '/guru-panel/dashboard');
                const response = await api.get('/guru-panel/dashboard');
                console.log('Dashboard response:', response.data);
                setDashboardData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard:', err);
                console.error('Error response:', err.response?.data);
                console.error('Error status:', err.response?.status);
                const errorMsg = err.response?.data?.message || err.message || 'Gagal memuat data dashboard';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);


    // Loading state
    if (loading) {
        return (
            <div className="p-4 space-y-4 animate-pulse">
                <div className="bg-green-200 rounded-2xl h-32"></div>
                <div className="bg-gray-200 rounded-2xl h-40"></div>
                <div className="bg-gray-200 rounded-2xl h-24"></div>
                <div className="bg-gray-200 rounded-2xl h-24"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <i className="fas fa-exclamation-circle text-red-500 text-2xl mb-2"></i>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    const { todaySchedule, todayActivities, todayMeetings, stats, reminders, today } = dashboardData;
    const userData = dashboardData.user;

    return (
        <div className="p-4 space-y-4 animate-fadeIn">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-4 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-2xl"></i>
                    </div>
                    <div className="flex-1">
                        <p className="text-green-100 text-xs">Selamat Datang,</p>
                        <h2 className="font-bold text-lg">{userData.name || user?.name || 'Guru'}</h2>
                        <p className="text-green-200 text-xs mt-0.5">
                            <i className="fas fa-id-badge mr-1"></i>
                            {userData.nip || 'NIP: -'} • {userData.jabatan || 'Guru'}
                        </p>
                    </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="text-green-100">
                        <i className="fas fa-calendar mr-1"></i>
                        {today.date || 'Memuat...'}
                    </span>
                    <span className="bg-white/20 px-2 py-1 rounded-full">
                        <i className="fas fa-chalkboard mr-1"></i>
                        {today.scheduleCount || 0} Jadwal Hari Ini
                    </span>
                </div>
            </div>

            {/* Statistik Absensi */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-chart-pie text-green-600"></i>
                    Statistik Absensi Bulan Ini
                </h3>

                {/* Simple Chart Visual */}
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                            <circle
                                cx="40" cy="40" r="32"
                                stroke="url(#greenGradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${stats.percentage * 2.01} 999`}
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="100%" stopColor="#16a34a" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-green-600">{stats.percentage}%</span>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-green-600 font-semibold">{stats.hadir}</p>
                            <p className="text-gray-500">Hadir</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-2">
                            <p className="text-yellow-600 font-semibold">{stats.izin}</p>
                            <p className="text-gray-500">Izin</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2">
                            <p className="text-red-600 font-semibold">{stats.sakit}</p>
                            <p className="text-gray-500">Sakit</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-600 font-semibold">{stats.totalMengajar}</p>
                            <p className="text-gray-500">Total</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jadwal Hari Ini - Horizontal Scroll */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 px-1">
                    <i className="fas fa-chalkboard-teacher text-green-600"></i>
                    Jadwal Mengajar Hari Ini
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                    {todaySchedule.length > 0 ? todaySchedule.map((item) => {
                        const colors = getStatusColor(item.status);
                        return (
                            <div key={item.id} className={`flex-shrink-0 w-40 bg-white rounded-xl p-3 shadow-sm border-l-4 ${colors.border}`}>
                                <div className="font-medium text-gray-800 text-sm mb-2">{item.subject}</div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">
                                        <i className="fas fa-door-open mr-1"></i>{item.class}
                                    </span>
                                    <span className={`${colors.text} font-semibold`}>{item.time}</span>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="flex-shrink-0 w-full bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm">
                            Tidak ada jadwal mengajar hari ini
                        </div>
                    )}
                </div>
            </div>

            {/* Jadwal Kegiatan - Horizontal Scroll (only show if data exists) */}
            {todayActivities.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 px-1">
                        <i className="fas fa-calendar-check text-green-500"></i>
                        Kegiatan Hari Ini
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                        {todayActivities.map((item) => {
                            const colors = getStatusColor(item.status);
                            return (
                                <div key={item.id} className={`flex-shrink-0 w-40 bg-white rounded-xl p-3 shadow-sm border-l-4 ${colors.border}`}>
                                    <div className="font-medium text-gray-800 text-sm mb-2">{item.name}</div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">
                                            <i className="fas fa-map-marker-alt mr-1"></i>{item.location}
                                        </span>
                                        <span className={`${colors.text} font-semibold`}>{item.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Jadwal Rapat - Horizontal Scroll (only show if data exists) */}
            {todayMeetings.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 px-1">
                        <i className="fas fa-users text-green-700"></i>
                        Rapat Hari Ini
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                        {todayMeetings.map((item) => {
                            const colors = getStatusColor(item.status);
                            return (
                                <div key={item.id} className={`flex-shrink-0 w-40 bg-white rounded-xl p-3 shadow-sm border-l-4 ${colors.border}`}>
                                    <div className="font-medium text-gray-800 text-sm mb-2">{item.name}</div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">
                                            <i className="fas fa-map-marker-alt mr-1"></i>{item.location}
                                        </span>
                                        <span className={`${colors.text} font-semibold`}>{item.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Menu Cepat Absensi */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-bolt text-green-500"></i>
                    Menu Cepat
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => navigate('/guru/absensi/mengajar')}
                        className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <i className="fas fa-chalkboard-teacher text-xl"></i>
                        <span className="text-[10px] font-medium">Mengajar</span>
                    </button>
                    <button
                        onClick={() => navigate('/guru/absensi/kegiatan')}
                        className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <i className="fas fa-calendar-check text-xl"></i>
                        <span className="text-[10px] font-medium">Kegiatan</span>
                    </button>
                    <button
                        onClick={() => navigate('/guru/absensi/rapat')}
                        className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <i className="fas fa-users text-xl"></i>
                        <span className="text-[10px] font-medium">Rapat</span>
                    </button>
                </div>
            </div>

            {/* Pengingat Penting */}
            {reminders.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 border border-red-100">
                    <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <i className="fas fa-bell text-red-500 animate-pulse"></i>
                        Pengingat Penting
                    </h3>
                    <div className="space-y-2">
                        {reminders.map((reminder, index) => {
                            const isHigh = reminder.priority === 'high';
                            const isMedium = reminder.priority === 'medium';
                            const borderColor = isHigh ? 'border-l-red-500' : isMedium ? 'border-l-orange-500' : 'border-l-green-500';
                            const bgColor = isHigh ? 'bg-red-100' : isMedium ? 'bg-orange-100' : 'bg-green-100';
                            const iconColor = isHigh ? 'text-red-500' : isMedium ? 'text-orange-500' : 'text-green-500';
                            const icon = reminder.type === 'mengajar' ? 'fa-exclamation-triangle' :
                                reminder.type === 'kegiatan' ? 'fa-calendar-times' :
                                    reminder.type === 'rapat' ? 'fa-clock' : 'fa-chalkboard';

                            return (
                                <div key={index} className={`bg-white rounded-xl p-3 flex items-center gap-3 border-l-4 ${borderColor}`}>
                                    <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <i className={`fas ${icon} ${iconColor}`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{reminder.title}</p>
                                        <p className="text-xs text-gray-500">{reminder.description}</p>
                                    </div>
                                    {reminder.type === 'mengajar' || reminder.type === 'kegiatan' ? (
                                        <button
                                            onClick={() => navigate(`/guru/absensi/${reminder.type}`)}
                                            className={`text-xs ${isHigh ? 'bg-red-500' : 'bg-orange-500'} text-white px-3 py-1.5 rounded-full cursor-pointer hover:opacity-90`}
                                        >
                                            Absen
                                        </button>
                                    ) : reminder.countdown ? (
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                                            <i className="fas fa-hourglass-half mr-1"></i>{reminder.countdown}m
                                        </span>
                                    ) : (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                            <i className="fas fa-arrow-right mr-1"></i>Next
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Beranda;
