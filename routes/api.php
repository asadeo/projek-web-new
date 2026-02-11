<?php

Use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\SchoolController;
use Illuminate\Http\Request;
Use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/schools',[SchoolController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/schools', [SchoolController::class, 'index']);
    Route::post('/schools', [SchoolController::class, 'store']);
    Route::get('/schools/{id}', [SchoolController::class, 'show']);
    Route::put('/schools/{id}', [SchoolController::class, 'update']);
    Route::delete('/schools/{id}', [SchoolController::class, 'destroy']);
});



