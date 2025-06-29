<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TInsuranceProductBundling extends Model
{
    use HasFactory;

    protected $primaryKey = 'INSURANCE_PRODUCT_BUNDLING_ID';

    protected $table = 't_insurance_product_bundling';

    protected $guarded = [
        'INSURANCE_PRODUCT_BUNDLING_ID',
    ];

    public $timestamps = false;
}
