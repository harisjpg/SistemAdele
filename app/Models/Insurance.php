<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insurance extends Model
{
    use HasFactory;

    protected $primaryKey = 'INSURANCE_ID';

    protected $table = 't_insurance';

    protected $guarded = [
        'INSURANCE_ID',
    ];

    public $with = ['document'];

    public function document()
    {
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'INSURANCE_LOGO');
    }

    public function TInsuranceBundling()
    {
        return $this->hasMany(TInsuranceBundling::class, 'INSURANCE_ID', 'INSURANCE_ID');
    }

    public function TInsuranceProdukBundling()
    {
        return $this->hasMany(TInsuranceProductBundling::class, 'INSURANCE_ID', 'INSURANCE_ID');
    }

    public $timestamps = false;
}
