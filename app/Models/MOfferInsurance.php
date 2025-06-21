<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MOfferInsurance extends Model
{
    use HasFactory;

    protected $primaryKey = 'OFFER_INSURANCE_ID';

    protected $table = 'm_offer_insurance';

    protected $guarded = [
        'OFFER_INSURANCE_ID',
    ];

    public $timestamps = false;
}
