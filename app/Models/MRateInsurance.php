<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MRateInsurance extends Model
{
    use HasFactory;

    protected $primaryKey = 'RATE_INSURANCE_ID';

    protected $table = 'm_rate_insurance';

    protected $guarded = [
        'RATE_INSURANCE_ID',
    ];

    public $with = ['insuranceName'];

    public function insuranceName()
    {
        return $this->hasOne(Insurance::class, 'INSURANCE_ID', 'INSURANCE_ID');
    }

    public $timestamps = false;
}
