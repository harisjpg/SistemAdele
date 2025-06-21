<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RWork extends Model
{
    use HasFactory;

    protected $primaryKey = 'WORK_ID';

    protected $table = 'r_work';

    protected $guarded = [
        'WORK_ID',
    ];

    public $timestamps = false;
}
