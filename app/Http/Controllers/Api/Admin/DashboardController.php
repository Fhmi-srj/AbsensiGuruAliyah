<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Jadwal;
use App\Models\Kegiatan;
use App\Models\Ekskul;
use App\Models\Rapat;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $now = Carbon::now();
            $startOfMonth = $now->copy()->startOfMonth();
            $endOfMonth = $now->copy()->endOfMonth();

            // Count statistics
            $stats = [
                'total_siswa' => Siswa::count(),
                'siswa_aktif' => Siswa::where('status', 'Aktif')->count(),
                'total_guru' => Guru::count(),
                'guru_aktif' => Guru::where('status', 'Aktif')->count(),
                'total_kelas' => Kelas::count(),
                'kelas_aktif' => Kelas::where('status', 'Aktif')->count(),
                'total_mapel' => Mapel::count(),
                'mapel_aktif' => Mapel::where('status', 'Aktif')->count(),
                'total_jadwal' => Jadwal::count(),
                'total_kegiatan' => Kegiatan::count(),
                'kegiatan_aktif' => Kegiatan::where('status', 'Aktif')->count(),
                'total_ekskul' => Ekskul::count(),
                'ekskul_aktif' => Ekskul::where('status', 'Aktif')->count(),
                'total_rapat' => Rapat::count(),
                'rapat_bulan_ini' => Rapat::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get chart data for distributions
     */
    public function charts(): JsonResponse
    {
        try {
            // Siswa per kelas
            $siswaPerKelas = Kelas::withCount('siswa')
                ->where('status', 'Aktif')
                ->orderBy('tingkat')
                ->orderBy('nama_kelas')
                ->get()
                ->map(fn($k) => [
                    'label' => $k->nama_kelas,
                    'count' => $k->siswa_count
                ]);

            // Guru per jabatan
            $guruPerJabatan = Guru::where('status', 'Aktif')
                ->selectRaw('jabatan, COUNT(*) as count')
                ->groupBy('jabatan')
                ->get()
                ->map(fn($g) => [
                    'label' => $g->jabatan ?: 'Belum Ada',
                    'count' => $g->count
                ]);

            // Kegiatan per bulan (last 6 months)
            $kegiatanPerBulan = [];
            for ($i = 5; $i >= 0; $i--) {
                $month = Carbon::now()->subMonths($i);
                $count = Kegiatan::whereYear('waktu_mulai', $month->year)
                    ->whereMonth('waktu_mulai', $month->month)
                    ->count();
                $kegiatanPerBulan[] = [
                    'label' => $month->format('M Y'),
                    'count' => $count
                ];
            }

            // Ekskul per kategori
            $ekskulPerKategori = Ekskul::where('status', 'Aktif')
                ->selectRaw('kategori, COUNT(*) as count')
                ->groupBy('kategori')
                ->get()
                ->map(fn($e) => [
                    'label' => $e->kategori,
                    'count' => $e->count
                ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'siswa_per_kelas' => $siswaPerKelas,
                    'guru_per_jabatan' => $guruPerJabatan,
                    'kegiatan_per_bulan' => $kegiatanPerBulan,
                    'ekskul_per_kategori' => $ekskulPerKategori,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities
     */
    public function recentActivity(): JsonResponse
    {
        try {
            $now = Carbon::now();

            // Upcoming kegiatan (next 7 days)
            $upcomingKegiatan = Kegiatan::where('waktu_mulai', '>=', $now)
                ->where('waktu_mulai', '<=', $now->copy()->addDays(7))
                ->where('status', 'Aktif')
                ->orderBy('waktu_mulai')
                ->limit(5)
                ->get(['id', 'nama_kegiatan', 'waktu_mulai', 'tempat']);

            // Upcoming rapat (next 7 days)
            $upcomingRapat = Rapat::where('tanggal', '>=', $now->toDateString())
                ->where('tanggal', '<=', $now->copy()->addDays(7)->toDateString())
                ->whereIn('status', ['Dijadwalkan', 'Berlangsung'])
                ->orderBy('tanggal')
                ->orderBy('waktu_mulai')
                ->limit(5)
                ->get(['id', 'agenda_rapat', 'tanggal', 'waktu_mulai', 'tempat', 'status']);

            // Recent activities happened
            $recentKegiatan = Kegiatan::where('waktu_berakhir', '<', $now)
                ->orderBy('waktu_berakhir', 'desc')
                ->limit(3)
                ->get(['id', 'nama_kegiatan', 'waktu_berakhir', 'status']);

            return response()->json([
                'success' => true,
                'data' => [
                    'upcoming_kegiatan' => $upcomingKegiatan,
                    'upcoming_rapat' => $upcomingRapat,
                    'recent_kegiatan' => $recentKegiatan,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
