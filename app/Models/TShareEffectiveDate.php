<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TShareEffectiveDate extends Model
{
    use HasFactory;

    protected $primaryKey = 'SHARE_EFFECTIVE_DATE_ID';

    protected $table = 't_share_effective_date';

    protected $guarded = [
        'SHARE_EFFECTIVE_DATE_ID',
    ];

    public function bankInsurance()
    {
        return $this->hasMany(TBankInsurance::class, 'SHARE_EFFECTIVE_DATE_ID');
    }

    public $timestamps = false;
}
