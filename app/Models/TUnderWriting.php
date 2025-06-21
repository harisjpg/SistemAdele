<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TUnderWriting extends Model
{
    use HasFactory;

    protected $primaryKey = 'UNDERWRITING_ID';

    protected $table = 't_underwriting';

    protected $guarded = [
        'UNDERWRITING_ID',
    ];

    public $timestamps = false;
}
