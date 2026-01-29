<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\AbsensiMengajar;
use App\Models\AbsensiKegiatan;
use App\Models\AbsensiRapat;
use App\Models\Jadwal;
use App\Models\Kegiatan;
use App\Models\Rapat;
use App\Models\AbsensiSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class GuruRiwayatController extends Controller
{
    /**
     * Get riwayat mengajar as flat daily entries with guru_status
     */
    public function riwayatMengajar(Request $request)
    {
        $user = $request->user();
        $guru = $user->guru;

        if (!$guru) {
            return response()->json([
                'success' => false,
                'message' => 'Guru profile not found'
            ], 404);
        }

        $search = $request->input('search', '');

        // Get all absensi mengajar for this guru, ordered by date desc
        $query = AbsensiMengajar::with(['jadwal.mapel', 'jadwal.kelas', 'absensiSiswa'])
            ->where('guru_id', $guru->id)
            ->orderBy('tanggal', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('jadwal.mapel', function ($mq) use ($search) {
                    $mq->where('nama_mapel', 'like', "%{$search}%");
                })->orWhereHas('jadwal.kelas', function ($kq) use ($search) {
                    $kq->where('nama_kelas', 'like', "%{$search}%");
                });
            });
        }

        $absensiList = $query->take(50)->get();

        $result = [];
        foreach ($absensiList as $absensi) {
            $hadir = $absensi->absensiSiswa->where('status', 'H')->count();
            $izin = $absensi->absensiSiswa->where('status', 'I')->count();
            $sakit = $absensi->absensiSiswa->where('status', 'S')->count();
            $alpha = $absensi->absensiSiswa->where('status', 'A')->count();

            $result[] = [
                'id' => $absensi->id,
                'jadwal_id' => $absensi->jadwal_id,
                'mapel' => $absensi->jadwal->mapel->nama_mapel ?? 'Unknown',
                'kelas' => $absensi->jadwal->kelas->nama_kelas ?? 'Unknown',
                'tanggal' => Carbon::parse($absensi->tanggal)->translatedFormat('d M Y'),
                'waktu' => substr($absensi->jadwal->jam_mulai ?? '00:00', 0, 5) . ' - ' . substr($absensi->jadwal->jam_selesai ?? '00:00', 0, 5),
                'hari' => $absensi->jadwal->hari ?? '-',
                'guru_status' => 'H', // If absensi exists, guru was present
                'guru_keterangan' => null,
                'ringkasan_materi' => $absensi->ringkasan_materi,
                'berita_acara' => $absensi->berita_acara,
                'hadir' => $hadir,
                'izin' => $izin + $sakit,
                'alpha' => $alpha,
                'total_siswa' => $absensi->absensiSiswa->count(),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }


    /**
     * Get detail pertemuan (siswa list)
     */
    public function detailPertemuan(Request $request, $id)
    {
        $user = $request->user();
        $guru = $user->guru;

        if (!$guru) {
            return response()->json([
                'success' => false,
                'message' => 'Guru profile not found'
            ], 404);
        }

        $absensi = AbsensiMengajar::with(['absensiSiswa.siswa', 'jadwal.mapel', 'jadwal.kelas'])
            ->where('id', $id)
            ->where('guru_id', $guru->id)
            ->first();

        if (!$absensi) {
            return response()->json([
                'success' => false,
                'message' => 'Absensi not found'
            ], 404);
        }

        $siswaList = $absensi->absensiSiswa->map(function ($as) {
            return [
                'id' => $as->id,
                'siswa_id' => $as->siswa_id,
                'nama' => $as->siswa->nama ?? 'Unknown',
                'nis' => $as->siswa->nis ?? '-',
                'status' => $as->status,
                'keterangan' => $as->keterangan,
            ];
        });

        $hadir = $absensi->absensiSiswa->where('status', 'H')->count();
        $izin = $absensi->absensiSiswa->where('status', 'I')->count();
        $sakit = $absensi->absensiSiswa->where('status', 'S')->count();
        $alpha = $absensi->absensiSiswa->where('status', 'A')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $absensi->id,
                'tanggal' => Carbon::parse($absensi->tanggal)->translatedFormat('d F Y'),
                'mapel' => $absensi->jadwal->mapel->nama_mapel ?? 'Unknown',
                'kelas' => $absensi->jadwal->kelas->nama_kelas ?? 'Unknown',
                'ringkasan_materi' => $absensi->ringkasan_materi,
                'berita_acara' => $absensi->berita_acara,
                'guru_name' => $guru->nama ?? 'Guru',
                'guru_nip' => $guru->nip ?? '',
                'guru_status' => $absensi->guru_status ?? 'H',
                'guru_keterangan' => $absensi->guru_keterangan,
                'stats' => [
                    'hadir' => $hadir,
                    'izin' => $izin + $sakit,
                    'alpha' => $alpha,
                    'total' => $absensi->absensiSiswa->count(),
                ],
                'siswa' => $siswaList,
            ]
        ]);
    }

    /**
     * Get riwayat kegiatan for this guru
     */
    public function riwayatKegiatan(Request $request)
    {
        $user = $request->user();
        $guru = $user->guru;

        if (!$guru) {
            return response()->json([
                'success' => false,
                'message' => 'Guru profile not found'
            ], 404);
        }

        $search = $request->input('search', '');

        // Get kegiatan where guru is PJ or in pendamping array
        $kegiatanQuery = Kegiatan::where(function ($q) use ($guru) {
            $q->where('penanggung_jawab_id', $guru->id)
                ->orWhereJsonContains('guru_pendamping', $guru->id)
                ->orWhereJsonContains('guru_pendamping', (string) $guru->id);
        })
            ->whereNotNull('waktu_mulai')
            ->orderBy('waktu_mulai', 'desc');

        if ($search) {
            $kegiatanQuery->where('nama_kegiatan', 'like', "%{$search}%");
        }

        $kegiatanList = $kegiatanQuery->get();

        $result = $kegiatanList->map(function ($kegiatan) use ($guru) {
            $role = 'Peserta';
            $isPJ = $kegiatan->penanggung_jawab_id == $guru->id;
            if ($isPJ) {
                $role = 'PJ';
            } else {
                $pendampingArr = $kegiatan->guru_pendamping ?? [];
                if (is_array($pendampingArr) && (in_array($guru->id, $pendampingArr) || in_array((string) $guru->id, $pendampingArr))) {
                    $role = 'Pendamping';
                }
            }

            $waktuMulai = Carbon::parse($kegiatan->waktu_mulai);
            $waktuSelesai = $kegiatan->waktu_berakhir ? Carbon::parse($kegiatan->waktu_berakhir) : $waktuMulai->copy()->addHours(2);

            return [
                'id' => $kegiatan->id,
                'nama' => $kegiatan->nama_kegiatan,
                'tanggal' => $waktuMulai->translatedFormat('d F Y'),
                'time' => $waktuMulai->format('H:i') . ' - ' . $waktuSelesai->format('H:i'),
                'role' => $role,
                'status_absensi' => null,
                'lokasi' => $kegiatan->tempat,
                'guru_status' => 'H', // If in history, guru was present
                'guru_keterangan' => null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Get riwayat rapat for this guru
     */
    public function riwayatRapat(Request $request)
    {
        $user = $request->user();
        $guru = $user->guru;

        if (!$guru) {
            return response()->json([
                'success' => false,
                'message' => 'Guru profile not found'
            ], 404);
        }

        $search = $request->input('search', '');

        // Get rapat where guru is pimpinan, sekretaris, or in peserta_rapat array
        $rapatQuery = Rapat::where(function ($q) use ($guru) {
            $q->where('pimpinan_id', $guru->id)
                ->orWhere('sekretaris_id', $guru->id)
                ->orWhereJsonContains('peserta_rapat', $guru->id)
                ->orWhereJsonContains('peserta_rapat', (string) $guru->id);
        })
            ->orderBy('tanggal', 'desc');

        if ($search) {
            $rapatQuery->where('agenda_rapat', 'like', "%{$search}%");
        }

        $rapatList = $rapatQuery->get();

        $result = $rapatList->map(function ($rapat) use ($guru) {
            $role = 'Peserta';
            if ($rapat->pimpinan_id == $guru->id) {
                $role = 'Pimpinan';
            } elseif ($rapat->sekretaris_id == $guru->id) {
                $role = 'Sekretaris';
            }

            return [
                'id' => $rapat->id,
                'nama' => $rapat->agenda_rapat,
                'tanggal' => Carbon::parse($rapat->tanggal)->translatedFormat('d F Y'),
                'time' => substr($rapat->waktu_mulai, 0, 5) . ' - ' . substr($rapat->waktu_selesai, 0, 5),
                'role' => $role,
                'status_absensi' => null,
                'lokasi' => $rapat->tempat,
                'guru_status' => 'H', // If in history, guru was present
                'guru_keterangan' => null,
                'notulensi' => $rapat->notulensi,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Get detail kegiatan for riwayat
     */
    public function detailKegiatan(Request $request, $id)
    {
        $user = $request->user();
        $guru = $user->guru;

        if (!$guru) {
            return response()->json([
                'success' => false,
                'message' => 'Guru profile not found'
            ], 404);
        }

        $kegiatan = Kegiatan::with(['penanggungJawab', 'absensiKegiatan.siswa'])
            ->find($id);

        if (!$kegiatan) {
            return response()->json([
                'success' => false,
                'message' => 'Kegiatan not found'
            ], 404);
        }

        // Get guru pendamping with their attendance
        $guruPendamping = [];
        $pendampingIds = $kegiatan->guru_pendamping ?? [];
        if (is_array($pendampingIds) && count($pendampingIds) > 0) {
            $pendampingGurus = \App\Models\Guru::whereIn('id', $pendampingIds)->get();
            foreach ($pendampingGurus as $pg) {
                $absensi = AbsensiKegiatan::where('kegiatan_id', $id)
                    ->where('guru_id', $pg->id)
                    ->first();
                $guruPendamping[] = [
                    'id' => $pg->id,
                    'nama' => $pg->nama,
                    'nip' => $pg->nip,
                    'status' => $absensi ? ($absensi->status ?? 'H') : 'A',
                ];
            }
        }

        // Get siswa attendance
        $siswaList = $kegiatan->absensiKegiatan->map(function ($as) {
            return [
                'id' => $as->id,
                'siswa_id' => $as->siswa_id,
                'nama' => $as->siswa->nama ?? 'Unknown',
                'nis' => $as->siswa->nis ?? '-',
                'kelas' => $as->siswa->kelas->nama_kelas ?? '-',
                'status' => $as->status,
                'keterangan' => $as->keterangan,
            ];
        });

        // Determine guru's own status
        $guruAbsensi = AbsensiKegiatan::where('kegiatan_id', $id)
            ->where('guru_id', $guru->id)
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $kegiatan->id,
                'nama' => $kegiatan->nama_kegiatan,
                'lokasi' => $kegiatan->tempat,
                'guru_status' => $guruAbsensi ? ($guruAbsensi->status ?? 'H') : 'H',
                'guru_keterangan' => $guruAbsensi->keterangan ?? null,
                'guru_pendamping' => $guruPendamping,
                'siswa' => $siswaList,
            ]
        ]);
    }

    /**
     * Get detail rapat for riwayat
     */
    public function detailRapat(Request $request, $id)
    {
        $user = $request->user();
        $guru = $user->guru;

        if (!$guru) {
            return response()->json([
                'success' => false,
                'message' => 'Guru profile not found'
            ], 404);
        }

        $rapat = Rapat::with(['pimpinanGuru', 'sekretarisGuru', 'absensiRapat'])
            ->find($id);

        if (!$rapat) {
            return response()->json([
                'success' => false,
                'message' => 'Rapat not found'
            ], 404);
        }

        // Get pimpinan info
        $pimpinan = null;
        if ($rapat->pimpinanGuru) {
            $pimpinanAbsensi = AbsensiRapat::where('rapat_id', $id)
                ->where('guru_id', $rapat->pimpinan_id)
                ->first();
            $pimpinan = [
                'id' => $rapat->pimpinanGuru->id,
                'nama' => $rapat->pimpinanGuru->nama,
                'nip' => $rapat->pimpinanGuru->nip,
                'status' => $pimpinanAbsensi ? ($pimpinanAbsensi->status ?? 'H') : 'A',
            ];
        }

        // Get peserta with attendance
        $peserta = [];
        $pesertaIds = $rapat->peserta_rapat ?? [];
        if (is_array($pesertaIds) && count($pesertaIds) > 0) {
            $pesertaGurus = \App\Models\Guru::whereIn('id', $pesertaIds)->get();
            foreach ($pesertaGurus as $pg) {
                $absensi = AbsensiRapat::where('rapat_id', $id)
                    ->where('guru_id', $pg->id)
                    ->first();
                $peserta[] = [
                    'id' => $pg->id,
                    'nama' => $pg->nama,
                    'nip' => $pg->nip,
                    'status' => $absensi ? ($absensi->status ?? 'H') : 'A',
                ];
            }
        }

        // Determine guru's own status
        $guruAbsensi = AbsensiRapat::where('rapat_id', $id)
            ->where('guru_id', $guru->id)
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $rapat->id,
                'nama' => $rapat->agenda_rapat,
                'lokasi' => $rapat->tempat,
                'notulensi' => $rapat->notulensi,
                'guru_status' => $guruAbsensi ? ($guruAbsensi->status ?? 'H') : 'H',
                'guru_keterangan' => $guruAbsensi->keterangan ?? null,
                'pimpinan' => $pimpinan,
                'peserta' => $peserta,
            ]
        ]);
    }
}
