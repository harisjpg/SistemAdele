<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TProdukAsuransi extends Model
{
    use HasFactory;

    protected $primaryKey = 'PRODUK_ASURANSI_ID';

    protected $table = 't_produk_asuransi';

    protected $guarded = [
        'PRODUK_ASURANSI_ID',
    ];

    public $timestamps = false;

    public $with = ['data_mekanisme_produk', 'documentTemplate'];

    public function data_mekanisme_produk()
    {
        return $this->hasMany(TMekanismeProdukAsuransi::class, 'PRODUK_ASURANSI_ID', 'PRODUK_ASURANSI_ID');
    }

    public function documentTemplate()
    {
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'PRODUK_ASURANSI_DOCUMENT_ID');
    }
}
