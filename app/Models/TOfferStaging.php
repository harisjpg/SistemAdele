<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TOfferStaging extends Model
{
    use HasFactory;

    protected $primaryKey = 'offer_staging_id';

    protected $table = 't_offer_staging';

    protected $guarded = [
        'offer_staging_id',
    ];

    public $timestamps = false;
}
