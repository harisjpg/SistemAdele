<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TOfferDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'OFFER_DETAIL_ID';

    protected $table = 't_offer_detail';

    protected $guarded = [
        'OFFER_DETAIL_ID',
    ];

    public $timestamps = false;
}
