<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RUploadType extends Model
{
    use HasFactory;

    protected $primaryKey = 'UPLOAD_TYPE_ID';

    protected $table = 'r_upload_type';

    protected $guarded = [
        'UPLOAD_TYPE_ID',
    ];

    public $timestamps = false;
}
