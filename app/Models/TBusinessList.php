<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TBusinessList extends Model
{
    use HasFactory;

    protected $primaryKey = 'BUSINESS_LIST_ID';

    protected $table = 't_business_list';

    protected $guarded = [
        'BUSINESS_LIST_ID',
    ];

    public $timestamps = false;
}
