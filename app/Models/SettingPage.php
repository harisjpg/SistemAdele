<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SettingPage extends Model
{
    use HasFactory;

    protected $primaryKey = 'SETTING_PAGE_ID';

    protected $table = 't_setting_page';

    protected $guarded = [
        'SETTING_PAGE_ID',
    ];

    public $timestamps = false;
}
