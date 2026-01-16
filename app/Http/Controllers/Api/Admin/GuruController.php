<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class GuruController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $guru = Guru::orderBy('nama')->get();
        return response()->json([
            'success' => true,
            'data' => $guru
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50|unique:guru,username',
            'password' => 'required|string|min:6',
            'nama' => 'required|string|max:100',
            'nip' => 'nullable|string|max:50|unique:guru,nip',
            'email' => 'nullable|email|max:100',
            'sk' => 'nullable|string|max:50',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'pendidikan' => 'nullable|string|max:100',
            'kontak' => 'nullable|string|max:20',
            'tmt' => 'nullable|date',
            'jabatan' => 'nullable|string|max:100',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $guru = Guru::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Guru berhasil ditambahkan',
            'data' => $guru
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Guru $guru): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $guru
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Guru $guru): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50|unique:guru,username,' . $guru->id,
            'password' => 'nullable|string|min:6',
            'nama' => 'required|string|max:100',
            'nip' => 'nullable|string|max:50|unique:guru,nip,' . $guru->id,
            'email' => 'nullable|email|max:100',
            'sk' => 'nullable|string|max:50',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'pendidikan' => 'nullable|string|max:100',
            'kontak' => 'nullable|string|max:20',
            'tmt' => 'nullable|date',
            'jabatan' => 'nullable|string|max:100',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $guru->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Guru berhasil diperbarui',
            'data' => $guru
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guru $guru): JsonResponse
    {
        $guru->delete();

        return response()->json([
            'success' => true,
            'message' => 'Guru berhasil dihapus'
        ]);
    }
}
