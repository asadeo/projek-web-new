<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('npsn')->unique();
            $table->string('name');
            $table->enum('level', ['SD', 'SMP']);
            $table->enum('status', ['Negeri', 'Swasta']);
            $table->string('address');
            $table->string('district');
            $table->string('photo')->nullable();
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
            $table->integer('student_2023')->default(0);
            $table->integer('student_2024')->default(0);
            $table->integer('student_2025')->default(0);
            $table->integer('teachers_count')->default(0);
            $table->enum('accreditation', ['A', 'B', 'C', 'Belum Terakreditasi'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
