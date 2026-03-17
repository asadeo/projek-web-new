<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $news = News::latest()->get();
        
        if ($news->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Belum ada berita yang diterbitkan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'news' => $news
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'status' => 'required|in:draft,published',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $validated = request()->all();
        $validated['slug'] = Str::slug($request->title);

        if ($request->hasFile('image')){
            $imagePath = $request->file('image')->store('news_images', 'public');
            $validated['image'] = $imagePath;
        }

        $news = News::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Berita berhasil ditambahkan!', 
            'data' => $news
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'status' => 'error',
                'message' => 'Berita tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'news' => $news
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'status' => 'error',
                'message' => 'Berita tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'status' => 'required|in:draft,published',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $validated = request()->all();
        $validated['slug'] = Str::slug($request->title);

        if ($request->hasFile('image')){
            if ($news->image && Storage::disk('public')->exists($news->image)) {
                Storage::disk('public')->delete($news->image);
            }

            $imagePath = $request->file('image')->store('news_images', 'public');
            $validated['image'] = $imagePath;
        }

        $news->update($validated);
        
        return response()->json([   
            'status' => 'success',
            'message' => 'Berita berhasil diupdate!', 
            'news' => $news
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $news = News::find($id);
        
        if (!$news) {
            return response()->json([
                'status' => 'error',
                'message' => 'Berita tidak ditemukan',
            ], 404);
        }

        if ($news->image && Storage::disk('public')->exists($news->image)) {
            Storage::disk('public')->delete($news->image);
        }

        $news->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Berita berhasil dihapus!'
        ], 200);
    }
}
