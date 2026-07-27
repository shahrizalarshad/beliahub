<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\SequenceType;
use App\Models\Sequence;
use Illuminate\Support\Facades\DB;

class SequenceService
{
    public function next(SequenceType $type, ?int $year = null): string
    {
        $year ??= (int) now()->format('Y');

        return DB::transaction(function () use ($type, $year): string {
            $sequence = Sequence::query()
                ->where('type', $type->value)
                ->where('year', $year)
                ->lockForUpdate()
                ->first();

            if (! $sequence) {
                $sequence = Sequence::create([
                    'type' => $type->value,
                    'year' => $year,
                    'last_number' => 0,
                ]);
            }

            $next = $sequence->last_number + 1;
            $sequence->update(['last_number' => $next]);

            return sprintf('%s-%d-%04d', $type->prefix(), $year, $next);
        });
    }
}
