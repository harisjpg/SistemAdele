<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankList extends Model
{
    use HasFactory;

    protected $primaryKey = 'BANK_LIST_ID';

    protected $table = 't_bank_list';

    protected $guarded = [
        'BANK_LIST_ID',
    ];

    public $with = ['document'];

    public function document()
    {
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'BANK_LIST_DOCUMENT_ID');
    }

    public $timestamps = false;
}
