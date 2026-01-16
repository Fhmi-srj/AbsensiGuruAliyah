import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AbsensiKegiatan() {
    const navigate = useNavigate();
    const [selectedActivity, setSelectedActivity] = useState('');

    // Helper function untuk menentukan status
    const getStatusColor = (status) => {
        switch (status) {
            case 'attended':
                return { border: 'border-l-green-500', bg: 'bg-green-100', icon: 'text-green-500', label: 'Sudah Absen', labelBg: 'bg-green-100 text-green-700' };
            case 'ongoing':
            case 'missed':
                return { border: 'border-l-red-500', bg: 'bg-red-100', icon: 'text-red-500', label: status === 'ongoing' ? 'Belum Absen' : 'Terlewat', labelBg: 'bg-red-100 text-red-700' };
            case 'upcoming':
            default:
                return { border: 'border-l-blue-500', bg: 'bg-blue-100', icon: 'text-blue-500', label: 'Akan Datang', labelBg: 'bg-blue-100 text-blue-700' };
        }
    };

    const activities = [
        { id: 1, name: 'Upacara Bendera', time: '07:00 - 08:00', location: 'Lapangan', status: 'missed' },
        { id: 2, name: 'Ekskul Pramuka', time: '14:00 - 16:00', location: 'Lapangan', status: 'upcoming' },
        { id: 3, name: 'Pembinaan Karakter', time: '16:00 - 17:00', location: 'Aula', status: 'upcoming' },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-6 text-white">
                <button onClick={() => navigate(-1)} className="mb-3 flex items-center gap-2 text-white/80 cursor-pointer">
                    <i className="fas fa-arrow-left"></i>
                    <span className="text-sm">Kembali</span>
                </button>
                <h1 className="text-xl font-bold">Absensi Kegiatan</h1>
                <p className="text-green-100 text-sm">Pilih kegiatan untuk mengisi absensi</p>
            </div>

            {/* Today's Info */}
            <div className="bg-white mx-4 -mt-3 rounded-xl shadow-sm p-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-calendar-check text-green-500 text-lg"></i>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Kamis, 16 Januari 2026</p>
                        <p className="text-sm text-gray-500">{activities.length} kegiatan hari ini</p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="px-4 pt-4 flex gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Sudah Absen
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span> Belum Absen
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Akan Datang
                </span>
            </div>

            {/* Activity List */}
            <div className="p-4 space-y-3">
                <h2 className="font-semibold text-gray-800">Pilih Kegiatan</h2>
                {activities.map(activity => {
                    const colors = getStatusColor(activity.status);
                    return (
                        <button
                            key={activity.id}
                            onClick={() => setSelectedActivity(activity.id)}
                            disabled={activity.status === 'attended'}
                            className={`w-full bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4 ${colors.border} ${selectedActivity === activity.id ? 'ring-2 ring-green-500' : ''
                                } ${activity.status === 'attended' ? 'opacity-60' : ''}`}
                        >
                            <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <i className={`fas fa-calendar-check ${colors.icon}`}></i>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-gray-800">{activity.name}</p>
                                <p className="text-xs text-gray-500"><i className="fas fa-map-marker-alt mr-1"></i>{activity.location}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 mb-1">{activity.time}</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors.labelBg}`}>
                                    {colors.label}
                                </span>
                            </div>
                        </button>
                    );
                })}

                {/* Start Button */}
                {selectedActivity && (
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-4 font-semibold mt-4 cursor-pointer hover:shadow-lg transition-all">
                        <i className="fas fa-clipboard-check mr-2"></i>
                        Mulai Absensi
                    </button>
                )}
            </div>
        </div>
    );
}

export default AbsensiKegiatan;
