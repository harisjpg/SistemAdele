<?php

namespace App\Helpers;

use App\Models\Document;
use App\Models\Insurance;
use App\Models\RateSetting;
use App\Models\TBankInsurance;
use App\Models\TBusinessList;
use App\Models\TCoverNote;
use App\Models\TLoanType;
use App\Models\TOffer;
use App\Models\TOfferDetail;
use App\Models\TProductSchemeLoanType;
use App\Models\TProdukAsuransi;
use App\Models\TRateHistory;
use App\Models\TShareEffectiveDate;
use App\Models\UserLog;
use DateTime;
// use Elibyy\TCPDF\Facades\TCPDF;
use Elibyy\TCPDF\TCPDF;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;

function get_number($day, $year, $month)
{
    $arr_data = DB::table('t_offer')
        ->select(DB::raw('MAX(RIGHT(OFFER_SUBMISSION_CODE, 5)) AS MAX_NUMBER'))
        ->where('OFFER_SUBMISSION_CODE', 'REGEXP', '[0-4]{4}' . $month . $year . '[0-4]{5}')
        ->get();
    $max_number = $arr_data[0]->MAX_NUMBER;
    if (trim($max_number) != null || trim($max_number) != '') {
        $digit_number = str_pad($max_number + 1, 5, '0', STR_PAD_LEFT);
    } else {
        $digit_number = "00001";
    }

    return $digit_number;
}

function regNumberCodePengajuan($kode_broker, $kodeOffice, $tanggal = NULL)
{
    // get tanggal awal kredit
    $getDateFormat = date("dmY", strtotime($tanggal));

    $day = date("d", strtotime($tanggal));
    $year = date("Y", strtotime($tanggal));
    $month = date("m", strtotime($tanggal));

    $seven_digit_number_covernote = get_number($day, $year, $month); //3. Create Number based on year

    if ($seven_digit_number_covernote) {
        $return_number = $kode_broker . $kodeOffice . $getDateFormat . $seven_digit_number_covernote;
    }

    return $return_number;
}

function getProdukSubProdukNew($idLoanTye)
{
    $arrData = TProductSchemeLoanType::leftJoin('t_product_scheme', 't_product_scheme_loan_type.product_scheme_id', '=', 't_product_scheme.product_scheme_id')
        ->leftJoin('t_product', 't_product_scheme.product_id', '=', 't_product.product_id')
        ->leftJoin('t_scheme', 't_product_scheme.scheme_id', '=', 't_scheme.scheme_id')
        ->where('loan_type_id', $idLoanTye)
        ->get();

    return $arrData;
}

function getCurrentEffectiveDate($bankId = "", $idAsuransi = NULL)
{
    $today = date("Y-m-d");

    $query = $arrEffectiveDate = TShareEffectiveDate::query();
    $query->where('SHARE_EFFECTIVE_DATE', '<=', $today);
    $query->where('JENIS_ASURANSI_ID', $idAsuransi);
    $query->where('SHARE_EFFECTIVE_STATUS', 0);
    if ($bankId != "") {
        $query->where('BANK_LIST_ID', $bankId);
    }
    $query->orderBy('SHARE_EFFECTIVE_DATE', 'DESC');
    $query->orderBy('SHARE_EFFECTIVE_CREATED', 'DESC');
    $arrData = $query->get();

    return $arrData;
}

function getShareConfigurationByEffectiveIdAndNoRedFlag($idEffective)
{
    $data = TBankInsurance::select('t_bank_insurance.*', 't_insurance.INSURANCE_SLUG', 't_insurance.INSURANCE_NAME')->where('t_bank_insurance.BANK_INSURANCE_REDFLAG', 'false')->leftJoin('t_insurance', 't_bank_insurance.INSURANCE_ID', '=', 't_insurance.INSURANCE_ID')->where('t_bank_insurance.SHARE_EFFECTIVE_DATE_ID', $idEffective)->get();

    return $data;
}

function getCurrentEffectiveDateInsurance($bankId = "", $idAsuransi = NULL)
{
    $today = date("Y-m-d");

    $query = $arrEffectiveDate = TShareEffectiveDate::query();
    $query->where('SHARE_EFFECTIVE_DATE', '<=', $today);
    // $query->where('JENIS_ASURANSI_ID', $idAsuransi);
    $query->whereIn('JENIS_ASURANSI_ID', [1, 2, 3, 4]);
    $query->where('SHARE_EFFECTIVE_STATUS', 0);
    if ($bankId != "") {
        $query->where('BANK_LIST_ID', $bankId);
    }
    $query->orderBy('SHARE_EFFECTIVE_DATE', 'DESC');
    $query->orderBy('SHARE_EFFECTIVE_CREATED', 'DESC');
    $arrData = $query->get();
    // dd($arrData);

    return $arrData;
}


function getBankInsuranceEffective($idEffective)
{
    $data = TBankInsurance::select('t_bank_insurance.*', 't_insurance.INSURANCE_SLUG', 't_insurance.INSURANCE_NAME')->where('t_bank_insurance.BANK_INSURANCE_REDFLAG', 'false')->leftJoin('t_insurance', 't_bank_insurance.INSURANCE_ID', '=', 't_insurance.INSURANCE_ID')->where('t_bank_insurance.SHARE_EFFECTIVE_DATE_ID', $idEffective)->get();

    return $data;
}

function getRateManageSettingById($idRateManage)
{
    $arrRateManage = RateSetting::where('RATE_MANAGE_ID', $idRateManage)
        ->leftJoin('t_document', 't_document.DOCUMENT_ID', '=', 't_rate_manage.RATE_MANAGE_FIX_DOCUMENT_ID')
        ->get();

    return $arrRateManage;
}

function calculatePremiRateChubb($reg)
{
    $rateManageId = $reg['documenIdRate'];

    $rate = 0;
    $prorate = 0;
    $finalrate = 0;
    $premium = 0;

    $age = $reg["age"];
    $insurance_id = $reg["insurance_id"];
    $si = $reg["plafond"];

    $tenor = $reg["tenor_reg"]; //dalam bulan
    $tenor = ceil($tenor / 12); //dalam tahun roundup

    // get document 
    $arrDocument = getRateManageSettingById($rateManageId);
    $uploadPath = $arrDocument[0]['DOCUMENT_DIRNAME'];
    $fileName = $arrDocument[0]['DOCUMENT_FILENAME'];
    $filePath = public_path('storage/' . $uploadPath . $fileName);

    // get isi data file rate
    try {
        $inputFileType = IOFactory::identify($filePath);
        $objReader = IOFactory::createReader($inputFileType);
        $objPHPExcel = $objReader->load($filePath);
    } catch (Exception $e) {
        $response = array('success' => false, 'msg' => 'Error loading file "' . pathinfo($filePath, PATHINFO_BASENAME) . '".', 'error' => $e->getMessage());
        print json_encode($response);
        exit;
    }

    // jika berhasi get file excelnya
    $sheet = $objPHPExcel->getActiveSheet();

    // ubah data sheetnya ke dalam array
    $data = $sheet->toArray();

    // buat array kosong
    $matrix = [];
    $years = array_slice($data[0], 1); // Ambil semua tahun, kecuali rentang usia
    foreach ($data as $index => $row) {
        if ($index == 0) continue; // Lewati baris header

        $ageRange = $row[0];  // Ambil rentang usia dari kolom pertama
        // Loop melalui tahun
        foreach ($years as $yearIndex => $year) {
            $rate = $row[$yearIndex + 1];  // Ambil nilai rate dari matrix
            $matrix[$year][$ageRange] = $rate;  // Kelompokkan data berdasarkan tahun dan rentang usia
        }
    }
    foreach ($matrix as $year => $ages) {
        if ($year == $tenor) {  // Memeriksa apakah tahun cocok
            if (array_key_exists($age, $ages)) {  // Memeriksa apakah rentang age ada dalam data tahun tersebut
                $rate = $ages[$age];  // Ambil nilai rate berdasarkan usia dan tahun
                break;  // Jika sudah ditemukan, keluar dari perulangan
            }
        }
    }

    // perhitungan rate dengan sum insured
    $premium = $si * ($rate / 1000);
    $premium = round($premium, 0, PHP_ROUND_HALF_UP);

    return array(
        "rate" => $rate,
        "premium" => $premium
    );
}

function calculatePremiRateHeksa($reg)
{
    $rateManageId = $reg['documenIdRate'];

    $rate = 0;
    $prorate = 0;
    $finalrate = 0;
    $premium = 0;

    $age = $reg["age"];
    $insurance_id = $reg["insurance_id"];
    $si = $reg["plafond"];

    $tenor = $reg["tenor_reg"]; //dalam bulan
    $tenor = ceil($tenor / 12); //dalam tahun roundup

    // get document 
    $arrDocument = getRateManageSettingById($rateManageId);
    $uploadPath = $arrDocument[0]['DOCUMENT_DIRNAME'];
    $fileName = $arrDocument[0]['DOCUMENT_FILENAME'];
    $filePath = public_path('storage/' . $uploadPath . $fileName);

    // get isi data file rate
    try {
        $inputFileType = IOFactory::identify($filePath);
        $objReader = IOFactory::createReader($inputFileType);
        $objPHPExcel = $objReader->load($filePath);
    } catch (Exception $e) {
        $response = array('success' => false, 'msg' => 'Error loading file "' . pathinfo($filePath, PATHINFO_BASENAME) . '".', 'error' => $e->getMessage());
        print json_encode($response);
        exit;
    }

    // jika berhasi get file excelnya
    $sheet = $objPHPExcel->getActiveSheet();

    // ubah data sheetnya ke dalam array
    $data = $sheet->toArray();

    // buat array kosong
    $matrix = [];
    $years = array_slice($data[0], 1); // Ambil semua tahun, kecuali rentang usia
    foreach ($data as $index => $row) {
        if ($index == 0) continue; // Lewati baris header

        $ageRange = $row[0];  // Ambil rentang usia dari kolom pertama
        // Loop melalui tahun
        foreach ($years as $yearIndex => $year) {
            $rate = $row[$yearIndex + 1];  // Ambil nilai rate dari matrix
            $matrix[$year][$ageRange] = $rate;  // Kelompokkan data berdasarkan tahun dan rentang usia
        }
    }
    foreach ($matrix as $year => $ages) {
        if ($year == $tenor) {  // Memeriksa apakah tahun cocok
            if (array_key_exists($age, $ages)) {  // Memeriksa apakah rentang age ada dalam data tahun tersebut
                $rate = $ages[$age];  // Ambil nilai rate berdasarkan usia dan tahun
                break;  // Jika sudah ditemukan, keluar dari perulangan
            }
        }
    }

    // perhitungan rate dengan sum insured
    $premium = $si * ($rate / 1000);
    $premium = round($premium, 0, PHP_ROUND_HALF_UP);

    return array(
        "rate" => $rate,
        "premium" => $premium
    );
}

function calculatePremiRateJamkrida($reg)
{
    $rateManageId = $reg['documenIdRate'];
    $jenisRate = $reg['jenis_rate'];

    $rate = 0;
    $prorate = 0;
    $finalrate = 0;
    $premium = 0;

    // Tanggal saat ini
    $birth_date = $reg["birth_date"];
    $tanggal_rencana = $reg["tanggal_awal"];
    $date1 = new DateTime($birth_date);
    $date2 = new DateTime($tanggal_rencana);
    $diff = (array) date_diff($date1, $date2);

    $ageDown = $diff['y'];
    $ageMonth = $diff['m'];
    $ageUp = $ageDown;
    if ($ageMonth >= 6) {
        $ageUp = intval($ageDown) + 1;
    }

    $age = $ageUp;
    $insurance_id = $reg["insurance_id"];
    $si = $reg["plafond"];

    $tenor = $reg["tenor_reg"]; //dalam bulan
    $tenor = ceil($tenor / 12); //dalam tahun roundup

    // get document 
    $arrDocument = getRateManageSettingById($rateManageId);
    $uploadPath = $arrDocument[0]['DOCUMENT_DIRNAME'];
    $fileName = $arrDocument[0]['DOCUMENT_FILENAME'];
    $filePath = public_path('storage/' . $uploadPath . $fileName);

    // get isi data file rate
    try {
        $inputFileType = IOFactory::identify($filePath);
        $objReader = IOFactory::createReader($inputFileType);
        $objPHPExcel = $objReader->load($filePath);
    } catch (Exception $e) {
        $response = array('success' => false, 'msg' => 'Error loading file "' . pathinfo($filePath, PATHINFO_BASENAME) . '".', 'error' => $e->getMessage());
        print json_encode($response);
        exit;
    }

    // jika berhasi get file excelnya
    // Access Sheet 1 by index
    $sheet = null;
    if ($jenisRate === 1 || $jenisRate === "1") {
        $sheet = $objPHPExcel->getSheet(0);  // Sheet Payroll
    } else {
        $sheet = $objPHPExcel->getSheet(1);  // Sheet Non Payroll
    }

    // ubah data sheetnya ke dalam array
    $data = $sheet->toArray();

    // buat array kosong
    $matrix = [];
    $years = array_slice($data[0], 1); // Ambil semua tahun, kecuali rentang usia
    foreach ($data as $index => $row) {
        if ($index == 0) continue; // Lewati baris header

        $ageRange = $row[0];  // Ambil rentang usia dari kolom pertama
        // Loop melalui tahun
        foreach ($years as $yearIndex => $year) {
            $rate = $row[$yearIndex + 1];  // Ambil nilai rate dari matrix
            $matrix[$year][$ageRange] = $rate;  // Kelompokkan data berdasarkan tahun dan rentang usia
        }
    }
    foreach ($matrix as $year => $ages) {
        if ($year == $tenor) {  // Memeriksa apakah tahun cocok
            if (array_key_exists($age, $ages)) {  // Memeriksa apakah rentang age ada dalam data tahun tersebut
                $rate = $ages[$age];  // Ambil nilai rate berdasarkan usia dan tahun
                break;  // Jika sudah ditemukan, keluar dari perulangan
            }
        }
    }

    // perhitungan rate dengan sum insured
    $premium = $si * ($rate / 1000);
    $premium = round($premium, 0, PHP_ROUND_HALF_UP);

    return array(
        "rate" => $rate,
        "premium" => $premium
    );
}

function calculateRatePremiAdeleSistem($reg)
{
    switch ($reg["insurance_id"]) {
        case "23":
            $hasil = calculatePremiRateChubb($reg);
            return $hasil;
            break;
        case "2":
            $hasil = calculatePremiRateHeksa($reg);
            return $hasil;
            break;
        case "24":
            $hasil = calculatePremiRateJamkrida($reg);
            return $hasil;
            break;
        case "22":
            $hasil = calculatePremiRateJamkrida($reg);
            return $hasil;
            break;
        default:
            return array(
                "rate" => 0,
                "premium" => 0
            );
    }
}

function getDetailOfferAll($idOfferDetailId)
{
    $query = TOfferDetail::query();
    $query->where('OFFER_DETAIL_ID', $idOfferDetailId);
    $query->leftJoin('t_offer', 't_offer_detail.OFFER_ID', '=', 't_offer.OFFER_ID');
    $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer.BANK_INSURANCE_ID');
    $query->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID');

    $arrOfferDetail = $query->get();

    return $arrOfferDetail;
}

function getDetailOfferAllForBusiness($idOfferDetailId)
{
    $query = TOfferDetail::query();
    $query->select('*', 't_offer.BANK_BRANCH_ID as bankBranchId');
    $query->where('OFFER_DETAIL_ID', $idOfferDetailId);
    $query->leftJoin('t_offer', 't_offer_detail.OFFER_ID', '=', 't_offer.OFFER_ID');
    $query->leftJoin('t_theinsured', 't_offer.THE_INSURED_ID', '=', 't_theinsured.THE_INSURED_ID');
    $query->leftJoin('t_document', 't_theinsured.DOCUMENT_KTP_ID', '=', 't_document.DOCUMENT_ID');
    $query->leftJoin('t_loan_type', 't_offer.LOAN_TYPE_ID', '=', 't_loan_type.loan_type_id');
    $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer.BANK_INSURANCE_ID');
    $query->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID');

    $arrOfferDetail = $query->get();

    return $arrOfferDetail;
}

function getInsuranceId($business_list_id)
{
    $arrData = TBusinessList::where('BUSINESS_LIST_ID', $business_list_id)->select('t_bank_insurance.INSURANCE_ID', 't_document.*')->leftJoin('t_offer_detail', 't_business_list.offer_detail_id', '=', 't_offer_detail.offer_detail_id')->leftJoin('t_bank_insurance', 't_offer_detail.BANK_INSURANCE_ID', '=', 't_bank_insurance.BANK_INSURANCE_ID')->leftJoin('t_insurance', 't_bank_insurance.INSURANCE_ID', '=', 't_insurance.INSURANCE_ID')->leftJoin('t_document', 't_insurance.INSURANCE_LOGO', '=', 't_document.DOCUMENT_ID')->get();

    return $arrData;
}

function getDataCoverNoteById($cover_note_id)
{
    $arrData = TCoverNote::where('covernote_id', $cover_note_id)
        ->leftJoin('t_business_list', 't_covernote.businesslist_id', '=', 't_business_list.BUSINESS_LIST_ID')
        ->leftJoin('t_offer_detail', 't_business_list.offer_detail_id', '=', 't_offer_detail.OFFER_DETAIL_ID')
        ->leftJoin('t_theinsured', 't_business_list.THE_INSURED_ID', '=', 't_theinsured.THE_INSURED_ID')
        ->leftJoin('t_bank_insurance', 't_business_list.BANK_INSURANCE_ID', '=', 't_bank_insurance.BANK_INSURANCE_ID')
        ->leftJoin('t_insurance', 't_bank_insurance.INSURANCE_ID', '=', 't_insurance.INSURANCE_ID')
        ->get();

    return $arrData;
}

function getCoverNoteNumber($cover_note_id)
{
    $arrData = TCoverNote::where('covernote_id', $cover_note_id)->get();

    return $arrData;
}

function generatePdfCoverNote($templateSurat, $business_list_id, $by, $date, $noSuratCn, $withheader = 'no')
{
    // Data Auth
    $user = Auth::user();
    $user_id = $user->id;
    $date = now();

    // Generate file name safely
    $file_name = str_replace(" ", "_", $noSuratCn . '.pdf');
    $file_name = preg_replace('/[\s+\[\]\/\\?*:|"<>!@#$%^&`~+={}|\'",]/', '', $file_name);

    // Define directory structure
    $parentDir = ((floor(($business_list_id) / 1000)) * 1000) . '/';
    $RateSettingId = $business_list_id . '/';
    $coverNotedir = 'document/CoverNote/';
    $uploadPath = $coverNotedir . $parentDir . $RateSettingId;  // No need for $typeDir if empty

    // Ensure the directory exists
    Storage::makeDirectory('public/' . $uploadPath);

    // Store document details in DB
    $document = Document::create([
        'DOCUMENT_ORIGINAL_NAME' => $file_name,
        'DOCUMENT_FILENAME'      => $file_name,
        'DOCUMENT_DIRNAME'       => $uploadPath,
        'DOCUMENT_FILETYPE'      => 'application/pdf',
        'DOCUMENT_FILESIZE'      => 1, // Update this with actual file size if needed
        'DOCUMENT_CREATED_BY'    => $user_id
    ]);

    // Initialize TCPDF
    $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
    $pdf->SetMargins(5, 5, 5);
    $pdf->SetAutoPageBreak(true);
    $pdf->SetAuthor('Author');

    // Add Page and Content
    $pdf->AddPage();
    $pdf->writeHTML($templateSurat, true, false, true, false, '');

    // Define full file path
    $filePath = storage_path('app/public/' . $uploadPath . $file_name);
    // $filePath = $fullPath . $business_list_id . '-' . $file_name;

    // Save the PDF file
    $pdf->Output($filePath, 'F');

    return $document->DOCUMENT_ID;
}

function tgl_format_indo($tanggal)
{
    // Array nama bulan dalam bahasa Indonesia (singkatan)
    $bulan = [
        '01' => 'Jan',
        '02' => 'Feb',
        '03' => 'Mar',
        '04' => 'Apr',
        '05' => 'Mei',
        '06' => 'Jun',
        '07' => 'Jul',
        '08' => 'Agu',
        '09' => 'Sep',
        '10' => 'Okt',
        '11' => 'Nov',
        '12' => 'Des'
    ];

    $day = date("d", strtotime($tanggal)); // Ambil hari
    $month = date("m", strtotime($tanggal)); // Ambil bulan (angka)
    $year = date("Y", strtotime($tanggal)); // Ambil tahun

    // Formatkan tanggal sesuai yang diinginkan
    $formattedDate = $day . ' ' . $bulan[$month] . ' ' . $year;

    return $formattedDate;
}

function tgl_format_indo_lengkap($tanggal)
{
    // Array nama bulan dalam bahasa Indonesia (singkatan)
    $bulan = [
        '01' => 'Januari',
        '02' => 'Februari',
        '03' => 'Maret',
        '04' => 'April',
        '05' => 'Mei',
        '06' => 'Juni',
        '07' => 'Juli',
        '08' => 'Agustus',
        '09' => 'September',
        '10' => 'Oktober',
        '11' => 'November',
        '12' => 'Desember'
    ];

    $day = date("d", strtotime($tanggal)); // Ambil hari
    $month = date("m", strtotime($tanggal)); // Ambil bulan (angka)
    $year = date("Y", strtotime($tanggal)); // Ambil tahun

    // Formatkan tanggal sesuai yang diinginkan
    $formattedDate = $day . ' ' . $bulan[$month] . ' ' . $year;

    return $formattedDate;
}

function downloadFile($idDocument)
{
    $detailDocument = Document::find($idDocument);
    // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
    $filePath = public_path('/storage/' . $detailDocument->DOCUMENT_DIRNAME . $detailDocument->DOCUMENT_FILENAME);

    $headers = [
        'filename' => $detailDocument->DOCUMENT_FILENAME
    ];

    if (file_exists($filePath)) {
        return response()->download($filePath, $detailDocument->DOCUMENT_FILENAME, $headers);
    } else {
        abort(404, 'File not found');
    }
}

function downloadFileCoverNote($idDocument)
{
    $detailDocument = Document::find($idDocument);
    // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
    $filePath = public_path('/storage/' . $detailDocument->DOCUMENT_DIRNAME . $detailDocument->DOCUMENT_FILENAME);

    $headers = [
        'filename' => $detailDocument->DOCUMENT_FILENAME
    ];

    if (file_exists($filePath)) {
        return response()->download($filePath, $detailDocument->DOCUMENT_FILENAME, $headers);
    } else {
        abort(404, 'File not found');
    }
}

function getAllTotalPenutupan($request)
{
    // Data Auth
    $user = Auth::user();
    $userType = $user->user_type_id;

    $query = TBusinessList::query();
    $query->where('t_business_list.IsDeleted', '<>', 1);

    // for bank
    if ($userType == 2) {
        $query->where('t_business_list.BANK_LIST_ID', $user->BANK_LIST_ID);
        $query->where('t_business_list.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
    }
    // for broker
    if ($userType == 3) {
    }
    // for insurance
    if ($userType == 4) {
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_business_list.BANK_INSURANCE_ID');
        $query->where('t_bank_insurance.INSURANCE_ID', $user->INSURANCE_ID);
    }
    // end for bank


    $arrData = $query->count();
    return $arrData;
}

function getAllTotalPengajuan($request)
{
    // Data Auth
    $user = Auth::user();
    $userType = $user->user_type_id;

    $query = TOffer::query();
    $query->where('t_offer.OFFER_STATUS_ID', 1);

    // for bank
    if ($userType == 2) {
        $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
    }
    // end for bank


    $arrData = $query->count();
    return $arrData;
}

function getAllTotalProses($request)
{
    // Data Auth
    $user = Auth::user();
    $userType = $user->user_type_id;

    $query = TOffer::query();
    $query->where('t_offer.OFFER_STATUS_ID', 2);

    // for bank
    if ($userType == 2) {
        $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
    }
    // for broker
    if ($userType == 3) {
        // $query->whereIn('t_offer.OFFER_STAGING_ID', [2, 3, 4, 5, 8, 9, 10, 12, 13, 14]);
    }
    // for insurance
    if ($userType == 4) {
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer.BANK_INSURANCE_ID');
        $query->whereIn('t_offer.OFFER_STAGING_ID', [6, 7]);
        $query->where('t_bank_insurance.INSURANCE_ID', $user->INSURANCE_ID);
    }



    $arrData = $query->count();

    return $arrData;
}

function getAllTotalSetuju($request)
{
    // Data Auth
    $user = Auth::user();
    $userType = $user->user_type_id;

    $query = TOffer::query();
    $query->where('t_offer.OFFER_STATUS_ID', 3);

    // for bank
    if ($userType == 2) {
        $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
    }
    // for broker
    if ($userType == 3) {
    }
    // for insurance
    if ($userType == 4) {
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer.BANK_INSURANCE_ID');
        $query->where('t_bank_insurance.INSURANCE_ID', $user->INSURANCE_ID);
    }

    $arrData = $query->count();
    return $arrData;
}

function getAllTotalPending($request)
{
    // Data Auth
    $user = Auth::user();
    $userType = $user->user_type_id;

    $query = TOffer::query();
    $query->where('t_offer.OFFER_STATUS_ID', 4);

    // for bank
    if ($userType == 2) {
        $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
    }
    // for broker
    if ($userType == 3) {
    }
    // for insurance
    if ($userType == 4) {
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer.BANK_INSURANCE_ID');
        $query->where('t_bank_insurance.INSURANCE_ID', $user->INSURANCE_ID);
    }


    $arrData = $query->count();
    return $arrData;
}

function getAllTotalTolak($request)
{
    // Data Auth
    $user = Auth::user();
    $userType = $user->user_type_id;

    $query = TOffer::query();
    $query->where('t_offer.OFFER_STATUS_ID', 5);

    // for bank
    if ($userType == 2) {
        $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
    }
    // for broker
    if ($userType == 3) {
    }
    // for insurance
    if ($userType == 4) {
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer.BANK_INSURANCE_ID');
        $query->where('t_bank_insurance.INSURANCE_ID', $user->INSURANCE_ID);
    }


    $arrData = $query->count();
    return $arrData;
}

function getAllTotalBatal($request)
{
    // Data Auth
    $user = Auth::user();
    $userType = $user->user_type_id;

    $query = TOffer::query();
    $query->where('t_offer.OFFER_STATUS_ID', 6);

    // for bank
    if ($userType == 2) {
        $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
    }
    // for broker
    if ($userType == 3) {
    }
    // for insurance
    if ($userType == 4) {
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer.BANK_INSURANCE_ID');
        $query->where('t_bank_insurance.INSURANCE_ID', $user->INSURANCE_ID);
    }


    $arrData = $query->count();
    return $arrData;
}

function getRateHistory($id_offer_detail)
{
    $arrData = TRateHistory::where('offer_detail_id', $id_offer_detail)->first();

    return $arrData;
}

function getAllInsurance()
{
    $arrData = Insurance::leftJoin('t_produk_asuransi', 't_insurance.PRODUK_ASURANSI_ID', '=', 't_produk_asuransi.PRODUK_ASURANSI_ID')
        ->whereNotNull('t_insurance.PRODUK_ASURANSI_ID')
        ->get();

    return $arrData;
}

function getProdukAsuransiById($asuransi_id)
{
    $arrData = TProdukAsuransi::where('PRODUK_ASURANSI_ID', $asuransi_id)
        ->first();

    return $arrData;
}

// function getProdukAsuransi()
// {
//     $arrData = TProdukAsuransi::whereNotNull('PRODUK_ASURANSI_ID')
//         ->leftJoin('t_produk_asuransi', 't_insurance.PRODUK_ASURANSI_ID', '=', 't_produk_asuransi.PRODUK_ASURANSI_ID')
//         ->get();

//     return $arrData;
// }

function getInsuranceById($idInsurance)
{
    $arrData = Insurance::where('INSURANCE_ID', $idInsurance)
        ->first();

    return $arrData;
}
