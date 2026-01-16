<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KegiatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $kegiatan = Kegiatan::with('penanggungjawab:id,nama')
            ->orderBy('waktu_mulai', 'desc')
            ->get();
        return response()->json([
            'success' => true,
            'data' => $kegiatan
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama_kegiatan' => 'required|string|max:200',
                'jenis_kegiatan' => 'required|in:Rutin,Tahunan,Insidental',
                'waktu_mulai' => 'required|date',
                'waktu_berakhir' => 'required|date|after_or_equal:waktu_mulai',
                'tempat' => 'nullable|string|max:100',
                'penanggung_jawab_id' => 'nullable|exists:guru,id',
                'peserta' => 'nullable|string|max:100',
                'deskripsi' => 'nullable|string|max:500',
                'status' => 'required|in:Aktif,Selesai,Dibatalkan',
            ]);

            // Set penanggung_jawab based on penanggung_jawab_id
            if (!empty($validated['penanggung_jawab_id'])) {
                $guru = Guru::find($validated['penanggung_jawab_id']);
                $validated['penanggung_jawab'] = $guru ? $guru->nama : '-';
            } else {
                $validated['penanggung_jawab'] = '-';
            }

            $kegiatan = Kegiatan::create($validated);
            $kegiatan->load('penanggungjawab:id,nama');

            return response()->json([
                'success' => true,
                'message' => 'Kegiatan berhasil ditambahkan',
                'data' => $kegiatan
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Kegiatan $kegiatan): JsonResponse
    {
        $kegiatan->load('penanggungjawab:id,nama');
        return response()->json([
            'success' => true,
            'data' => $kegiatan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kegiatan $kegiatan): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama_kegiatan' => 'required|string|max:200',
                'jenis_kegiatan' => 'required|in:Rutin,Tahunan,Insidental',
                'waktu_mulai' => 'required|date',
                'waktu_berakhir' => 'required|date|after_or_equal:waktu_mulai',
                'tempat' => 'nullable|string|max:100',
                'penanggung_jawab_id' => 'nullable|exists:guru,id',
                'peserta' => 'nullable|string|max:100',
                'deskripsi' => 'nullable|string|max:500',
                'status' => 'required|in:Aktif,Selesai,Dibatalkan',
            ]);

            // Set penanggung_jawab based on penanggung_jawab_id
            if (!empty($validated['penanggung_jawab_id'])) {
                $guru = Guru::find($validated['penanggung_jawab_id']);
                $validated['penanggung_jawab'] = $guru ? $guru->nama : '-';
            } else {
                $validated['penanggung_jawab'] = '-';
            }

            $kegiatan->update($validated);
            $kegiatan->load('penanggungjawab:id,nama');

            return response()->json([
                'success' => true,
                'message' => 'Kegiatan berhasil diperbarui',
                'data' => $kegiatan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kegiatan $kegiatan): JsonResponse
    {
        $kegiatan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil dihapus'
        ]);
    }
}

