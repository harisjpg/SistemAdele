<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TBusinessDocument extends Model
{
    use HasFactory;

    protected $primaryKey = 'BUSINESS_DOCUMENT_ID';

    protected $table = 't_business_document';

    protected $guarded = [
        'BUSINESS_DOCUMENT_ID',
    ];

    public $timestamps = false;
}
