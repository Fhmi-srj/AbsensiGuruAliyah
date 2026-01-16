import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE, authFetch } from '../../config/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    // Quick navigation cards
    const menuCards = [
        { to: '/data-induk/siswa', icon: 'fa-user-graduate', label: 'Siswa' },
        { to: '/data-induk/guru', icon: 'fa-chalkboard-teacher', label: 'Guru' },
        { to: '/data-induk/kelas', icon: 'fa-door-open', label: 'Kelas' },
        { to: '/data-induk/jadwal', icon: 'fa-calendar-alt', label: 'Jadwal' },
        { to: '/data-induk/mapel', icon: 'fa-book', label: 'Mapel' },
        { to: '/data-induk/kegiatan', icon: 'fa-tasks', label: 'Kegiatan' },
        { to: '/data-induk/ekskul', icon: 'fa-futbol', label: 'Ekskul' },
        { to: '/data-induk/rapat', icon: 'fa-users', label: 'Rapat' },
    ];

    // Fetch all dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, chartsRes, activityRes] = await Promise.all([
                    authFetch(`${API_BASE}/dashboard/statistics`),
                    authFetch(`${API_BASE}/dashboard/charts`),
                    authFetch(`${API_BASE}/dashboard/recent-activity`)
                ]);

                const statsData = await statsRes.json();
                const chartsData = await chartsRes.json();
                const activityData = await activityRes.json();

                if (statsData.success) setStats(statsData.data);
                if (chartsData.success) setCharts(chartsData.data);
                if (activityData.success) setActivity(activityData.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Chart colors
    const chartColors = [
        'rgba(34, 197, 94, 0.8)',   // green
        'rgba(59, 130, 246, 0.8)',  // blue
        'rgba(168, 85, 247, 0.8)',  // purple
        'rgba(249, 115, 22, 0.8)', // orange
        'rgba(236, 72, 153, 0.8)', // pink
        'rgba(20, 184, 166, 0.8)', // teal
        'rgba(239, 68, 68, 0.8)',  // red
        'rgba(234, 179, 8, 0.8)',  // yellow
    ];

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        return timeStr.substring(0, 5);
    };

    // Statistics cards data
    const statCards = stats ? [
        { label: 'Total Siswa', value: stats.total_siswa, sub: `${stats.siswa_aktif} aktif`, icon: 'fa-user-graduate', color: 'green' },
        { label: 'Total Guru', value: stats.total_guru, sub: `${stats.guru_aktif} aktif`, icon: 'fa-chalkboard-teacher', color: 'blue' },
        { label: 'Total Kelas', value: stats.total_kelas, sub: `${stats.kelas_aktif} aktif`, icon: 'fa-door-open', color: 'purple' },
        { label: 'Total Mapel', value: stats.total_mapel, sub: `${stats.mapel_aktif} aktif`, icon: 'fa-book', color: 'teal' },
        { label: 'Total Kegiatan', value: stats.total_kegiatan, sub: `${stats.kegiatan_aktif} aktif`, icon: 'fa-tasks', color: 'pink' },
        { label: 'Total Ekskul', value: stats.total_ekskul, sub: `${stats.ekskul_aktif} aktif`, icon: 'fa-futbol', color: 'indigo' },
        { label: 'Total Jadwal', value: stats.total_jadwal, sub: 'jadwal pelajaran', icon: 'fa-calendar-alt', color: 'orange' },
        { label: 'Rapat Bulan Ini', value: stats.rapat_bulan_ini, sub: `dari ${stats.total_rapat} total`, icon: 'fa-users', color: 'red' },
    ] : [];

    // Prepare chart data
    const siswaPerKelasData = charts?.siswa_per_kelas ? {
        labels: charts.siswa_per_kelas.map(d => d.label),
        datasets: [{
            label: 'Jumlah Siswa',
            data: charts.siswa_per_kelas.map(d => d.count),
            backgroundColor: chartColors,
            borderRadius: 6,
        }]
    } : null;

    const guruPerJabatanData = charts?.guru_per_jabatan ? {
        labels: charts.guru_per_jabatan.map(d => d.label),
        datasets: [{
            data: charts.guru_per_jabatan.map(d => d.count),
            backgroundColor: chartColors,
        }]
    } : null;

    const kegiatanPerBulanData = charts?.kegiatan_per_bulan ? {
        labels: charts.kegiatan_per_bulan.map(d => d.label),
        datasets: [{
            label: 'Jumlah Kegiatan',
            data: charts.kegiatan_per_bulan.map(d => d.count),
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.4,
            fill: true,
        }]
    } : null;

    const ekskulPerKategoriData = charts?.ekskul_per_kategori ? {
        labels: charts.ekskul_per_kategori.map(d => d.label),
        datasets: [{
            data: charts.ekskul_per_kategori.map(d => d.count),
            backgroundColor: chartColors.slice(0, 4),
        }]
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10, font: { size: 11 } } },
        }
    };

    if (loading) {
        return (
            <div className="animate-fadeIn flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-green-600 text-3xl mb-3"></i>
                    <p className="text-gray-500 text-sm">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn flex flex-col flex-grow max-w-full overflow-auto pb-6">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-[#1f2937] font-semibold text-lg mb-1 select-none">Dashboard</h1>
                <p className="text-[11px] text-[#6b7280] select-none">Selamat datang di Sistem Informasi MA Alhikam</p>
            </header>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{card.sub}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg bg-${card.color}-100 flex items-center justify-center`}>
                                <i className={`fas ${card.icon} text-${card.color}-600`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Menu Cepat</h2>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {menuCards.map((card, index) => (
                        <Link
                            key={index}
                            to={card.to}
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-green-50 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                                <i className={`fas ${card.icon} text-green-600 text-sm`}></i>
                            </div>
                            <span className="text-[10px] text-gray-600 text-center group-hover:text-green-700">{card.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Siswa per Kelas */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        <i className="fas fa-chart-bar text-green-600 mr-2"></i>
                        Distribusi Siswa per Kelas
                    </h3>
                    <div className="h-[200px]">
                        {siswaPerKelasData ? (
                            <Bar data={siswaPerKelasData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Tidak ada data</div>
                        )}
                    </div>
                </div>

                {/* Guru per Jabatan */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        <i className="fas fa-chart-pie text-blue-600 mr-2"></i>
                        Distribusi Guru per Jabatan
                    </h3>
                    <div className="h-[200px]">
                        {guruPerJabatanData && guruPerJabatanData.labels.length > 0 ? (
                            <Doughnut data={guruPerJabatanData} options={pieOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Tidak ada data</div>
                        )}
                    </div>
                </div>

                {/* Kegiatan per Bulan */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        <i className="fas fa-chart-line text-purple-600 mr-2"></i>
                        Kegiatan 6 Bulan Terakhir
                    </h3>
                    <div className="h-[200px]">
                        {kegiatanPerBulanData ? (
                            <Line data={kegiatanPerBulanData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Tidak ada data</div>
                        )}
                    </div>
                </div>

                {/* Ekskul per Kategori */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        <i className="fas fa-chart-pie text-orange-600 mr-2"></i>
                        Ekskul per Kategori
                    </h3>
                    <div className="h-[200px]">
                        {ekskulPerKategoriData && ekskulPerKategoriData.labels.length > 0 ? (
                            <Pie data={ekskulPerKategoriData} options={pieOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Tidak ada data</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upcoming Kegiatan */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                            <i className="fas fa-calendar-check text-green-600 mr-2"></i>
                            Kegiatan Mendatang
                        </h3>
                        <Link to="/data-induk/kegiatan" className="text-xs text-green-600 hover:text-green-700">
                            Lihat semua →
                        </Link>
                    </div>
                    {activity?.upcoming_kegiatan?.length > 0 ? (
                        <div className="space-y-2">
                            {activity.upcoming_kegiatan.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-tasks text-green-600 text-sm"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.nama_kegiatan}</p>
                                        <p className="text-[10px] text-gray-500">
                                            {formatDate(item.waktu_mulai)} • {item.tempat || '-'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-400 text-sm">
                            <i className="fas fa-calendar-times text-2xl mb-2"></i>
                            <p>Tidak ada kegiatan mendatang</p>
                        </div>
                    )}
                </div>

                {/* Upcoming Rapat */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                            <i className="fas fa-users text-blue-600 mr-2"></i>
                            Rapat Mendatang
                        </h3>
                        <Link to="/data-induk/rapat" className="text-xs text-green-600 hover:text-green-700">
                            Lihat semua →
                        </Link>
                    </div>
                    {activity?.upcoming_rapat?.length > 0 ? (
                        <div className="space-y-2">
                            {activity.upcoming_rapat.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-users text-blue-600 text-sm"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.agenda_rapat}</p>
                                        <p className="text-[10px] text-gray-500">
                                            {formatDate(item.tanggal)} • {formatTime(item.waktu_mulai)} • {item.tempat || '-'}
                                        </p>
                                    </div>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${item.status === 'Berlangsung' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-400 text-sm">
                            <i className="fas fa-calendar-times text-2xl mb-2"></i>
                            <p>Tidak ada rapat mendatang</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
