<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankBranch extends Model
{
    use HasFactory;

    protected $primaryKey = 'BANK_BRANCH_ID';

    protected $table = 't_bank_branch';

    protected $guarded = [
        'BANK_BRANCH_ID',
    ];

    public $timestamps = false;
}
