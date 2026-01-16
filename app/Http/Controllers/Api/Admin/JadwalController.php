<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class JadwalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $jadwal = Jadwal::with(['guru:id,nama', 'mapel:id,nama_mapel', 'kelas:id,nama_kelas'])
            ->orderBy('hari')
            ->orderBy('jam_ke')
            ->get();
        return response()->json([
            'success' => true,
            'data' => $jadwal
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'jam_ke' => 'required|string|max:10',
            'jam_mulai' => 'nullable|date_format:H:i',
            'jam_selesai' => 'nullable|date_format:H:i',
            'guru_id' => 'required|exists:guru,id',
            'mapel_id' => 'required|exists:mapel,id',
            'kelas_id' => 'required|exists:kelas,id',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'semester' => 'required|in:Ganjil,Genap',
            'tahun_ajaran' => 'required|string|max:20',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        $jadwal = Jadwal::create($validated);
        $jadwal->load(['guru:id,nama', 'mapel:id,nama_mapel', 'kelas:id,nama_kelas']);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil ditambahkan',
            'data' => $jadwal
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Jadwal $jadwal): JsonResponse
    {
        $jadwal->load(['guru:id,nama', 'mapel:id,nama_mapel', 'kelas:id,nama_kelas']);
        return response()->json([
            'success' => true,
            'data' => $jadwal
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Jadwal $jadwal): JsonResponse
    {
        $validated = $request->validate([
            'jam_ke' => 'required|string|max:10',
            'jam_mulai' => 'nullable|date_format:H:i',
            'jam_selesai' => 'nullable|date_format:H:i',
            'guru_id' => 'required|exists:guru,id',
            'mapel_id' => 'required|exists:mapel,id',
            'kelas_id' => 'required|exists:kelas,id',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'semester' => 'required|in:Ganjil,Genap',
            'tahun_ajaran' => 'required|string|max:20',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        $jadwal->update($validated);
        $jadwal->load(['guru:id,nama', 'mapel:id,nama_mapel', 'kelas:id,nama_kelas']);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil diperbarui',
            'data' => $jadwal
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jadwal $jadwal): JsonResponse
    {
        $jadwal->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil dihapus'
        ]);
    }
}
