<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('client')->after('password')->index();
            $table->string('membership_id', 20)->nullable()->unique()->after('role');
            $table->timestamp('membership_applied_at')->nullable()->after('membership_id');
            $table->string('phone', 20)->nullable()->after('membership_applied_at');
            $table->string('locality', 100)->nullable()->after('phone');
            $table->text('bio')->nullable()->after('locality');
            $table->string('avatar_path')->nullable()->after('bio');
            $table->boolean('is_active')->default(true)->after('avatar_path');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'membership_id',
                'membership_applied_at',
                'phone',
                'locality',
                'bio',
                'avatar_path',
                'is_active',
            ]);
        });
    }
};
