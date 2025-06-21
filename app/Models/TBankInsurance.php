<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TBankInsurance extends Model
{
    use HasFactory;

    protected $primaryKey = 'BANK_INSURANCE_ID';

    protected $table = 't_bank_insurance';

    protected $guarded = [
        'BANK_INSURANCE_ID',
    ];

    public $with = ['insuranceList'];

    public function insuranceList()
    {
        return $this->hasOne(Insurance::class, 'INSURANCE_ID', 'INSURANCE_ID');
    }

    public $timestamps = false;
}
