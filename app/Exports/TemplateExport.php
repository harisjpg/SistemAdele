<?php

namespace App\Exports;

use App\Models\RateDataSource;
use App\Models\RateSetting;
use App\Models\RateTemplate;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;

class TemplateExport implements WithMultipleSheets
{
    protected $idRateSetting;

    public function __construct($idRateSetting)
    {
        $this->idRateSetting = $idRateSetting;
    }

    public function sheets(): array
    {
        $sheets = [];

        // Sheet pertama: Data Produk
        $sheets[] = new Sheet1Export($this->idRateSetting);

        // Sheet kedua: Data Kategori
        $rateTemplate = RateDataSource::select('RATE_DATA_SOURCE_NAME')->where('RATE_MANAGE_ID', $this->idRateSetting)->orderBy('RATE_DATA_SOURCE_ID', 'asc')->get();
        foreach ($rateTemplate as $table) {
            // Ambil nama tabel dari objek hasil query
            $tableName = $table->RATE_DATA_SOURCE_NAME;

            // Tambahkan sheet untuk setiap tabel
            $sheets[] = new CategorySheetExport($tableName);
        }

        // Anda dapat menambahkan lebih banyak sheet jika diperlukan
        return $sheets;
        // // Ambil data dari model pertama
        // $sheet1 = new Sheet1Export($this->idRateSetting);

        // // Ambil data dari model kedua

        // return [
        //     $sheet1,
        // ];
    }
}

class Sheet1Export implements FromCollection, WithTitle
{
    protected $idRateSetting;

    public function __construct($idRateSetting)
    {
        $this->idRateSetting = $idRateSetting;
    }

    public function collection()
    {
        // Ambil data dari tabel pertama
        $rateTemplate = RateTemplate::select('TEMPLATE_RATE_COLUMN_NAME')->where('RATE_MANAGE_ID', $this->idRateSetting)->orderBy('TEMPLATE_RATE_ID', 'asc')->get();


        // Mengubah data dari kolom menjadi baris
        $transposedData = $this->transposeData($rateTemplate);

        return collect($transposedData); // Mengembalikan data sebagai koleksi
    }

    private function transposeData($data)
    {
        // Mengambil setiap kolom sebagai array
        $transposed = [];
        foreach ($data as $item) {
            // Menyimpan data per kolom dalam bentuk array
            foreach ($item->toArray() as $key => $value) {
                $transposed[$key][] = $value; // Transpose data
            }
        }
        return $transposed; // Mengembalikan data dalam bentuk transpose
    }

    public function title(): string
    {
        return 'DATA'; // Nama sheet pertama
    }

    public function columnWidths(): array
    {
        $columnWidths = [];
        $data = $this->collection(); // Ambil data model

        // Tentukan lebar kolom berdasarkan panjang data
        foreach ($data as $key => $row) {
            foreach ($row->getAttributes() as $attribute => $value) {
                $column = $this->getColumnByIndex($key); // Dapatkan kolom berdasarkan index
                $columnWidths[$column] = max(strlen($value), 20); // Tentukan lebar kolom dengan panjang string
            }
        }

        return $columnWidths;
    }

    // Fungsi untuk mendapatkan nama kolom berdasarkan index (misalnya, 0 => A, 1 => B)
    private function getColumnByIndex($index)
    {
        $alphabet = range('A', 'Z');
        return $alphabet[$index];
    }
}

class CategorySheetExport implements FromCollection, WithTitle
{
    protected $tableName;

    public function __construct($tableName)
    {
        $this->tableName = $tableName;
    }

    public function collection()
    {

        // Ambil data dari tabel pertama
        $dataSource = DB::table($this->tableName)->get();

        // Mengubah data dari kolom menjadi baris
        // $transposedData = $this->transposeData($rateTemplate);

        return $dataSource; // Mengembalikan data sebagai koleksi
    }

    private function transposeData($data)
    {
        // Mengambil setiap kolom sebagai array
        $transposed = [];
        foreach ($data as $item) {
            // Menyimpan data per kolom dalam bentuk array
            foreach ($item->toArray() as $key => $value) {
                $transposed[$key][] = $value; // Transpose data
            }
        }
        return $transposed; // Mengembalikan data dalam bentuk transpose
    }

    public function title(): string
    {
        return $this->tableName; // Nama sheet pertama
    }

    public function columnWidths(): array
    {
        $columnWidths = [];
        $data = $this->collection(); // Ambil data model

        // Tentukan lebar kolom berdasarkan panjang data
        foreach ($data as $key => $row) {
            foreach ($row->getAttributes() as $attribute => $value) {
                $column = $this->getColumnByIndex($key); // Dapatkan kolom berdasarkan index
                $columnWidths[$column] = max(strlen($value), 20); // Tentukan lebar kolom dengan panjang string
            }
        }

        return $columnWidths;
    }

    // Fungsi untuk mendapatkan nama kolom berdasarkan index (misalnya, 0 => A, 1 => B)
    private function getColumnByIndex($index)
    {
        $alphabet = range('A', 'Z');
        return $alphabet[$index];
    }
}
