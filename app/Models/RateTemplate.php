<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RateTemplate extends Model
{
    use HasFactory;

    protected $primaryKey = 'TEMPLATE_RATE_ID';

    protected $table = 't_rate_template';

    protected $guarded = [
        'TEMPLATE_RATE_ID',
    ];

    public $timestamps = false;
}
