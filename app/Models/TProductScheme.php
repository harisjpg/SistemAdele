<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TProductScheme extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_scheme_id';

    protected $table = 't_product_scheme';

    protected $guarded = [
        'product_scheme_id',
    ];

    public $timestamps = false;
}
