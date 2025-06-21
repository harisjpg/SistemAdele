<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TTheInsured extends Model
{
    use HasFactory;

    protected $primaryKey = 'THE_INSURED_ID';

    protected $table = 't_theinsured';

    protected $guarded = [
        'THE_INSURED_ID',
    ];

    public $timestamps = false;

    public $with = ['documentktp'];

    public function documentktp()
    {
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'DOCUMENT_KTP_ID');
    }
}
