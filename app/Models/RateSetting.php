<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RateSetting extends Model
{
    use HasFactory;

    protected $primaryKey = 'RATE_MANAGE_ID';

    protected $table = 't_rate_manage';

    protected $guarded = [
        'RATE_MANAGE_ID',
    ];

    public $with = ['documentTemplate', 'insuranceRate', 'rateTemplate', 'rateDataSource'];

    public function documentTemplate()
    {
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'RATE_MANAGE_FIX_DOCUMENT_ID');
    }

    public function insuranceRate()
    {
        return $this->hasMany(MRateInsurance::class, 'RATE_MANAGE_ID');
    }

    public function rateTemplate()
    {
        return $this->hasMany(RateTemplate::class, 'RATE_MANAGE_ID')->orderBy('TEMPLATE_RATE_ID', 'asc');
    }

    public function rateDataSource()
    {
        return $this->hasMany(RateDataSource::class, 'RATE_MANAGE_ID')->orderBy('RATE_DATA_SOURCE_ID', 'asc');
    }

    public $timestamps = false;
}
