<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TInsuranceBundling extends Model
{
    use HasFactory;

    protected $primaryKey = 'INSURANCE_BUNDLING_ID';

    protected $table = 't_insurance_bundling';

    protected $guarded = [
        'INSURANCE_BUNDLING_ID',
    ];

    public $timestamps = false;
}
