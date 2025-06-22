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

    public $with = ['product', 'offer_detail'];

    public function product()
    {
        return $this->hasOne(TProdukAsuransi::class, 'PRODUK_ASURANSI_ID', 'PRODUK_ASURANSI_ID');
    }

    public function offer_detail()
    {
        return $this->hasMany(TOfferDetail::class, 'OFFER_ID', 'OFFER_ID');
    }

    public $timestamps = false;
}
