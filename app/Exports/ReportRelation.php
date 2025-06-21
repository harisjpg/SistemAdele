<?php

namespace App\Exports;

use App\Models\Relation;
use App\Models\TRelationOffice;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ReportRelation implements FromQuery
{
    protected $startDate;
    protected $endDate;

    // Menerima parameter start_date dan end_date
    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function query()
    {
        return Relation::query()->whereDate('RELATION_ORGANIZATION_CREATED_DATE', $this->startDate); // Mengekspor pengguna yang aktif saja
    }
}
