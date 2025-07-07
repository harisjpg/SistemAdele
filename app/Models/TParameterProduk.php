<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TParameterProduk extends Model
{
    use HasFactory;

    protected $primaryKey = 'PARAMETER_PRODUK_ID';

    protected $table = 't_parameter_produk';

    protected $guarded = [
        'PARAMETER_PRODUK_ID',
    ];

    public $with = ['children'];

    public $timestamps = false;

    public function children()
    {
        return $this->hasMany(TParameterProduk::class, 'PARAMETER_PRODUK_PARENT');
    }
}
