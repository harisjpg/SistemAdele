<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TRateHistory extends Model
{
    use HasFactory;

    protected $primaryKey = 'rate_history_id';

    protected $table = 't_rate_history';

    protected $guarded = [
        'rate_history_id',
    ];

    public $timestamps = false;
}
