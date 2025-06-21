<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RJenisAsuransi extends Model
{
    use HasFactory;

    protected $primaryKey = 'JENIS_ASURANSI_ID';

    protected $table = 'r_jenis_asuransi';

    protected $guarded = [
        'JENIS_ASURANSI_ID',
    ];

    public $timestamps = false;
}
