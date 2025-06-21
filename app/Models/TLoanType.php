<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TLoanType extends Model
{
    use HasFactory;

    protected $primaryKey = 'loan_type_id';

    protected $table = 't_loan_type';

    protected $guarded = [
        'loan_type_id',
    ];

    public $timestamps = false;
}
