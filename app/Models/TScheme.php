<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TScheme extends Model
{
    use HasFactory;

    protected $primaryKey = 'scheme_id';

    protected $table = 't_scheme';

    protected $guarded = [
        'scheme_id',
    ];

    public $timestamps = false;
}
