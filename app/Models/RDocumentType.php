<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDocumentType extends Model
{
    use HasFactory;

    protected $primaryKey = 'DOCUMENT_TYPE_ID';

    protected $table = 'r_document_type';

    protected $guarded = [
        'DOCUMENT_TYPE_ID',
    ];

    public $timestamps = false;
}
