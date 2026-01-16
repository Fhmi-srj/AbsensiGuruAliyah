import React, { useState } from 'react';

function AbsensiMengajar() {
    const [selectedDay, setSelectedDay] = useState('Kamis'); // Default hari ini
    const [selectedClass, setSelectedClass] = useState('');

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Helper function untuk menentukan status berdasarkan waktu
    const getStatusColor = (status) => {
        switch (status) {
            case 'attended':
                return { border: 'border-l-green-500', bg: 'bg-green-100', icon: 'text-green-500', label: 'Sudah Absen', labelBg: 'bg-green-100 text-green-700', ring: 'ring-green-500' };
            case 'ongoing':
            case 'missed':
                return { border: 'border-l-red-500', bg: 'bg-red-100', icon: 'text-red-500', label: status === 'ongoing' ? 'Belum Absen' : 'Terlewat', labelBg: 'bg-red-100 text-red-700', ring: 'ring-red-500' };
            case 'upcoming':
            default:
                return { border: 'border-l-blue-500', bg: 'bg-blue-100', icon: 'text-blue-500', label: 'Akan Datang', labelBg: 'bg-blue-100 text-blue-700', ring: 'ring-blue-500' };
        }
    };

    // Mock data jadwal seminggu (dummy)
    const weeklySchedule = {
        'Senin': [
            { id: 1, name: 'X IPA 1', subject: 'Matematika', time: '07:00 - 07:45', students: 30, status: 'attended' },
            { id: 2, name: 'X IPA 2', subject: 'Matematika', time: '08:30 - 09:15', students: 32, status: 'attended' },
        ],
        'Selasa': [
            { id: 3, name: 'XI IPA 1', subject: 'Matematika', time: '07:00 - 07:45', students: 28, status: 'attended' },
            { id: 4, name: 'XI IPA 2', subject: 'Matematika', time: '10:00 - 10:45', students: 30, status: 'attended' },
        ],
        'Rabu': [
            { id: 5, name: 'X IPA 1', subject: 'Matematika', time: '08:30 - 09:15', students: 30, status: 'attended' },
            { id: 6, name: 'XII IPA 1', subject: 'Matematika', time: '11:00 - 11:45', students: 26, status: 'attended' },
        ],
        'Kamis': [
            { id: 7, name: 'X IPA 1', subject: 'Matematika', time: '07:00 - 07:45', students: 30, status: 'attended' },
            { id: 8, name: 'X IPA 2', subject: 'Matematika', time: '08:30 - 09:15', students: 32, status: 'ongoing' },
            { id: 9, name: 'XI IPA 1', subject: 'Matematika', time: '10:00 - 10:45', students: 28, status: 'upcoming' },
            { id: 10, name: 'XI IPA 2', subject: 'Matematika', time: '11:00 - 11:45', students: 30, status: 'upcoming' },
        ],
        'Jumat': [
            { id: 11, name: 'XII IPA 1', subject: 'Matematika', time: '07:30 - 08:15', students: 26, status: 'upcoming' },
            { id: 12, name: 'XII IPA 2', subject: 'Matematika', time: '09:00 - 09:45', students: 28, status: 'upcoming' },
        ],
        'Sabtu': [],
    };

    const currentSchedule = weeklySchedule[selectedDay] || [];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-6 text-white">
                <h1 className="text-xl font-bold">Absensi Mengajar</h1>
                <p className="text-green-100 text-sm">Jadwal mengajar mingguan</p>
            </div>

            {/* Day Pills */}
            <div className="px-4 pt-4">
                <div className="bg-white rounded-xl p-2 shadow-sm flex gap-1 overflow-x-auto scrollbar-hide">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => {
                                setSelectedDay(day);
                                setSelectedClass('');
                            }}
                            className={`flex-1 min-w-[60px] py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedDay === day
                                ? 'bg-green-500 text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {day}
                        </button>
                    ))}
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

            {/* Class List */}
            <div className="p-4 space-y-3">
                {currentSchedule.length > 0 ? (
                    currentSchedule.map(cls => {
                        const colors = getStatusColor(cls.status);
                        return (
                            <button
                                key={cls.id}
                                onClick={() => setSelectedClass(cls.id)}
                                disabled={cls.status === 'attended'}
                                className={`w-full bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4 ${colors.border} ${selectedClass === cls.id ? `ring-2 ${colors.ring}` : ''
                                    } ${cls.status === 'attended' ? 'opacity-60' : ''}`}
                            >
                                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <i className={`fas fa-door-open ${colors.icon}`}></i>
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-semibold text-gray-800">{cls.subject}</p>
                                    <p className="text-xs text-gray-500">{cls.name} • {cls.students} siswa</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 mb-1">{cls.time}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors.labelBg}`}>
                                        {colors.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-calendar-times text-gray-400 text-2xl"></i>
                        </div>
                        <p className="text-gray-500 font-medium">Tidak ada jadwal</p>
                        <p className="text-gray-400 text-sm">Hari {selectedDay} tidak ada jadwal mengajar</p>
                    </div>
                )}

                {/* Start Button */}
                {selectedClass && (
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-4 font-semibold mt-4 cursor-pointer hover:shadow-lg transition-all">
                        <i className="fas fa-clipboard-check mr-2"></i>
                        Mulai Absensi
                    </button>
                )}
            </div>
        </div>
    );
}

export default AbsensiMengajar;
