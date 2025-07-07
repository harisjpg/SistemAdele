<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TMekanismeProdukAsuransi extends Model
{
    use HasFactory;

    protected $primaryKey = 'MEKANISME_PRODUK_ASURANSI_ID';

    protected $table = 't_mekanisme_produk_asuransi';

    protected $guarded = [
        'MEKANISME_PRODUK_ASURANSI_ID',
    ];

    public $timestamps = false;

    public $with = ['parameter_produk'];

    public function parameter_produk()
    {
        return $this->hasOne(TParameterProduk::class, 'PARAMETER_PRODUK_ID', 'PARAMETER_PRODUK_ID');
    }
}
