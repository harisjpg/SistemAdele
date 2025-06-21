<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TProductSchemeLoanType extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_scheme_loan_type_id';

    protected $table = 't_product_scheme_loan_type';

    protected $guarded = [
        'product_scheme_loan_type_id',
    ];

    public $timestamps = false;
}
