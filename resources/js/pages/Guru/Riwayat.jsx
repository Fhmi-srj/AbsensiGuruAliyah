import React, { useState } from 'react';

function Riwayat() {
    const [activeTab, setActiveTab] = useState('semua');

    const tabs = [
        { id: 'semua', label: 'Semua' },
        { id: 'mengajar', label: 'Mengajar' },
        { id: 'kegiatan', label: 'Kegiatan' },
        { id: 'rapat', label: 'Rapat' },
    ];

    const history = [
        { type: 'mengajar', title: 'Absensi Mengajar', desc: 'Matematika - X IPA 1', time: '07:45', date: 'Hari ini', icon: 'fas fa-chalkboard-teacher', color: 'bg-blue-500' },
        { type: 'mengajar', title: 'Absensi Mengajar', desc: 'Matematika - X IPA 2', time: '09:15', date: 'Hari ini', icon: 'fas fa-chalkboard-teacher', color: 'bg-blue-500' },
        { type: 'rapat', title: 'Absensi Rapat', desc: 'Rapat Koordinasi Bulanan', time: '14:00', date: 'Kemarin', icon: 'fas fa-users', color: 'bg-purple-500' },
        { type: 'kegiatan', title: 'Absensi Kegiatan', desc: 'Upacara Bendera', time: '07:00', date: '14 Jan 2026', icon: 'fas fa-calendar-check', color: 'bg-orange-500' },
        { type: 'mengajar', title: 'Absensi Mengajar', desc: 'Matematika - XI IPA 1', time: '10:45', date: '14 Jan 2026', icon: 'fas fa-chalkboard-teacher', color: 'bg-blue-500' },
    ];

    const filteredHistory = activeTab === 'semua'
        ? history
        : history.filter(h => h.type === activeTab);

    return (
        <div className="animate-fadeIn">
            {/* Tabs */}
            <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-gray-100">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* History List */}
            <div className="p-4 space-y-3">
                {filteredHistory.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <i className={`${item.icon} text-white`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-400">{item.date}</p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                        </div>
                    </div>
                ))}

                {filteredHistory.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-clock text-4xl text-gray-300 mb-3"></i>
                        <p className="text-gray-500">Belum ada riwayat</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Riwayat;
