<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RTarifPayroll extends Model
{
    use HasFactory;

    protected $primaryKey = 'TARIF_PAYROLL_ID';

    protected $table = 'r_tarif_payroll';

    protected $guarded = [
        'TARIF_PAYROLL_ID',
    ];

    public $timestamps = false;
}
