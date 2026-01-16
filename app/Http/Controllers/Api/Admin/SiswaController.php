<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $siswa = Siswa::with('kelas')->orderBy('nama')->get();
        return response()->json([
            'success' => true,
            'data' => $siswa
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'status' => 'required|in:Aktif,Tidak Aktif',
            'nis' => 'required|string|max:20|unique:siswa,nis',
            'nisn' => 'nullable|string|max:20|unique:siswa,nisn',
            'kelas_id' => 'required|exists:kelas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string|max:100',
            'asal_sekolah' => 'nullable|string|max:100',
            'kontak_ortu' => 'nullable|string|max:20',
        ]);

        $siswa = Siswa::create($validated);
        $siswa->load('kelas');

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil ditambahkan',
            'data' => $siswa
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Siswa $siswa): JsonResponse
    {
        $siswa->load('kelas');
        return response()->json([
            'success' => true,
            'data' => $siswa
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Siswa $siswa): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'status' => 'required|in:Aktif,Tidak Aktif',
            'nis' => 'required|string|max:20|unique:siswa,nis,' . $siswa->id,
            'nisn' => 'nullable|string|max:20|unique:siswa,nisn,' . $siswa->id,
            'kelas_id' => 'required|exists:kelas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string|max:100',
            'asal_sekolah' => 'nullable|string|max:100',
            'kontak_ortu' => 'nullable|string|max:20',
        ]);

        $siswa->update($validated);
        $siswa->load('kelas');

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil diperbarui',
            'data' => $siswa
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa): JsonResponse
    {
        $siswa->delete();

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil dihapus'
        ]);
    }
}
