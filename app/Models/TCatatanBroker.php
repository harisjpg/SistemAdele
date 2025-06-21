<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TCatatanBroker extends Model
{
    use HasFactory;

    protected $primaryKey = 'CATATAN_BROKER_ID';

    protected $table = 't_catatan_broker';

    protected $guarded = [
        'CATATAN_BROKER_ID',
    ];

    public $timestamps = false;
}
