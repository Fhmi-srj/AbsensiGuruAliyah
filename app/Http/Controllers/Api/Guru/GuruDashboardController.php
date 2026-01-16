<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Kegiatan;
use App\Models\Rapat;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class GuruDashboardController extends Controller
{
    /**
     * Get dashboard data for the logged-in guru
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $guru = $user->guru;

        // If no guru relation, return fallback data with user info
        if (!$guru) {
            $today = Carbon::today();
            return response()->json([
                'user' => [
                    'name' => $user->name,
                    'nip' => '-',
                    'jabatan' => $user->role ?? 'User',
                ],
                'today' => [
                    'date' => $today->locale('id')->translatedFormat('l, d F Y'),
                    'scheduleCount' => 0,
                ],
                'todaySchedule' => [],
                'todayActivities' => [],
                'todayMeetings' => [],
                'stats' => [
                    'totalMengajar' => 0,
                    'hadir' => 0,
                    'izin' => 0,
                    'sakit' => 0,
                    'percentage' => 0,
                ],
                'reminders' => [],
            ]);
        }

        $today = Carbon::today();
        $dayName = $this->getDayName($today->dayOfWeek);
        $currentTime = Carbon::now()->format('H:i');

        // Get today's teaching schedule
        $todaySchedule = Jadwal::with(['mapel', 'kelas'])
            ->where('guru_id', $guru->id)
            ->where('hari', $dayName)
            ->where('status', 'Aktif')
            ->orderBy('jam_mulai')
            ->get()
            ->map(function ($jadwal) use ($currentTime) {
                return [
                    'id' => $jadwal->id,
                    'time' => substr($jadwal->jam_mulai, 0, 5),
                    'endTime' => substr($jadwal->jam_selesai, 0, 5),
                    'subject' => $jadwal->mapel->nama ?? 'N/A',
                    'class' => $jadwal->kelas->nama ?? 'N/A',
                    'status' => $this->getScheduleStatus($jadwal->jam_mulai, $jadwal->jam_selesai, $currentTime, false),
                ];
            });

        // Get today's activities
        $todayActivities = Kegiatan::whereDate('waktu_mulai', $today)
            ->where('status', 'Aktif')
            ->orderBy('waktu_mulai')
            ->get()
            ->map(function ($kegiatan) use ($currentTime) {
                $startTime = Carbon::parse($kegiatan->waktu_mulai)->format('H:i');
                $endTime = Carbon::parse($kegiatan->waktu_berakhir)->format('H:i');
                return [
                    'id' => $kegiatan->id,
                    'time' => $startTime,
                    'endTime' => $endTime,
                    'name' => $kegiatan->nama_kegiatan,
                    'location' => $kegiatan->tempat ?? 'N/A',
                    'status' => $this->getScheduleStatus($startTime, $endTime, $currentTime, false),
                ];
            });

        // Get today's meetings
        $todayMeetings = Rapat::whereDate('tanggal', $today)
            ->where('status', 'Dijadwalkan')
            ->orderBy('waktu_mulai')
            ->get()
            ->map(function ($rapat) use ($currentTime) {
                return [
                    'id' => $rapat->id,
                    'time' => substr($rapat->waktu_mulai, 0, 5),
                    'endTime' => substr($rapat->waktu_selesai, 0, 5),
                    'name' => $rapat->agenda_rapat,
                    'location' => $rapat->tempat ?? 'N/A',
                    'status' => $this->getScheduleStatus($rapat->waktu_mulai, $rapat->waktu_selesai, $currentTime, false),
                ];
            });

        // Calculate statistics (mock for now - will integrate with absensi table later)
        $stats = [
            'totalMengajar' => $todaySchedule->count() * 20, // Approximate monthly
            'hadir' => round($todaySchedule->count() * 20 * 0.93),
            'izin' => round($todaySchedule->count() * 20 * 0.04),
            'sakit' => round($todaySchedule->count() * 20 * 0.03),
            'percentage' => 93,
        ];

        // Generate reminders
        $reminders = $this->generateReminders($todaySchedule, $todayActivities, $todayMeetings, $currentTime);

        return response()->json([
            'user' => [
                'name' => $guru->nama,
                'nip' => $guru->nip,
                'jabatan' => $guru->jabatan ?? 'Guru',
            ],
            'today' => [
                'date' => $today->locale('id')->translatedFormat('l, d F Y'),
                'scheduleCount' => $todaySchedule->count(),
            ],
            'todaySchedule' => $todaySchedule,
            'todayActivities' => $todayActivities,
            'todayMeetings' => $todayMeetings,
            'stats' => $stats,
            'reminders' => $reminders,
        ]);
    }

    /**
     * Get day name in Indonesian
     */
    private function getDayName(int $dayOfWeek): string
    {
        $days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return $days[$dayOfWeek];
    }

    /**
     * Determine schedule status based on time
     */
    private function getScheduleStatus(string $startTime, string $endTime, string $currentTime, bool $attended): string
    {
        if ($attended) {
            return 'attended';
        }

        $start = Carbon::createFromFormat('H:i', substr($startTime, 0, 5));
        $end = Carbon::createFromFormat('H:i', substr($endTime, 0, 5));
        $now = Carbon::createFromFormat('H:i', $currentTime);

        if ($now->lt($start)) {
            return 'upcoming';
        } elseif ($now->gte($start) && $now->lte($end)) {
            return 'ongoing';
        } else {
            return 'missed';
        }
    }

    /**
     * Generate reminders based on schedule status
     */
    private function generateReminders($schedule, $activities, $meetings, $currentTime)
    {
        $reminders = [];

        // Check missed teaching schedules
        foreach ($schedule as $item) {
            if ($item['status'] === 'ongoing' || $item['status'] === 'missed') {
                $reminders[] = [
                    'type' => 'mengajar',
                    'title' => 'Belum Absen Mengajar',
                    'description' => "{$item['subject']} - {$item['class']} ({$item['time']})",
                    'priority' => $item['status'] === 'missed' ? 'high' : 'medium',
                ];
            }
        }

        // Check missed activities
        foreach ($activities as $item) {
            if ($item['status'] === 'ongoing' || $item['status'] === 'missed') {
                $reminders[] = [
                    'type' => 'kegiatan',
                    'title' => 'Belum Absen Kegiatan',
                    'description' => "{$item['name']} ({$item['time']})",
                    'priority' => $item['status'] === 'missed' ? 'high' : 'medium',
                ];
            }
        }

        // Check upcoming meetings (in next 30 minutes)
        $now = Carbon::createFromFormat('H:i', $currentTime);
        foreach ($meetings as $item) {
            $meetingStart = Carbon::createFromFormat('H:i', $item['time']);
            $diffMinutes = $now->diffInMinutes($meetingStart, false);

            if ($diffMinutes > 0 && $diffMinutes <= 30) {
                $reminders[] = [
                    'type' => 'rapat',
                    'title' => "Rapat Dimulai {$diffMinutes} Menit Lagi",
                    'description' => "{$item['name']} - {$item['location']} ({$item['time']})",
                    'priority' => 'medium',
                    'countdown' => $diffMinutes,
                ];
            }
        }

        // Find next schedule
        foreach ($schedule as $item) {
            if ($item['status'] === 'upcoming') {
                $reminders[] = [
                    'type' => 'next',
                    'title' => 'Jadwal Mengajar Berikutnya',
                    'description' => "{$item['subject']} - {$item['class']} ({$item['time']})",
                    'priority' => 'low',
                ];
                break;
            }
        }

        return $reminders;
    }

    /**
     * Search across jadwal, kegiatan, rapat for the logged-in guru
     */
    public function search(Request $request)
    {
        $user = $request->user();
        $guru = $user->guru;
        $query = $request->input('q', '');
        $category = $request->input('category', 'all'); // all, jadwal, kegiatan, rapat
        $hari = $request->input('hari', '');

        if (strlen($query) < 2 && empty($hari)) {
            return response()->json([
                'results' => [],
                'total' => 0,
            ]);
        }

        $results = [];

        // Search Jadwal
        if ($category === 'all' || $category === 'jadwal') {
            $jadwalQuery = Jadwal::with(['mapel', 'kelas'])
                ->where('status', 'Aktif');

            // Only filter by guru if logged-in user has guru relation
            if ($guru) {
                $jadwalQuery->where('guru_id', $guru->id);
            }

            if (!empty($query)) {
                $jadwalQuery->where(function ($q) use ($query) {
                    $q->whereHas('mapel', function ($mq) use ($query) {
                        $mq->where('nama', 'like', "%{$query}%");
                    })->orWhereHas('kelas', function ($kq) use ($query) {
                        $kq->where('nama', 'like', "%{$query}%");
                    })->orWhere('hari', 'like', "%{$query}%");
                });
            }

            if (!empty($hari)) {
                $jadwalQuery->where('hari', $hari);
            }

            $jadwal = $jadwalQuery->limit(10)->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'jadwal',
                    'title' => $item->mapel->nama ?? 'N/A',
                    'subtitle' => ($item->kelas->nama ?? 'N/A') . ' - ' . $item->hari,
                    'time' => substr($item->jam_mulai, 0, 5) . ' - ' . substr($item->jam_selesai, 0, 5),
                    'icon' => 'fa-chalkboard-teacher',
                    'color' => 'green',
                ];
            });

            $results = array_merge($results, $jadwal->toArray());
        }

        // Search Kegiatan
        if ($category === 'all' || $category === 'kegiatan') {
            $kegiatanQuery = Kegiatan::where('status', 'Aktif');

            if (!empty($query)) {
                $kegiatanQuery->where(function ($q) use ($query) {
                    $q->where('nama_kegiatan', 'like', "%{$query}%")
                        ->orWhere('tempat', 'like', "%{$query}%");
                });
            }

            $kegiatan = $kegiatanQuery->limit(10)->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'kegiatan',
                    'title' => $item->nama_kegiatan,
                    'subtitle' => $item->tempat ?? 'N/A',
                    'time' => Carbon::parse($item->waktu_mulai)->format('d M Y, H:i'),
                    'icon' => 'fa-calendar-check',
                    'color' => 'blue',
                ];
            });

            $results = array_merge($results, $kegiatan->toArray());
        }

        // Search Rapat
        if ($category === 'all' || $category === 'rapat') {
            $rapatQuery = Rapat::query();

            if (!empty($query)) {
                $rapatQuery->where(function ($q) use ($query) {
                    $q->where('agenda_rapat', 'like', "%{$query}%")
                        ->orWhere('tempat', 'like', "%{$query}%")
                        ->orWhere('jenis_rapat', 'like', "%{$query}%");
                });
            }

            $rapat = $rapatQuery->limit(10)->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'rapat',
                    'title' => $item->agenda_rapat,
                    'subtitle' => ($item->jenis_rapat ?? 'Rapat') . ' - ' . ($item->tempat ?? 'N/A'),
                    'time' => Carbon::parse($item->tanggal)->format('d M Y') . ', ' . substr($item->waktu_mulai, 0, 5),
                    'icon' => 'fa-users',
                    'color' => 'purple',
                ];
            });

            $results = array_merge($results, $rapat->toArray());
        }

        return response()->json([
            'results' => $results,
            'total' => count($results),
            'query' => $query,
        ]);
    }

    /**
     * Get profile data for the logged-in guru
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $guru = $user->guru;

        if (!$guru) {
            return response()->json([
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'nip' => '-',
                    'jabatan' => $user->role ?? 'User',
                    'jenis_kelamin' => '-',
                    'tempat_lahir' => '-',
                    'tanggal_lahir' => '-',
                    'alamat' => '-',
                    'pendidikan' => '-',
                    'kontak' => '-',
                ],
            ]);
        }

        return response()->json([
            'user' => [
                'name' => $guru->nama,
                'email' => $guru->email ?? $user->email,
                'nip' => $guru->nip ?? '-',
                'sk' => $guru->sk ?? '-',
                'jabatan' => $guru->jabatan ?? 'Guru',
                'jenis_kelamin' => $guru->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
                'tempat_lahir' => $guru->tempat_lahir ?? '-',
                'tanggal_lahir' => $guru->tanggal_lahir ? $guru->tanggal_lahir->format('d F Y') : '-',
                'alamat' => $guru->alamat ?? '-',
                'pendidikan' => $guru->pendidikan ?? '-',
                'kontak' => $guru->kontak ?? '-',
                'tmt' => $guru->tmt ? $guru->tmt->format('d F Y') : '-',
                'status' => $guru->status ?? 'Aktif',
            ],
        ]);
    }
}
