<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index()
    {
        $schools = School::all();

        if ($schools->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No schools found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'schools' => $schools
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'npsn' => 'required|unique:schools,npsn',
            'name' => 'required|string|max:255',
            'level' => 'required|in:SD,SMP',
            'status' => 'required|in:Negeri,Swasta',
            'address' => 'required|string|max:500',
            'district' => 'required|string|max:255',
            'photo' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'student_2023' => 'nullable|integer|min:0',
            'student_2024' => 'nullable|integer|min:0',
            'student_2025' => 'nullable|integer|min:0',
            'accreditation' => 'nullable|in:A,B,C,Belum Terakreditasi',
        ]);

        $schools = School::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Data sekolah berhasil ditambahkan!',
            'school' => $schools
        ], 201);
    }

    public function update(Request $request, $id){
        $schools = School::find($id);

        if (!$schools) {
            return response()->json([
                'message' => 'Sekolah tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'npsn' => 'required|unique:schools,npsn,'.$id,
            'name' => 'required|string|max:255',
            'level' => 'required|in:SD,SMP',
            'status' => 'required|in:Negeri,Swasta',
            'address' => 'required|string|max:500',
            'district' => 'required|string|max:255',
            'photo' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'student_2023' => 'nullable|integer|min:0',
            'student_2024' => 'nullable|integer|min:0',
            'student_2025' => 'nullable|integer|min:0',
            'accreditation' => 'nullable|in:A,B,C,Belum Terakreditasi',
        ]);

        $schools->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Data sekolah berhasil diupdate!',
            'school' => $schools
        ], 200);
    }

    public function destroy($id){
        $schools = School::find($id);

        if (!$schools) {
            return response()->json([
                'message' => 'Sekolah tidak ditemukan'
            ], 404);
        }

        $schools->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data sekolah berhasil dihapus!'
        ], 200);
    }

    public function show($id){
        $schools = School::find($id);

        if (!$schools) {
            return response()->json([
                'message' => 'Sekolah tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'school' => $schools
        ], 200);
    }

}
