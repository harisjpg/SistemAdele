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
        Schema::create('r_cash_advance_status', function (Blueprint $table) {
            $table->increments('CASH_ADVANCE_STATUS_ID')->primary();
            $table->string('CASH_ADVANCE_STATUS_NAME');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_cash_advance_status');
    }
};