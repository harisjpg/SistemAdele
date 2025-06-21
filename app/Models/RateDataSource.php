<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RateDataSource extends Model
{
    use HasFactory;

    protected $primaryKey = 'RATE_DATA_SOURCE_ID';

    protected $table = 't_rate_data_source';

    protected $guarded = [
        'RATE_DATA_SOURCE_ID',
    ];

    public $timestamps = false;
}
