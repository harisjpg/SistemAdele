<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TOffer extends Model
{
    use HasFactory;

    protected $primaryKey = 'OFFER_ID';

    protected $table = 't_offer';

    protected $guarded = [
        'OFFER_ID',
    ];

    public $timestamps = false;
}
