<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TOrganization extends Model
{
    use HasFactory;

    protected $primaryKey = 'ORGANIZATION_ID';

    protected $table = 't_organization';

    protected $guarded = [
        'ORGANIZATION_ID',
    ];

    public $timestamps = false;
}
