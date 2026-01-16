<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ekstrakurikuler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EkstrakurikulerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $ekstrakurikuler = Ekstrakurikuler::orderBy('nama_ekstra')->get();
        return response()->json([
            'success' => true,
            'data' => $ekstrakurikuler
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_ekstra' => 'required|string|max:100',
            'penanggung_jawab' => 'required|string|max:100',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'waktu' => 'required|date_format:H:i',
            'durasi' => 'required|string|max:50',
        ]);

        $ekstrakurikuler = Ekstrakurikuler::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ekstrakurikuler berhasil ditambahkan',
            'data' => $ekstrakurikuler
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ekstrakurikuler $ekstrakurikuler): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $ekstrakurikuler
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ekstrakurikuler $ekstrakurikuler): JsonResponse
    {
        $validated = $request->validate([
            'nama_ekstra' => 'required|string|max:100',
            'penanggung_jawab' => 'required|string|max:100',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'waktu' => 'required|date_format:H:i',
            'durasi' => 'required|string|max:50',
        ]);

        $ekstrakurikuler->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ekstrakurikuler berhasil diperbarui',
            'data' => $ekstrakurikuler
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ekstrakurikuler $ekstrakurikuler): JsonResponse
    {
        $ekstrakurikuler->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ekstrakurikuler berhasil dihapus'
        ]);
    }
}
