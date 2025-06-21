<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TProduct extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_id';

    protected $table = 't_product';

    protected $guarded = [
        'product_id',
    ];

    public $timestamps = false;
}
