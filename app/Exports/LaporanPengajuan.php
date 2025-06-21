<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Font;

class LaporanPengajuan implements FromCollection, WithHeadings, WithStyles
{
    protected $data;

    // Menerima data Collection pada konstruktor
    public function __construct($data)
    {
        $this->data = $data;
    }

    // Mengembalikan data collection untuk diekspor
    public function collection()
    {
        return $this->data;
    }

    // Menambahkan header untuk file Excel
    public function headings(): array
    {
        return ['Kode Aplikasi', 'Status Proses', 'Status Pengajuan', 'Nama Debitur', 'Tgl Lahir', 'Usia Debitur', 'Umur Debitur Saat Jatuh Tempo', 'NIK Debitur', 'Jenis Asuransi', 'Sumber Pembayaran', 'Tgl Awal Kredit', 'Tgl Akhir Kredit', 'Tenor(Bulan)', 'Nilai Pertanggungan', 'Kode Kantor', 'Nama Kantor', 'Kode Cabang', 'Nama Cabang', 'Loan Type', 'Produk', 'Sub Produk', 'CIF Debitur', 'Created'];  // Sesuaikan dengan kolom yang ada di data Anda
    }

    public function styles($sheet)
    {
        // Menambahkan style untuk header (judul kolom)
        $sheet->getStyle('A1:W1')->getFont()->setSize(12); // Mengatur ukuran font
        $sheet->getStyle('A1:W1')->getFont()->setBold(true); // Menebalkan font
        $sheet->getStyle('A1:W1')->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN); // Menambahkan border tipis pada header

        $sheet->getColumnDimension('A')->setWidth(30);
        $sheet->getColumnDimension('B')->setWidth(30);
        $sheet->getColumnDimension('C')->setWidth(30);
        $sheet->getColumnDimension('D')->setWidth(30);
        $sheet->getColumnDimension('E')->setWidth(30);
        $sheet->getColumnDimension('F')->setWidth(30);
        $sheet->getColumnDimension('G')->setWidth(30);
        $sheet->getColumnDimension('H')->setWidth(30);
        $sheet->getColumnDimension('I')->setWidth(30);
        $sheet->getColumnDimension('J')->setWidth(30);
        $sheet->getColumnDimension('K')->setWidth(30);
        $sheet->getColumnDimension('L')->setWidth(30);
        $sheet->getColumnDimension('M')->setWidth(30);
        $sheet->getColumnDimension('N')->setWidth(30);
        $sheet->getColumnDimension('O')->setWidth(30);
        $sheet->getColumnDimension('P')->setWidth(30);
        $sheet->getColumnDimension('Q')->setWidth(30);
        $sheet->getColumnDimension('R')->setWidth(30);
        $sheet->getColumnDimension('S')->setWidth(30);
        $sheet->getColumnDimension('T')->setWidth(30);
        $sheet->getColumnDimension('U')->setWidth(30);
        $sheet->getColumnDimension('V')->setWidth(30);
        $sheet->getColumnDimension('W')->setWidth(30);

        return [];
    }
}
