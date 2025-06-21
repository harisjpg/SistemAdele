<?php

namespace App\Http\Controllers;

use App\Exports\LaporanPengajuan;
use App\Models\Insurance;
use App\Models\RJenisAsuransi;
use App\Models\TOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class LaporanPengajuanController extends Controller
{
    public function index()
    {
        $arrJenisAsuransi = RJenisAsuransi::get();
        $arrStatusPengajuan = DB::table('r_staging_pengajuan')->get();
        $arrStatusProses = DB::table('r_offer_status')->get();
        return Inertia::render('LaporanPengajuan/LaporanPengajuan', [
            "arrJenisAsuransi"          => $arrJenisAsuransi,
            "arrStatusPengajuan"        => $arrStatusPengajuan,
            "arrStatusProses"           => $arrStatusProses
        ]);
    }

    public function getDataLaporanPengajuan(Request $request)
    {
        $user = Auth::user();
        $userType = $user->user_type_id;
        // dd($user);

        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'OFFER_ID');
        $sortDirection = $request->input('sort_direction', 'DESC');
        $search = json_decode($request->input('search', ''));
        // $searchAble = is_countable($search);
        // print_r($search->STATUS_PROSES->value);
        // exit;
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $query = TOffer::query();
        $query->select(
            't_offer.OFFER_SUBMISSION_CODE',
            't_offer.BANK_INSURANCE_ID',
            // 't_offer.OFFER_STAGING_ID',
            // 't_offer.OFFER_SUBMISSION_CODE',
            't_theinsured.THE_INSURED_NAME',
            'r_tarif_payroll.TARIF_PAYROLL_NAME',
            'r_jenis_asuransi.JENIS_ASURANSI_NAME',
            't_loan_type.loan_type_name',
            't_user.user_login',
            't_offer.OFFER_CREATED_DATE',
            'r_offer_status.offer_status_name',
            'r_staging_pengajuan.staging_pengajuan_name',
            't_insurance.INSURANCE_NAME',
            // 't_insurance.INSURANCE_ID',
            't_theinsured.THE_INSURED_ID_NUMBER',
            't_theinsured.THE_INSURED_CIF',
            't_theinsured.THE_INSURED_DATE_OF_BIRTH',
            't_theinsured.THE_INSURED_AGE',
            // 't_offer.JENIS_ASURANSI_ID',
            't_offer.OFFER_BANK_OFFICE_NAME',
            't_offer.OFFER_BANK_OFFICE_CODE',
            't_offer.OFFER_BANK_BRANCH_NAME',
            't_offer.OFFER_BANK_BRANCH_CODE',
            // 't_offer.TARIF_PAYROLL_ID',
            't_offer.LOAN_TYPE_ID',
            // 't_offer.PRODUCT_ID',
            // 't_offer.SCHEMA_ID',
            't_offer.OFFER_SUM_INSURED',
            't_offer.OFFER_INCEPTION_DATE',
            't_offer.OFFER_TENOR',
            't_offer.OFFER_DUE_DATE',
            't_offer.OFFER_AGE_ON_DUE_DATE',
            't_product.product_name',
            't_scheme.scheme_name'
        );

        $query->leftJoin('t_theinsured', 't_theinsured.THE_INSURED_ID', '=', 't_offer.THE_INSURED_ID');
        $query->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_offer.JENIS_ASURANSI_ID');
        $query->leftJoin('r_tarif_payroll', 'r_tarif_payroll.TARIF_PAYROLL_ID', '=', 't_offer.TARIF_PAYROLL_ID');
        $query->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_offer.LOAN_TYPE_ID');
        $query->leftJoin('t_product_scheme_loan_type', 't_product_scheme_loan_type.loan_type_id', '=', 't_loan_type.loan_type_id');
        $query->leftJoin('t_product_scheme', 't_product_scheme.product_scheme_id', '=', 't_product_scheme_loan_type.product_scheme_id');
        $query->leftJoin('t_product', 't_product.product_id', '=', 't_product_scheme.product_id');
        $query->leftJoin('t_scheme', 't_scheme.scheme_id', '=', 't_product_scheme.scheme_id');
        $query->leftJoin('r_offer_status', 'r_offer_status.offer_status_id', '=', 't_offer.OFFER_STATUS_ID');
        $query->leftJoin('r_staging_pengajuan', 'r_staging_pengajuan.staging_pengajuan_id', '=', 't_offer.OFFER_STAGING_ID');
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer.BANK_INSURANCE_ID');
        $query->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID');
        $query->leftJoin('t_user', 't_user.id', '=', 't_offer.USER_BANK_ID');

        $query->orderBy($sortColumn, $sortDirection);
        $query->orderBy('OFFER_UPDATED_DATE', 'DESC');

        if ($search->START_DATE != "" || $search->END_DATE != "" || $search->JENIS_INSURANCE != "" || $search->STATUS_PENGAJUAN != "" || $search->STATUS_PROSES != "") {
            // for search
            if ($search->START_DATE != "" && $search->END_DATE != "") {
                // $query->where('t_offer.OFFER_SUBMISSION_CODE', 'like', "%{$search->START_DATE}%");
                $query->whereBetween('t_offer.OFFER_INCEPTION_DATE', [$search->START_DATE, $search->END_DATE]);
            }
            if ($search->JENIS_INSURANCE != "") {
                $query->where('r_jenis_asuransi.JENIS_ASURANSI_ID', $search->JENIS_INSURANCE->value);
            }
            if ($search->STATUS_PENGAJUAN != "") {
                $query->where('t_offer.OFFER_STAGING_ID', $search->STATUS_PENGAJUAN->value);
            }
            if ($search->STATUS_PROSES != "") {
                $query->where('t_offer.OFFER_STATUS_ID', $search->STATUS_PROSES->value);
            }

            if ($userType == 2 || $userType == "2") { // for bank
                $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
            }
            if ($userType == 4 || $userType == "4") { // for insurance
                $query->where('t_insurance.INSURANCE_ID', $user->INSURANCE_ID);
            }
            // end for search
        } else {
            // Filter data sesuai login usser
            $query->where('t_offer.OFFER_SUBMISSION_CODE', "asdasdasda");
        }




        // $arrData = $query->toSql();
        // echo $arrData;
        // exit;
        $arrData = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($arrData);
    }

    public function getGenerateExcel(Request $request)
    {

        $user = Auth::user();
        $userType = $user->user_type_id;
        // dd($user);

        // $perPage = $request->input('per_page', 10);
        // $sortColumn = $request->input('sort_column', 'OFFER_ID');
        // $sortDirection = $request->input('sort_direction', 'DESC');
        // $search = json_decode($request->input('search', ''));
        // $searchAble = is_countable($search);
        // print_r($search->STATUS_PROSES->value);
        // exit;
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $query = TOffer::query();
        $query->select(
            // 't_offer.OFFER_SUBMISSION_CODE',
            DB::raw("
                CASE 
                    WHEN t_offer.OFFER_AGE_ON_DUE_DATE != 'NaN Tahun NaN Bulan NaN Hari' THEN
                        CASE 
                            WHEN (t_loan_type.loan_type_id >= 14 AND t_loan_type.loan_type_id <= 17 AND t_theinsured.THE_INSURED_AGE > 55) AND t_offer.BANK_INSURANCE_ID IS NULL THEN '-'
                            ELSE 
                                CASE 
                                    WHEN t_theinsured.THE_INSURED_AGE >= 70 AND (MONTH(t_theinsured.THE_INSURED_AGE) >= 0 OR DAY(t_theinsured.THE_INSURED_AGE) >= 0) THEN 
                                        CASE 
                                            WHEN t_theinsured.THE_INSURED_AGE = 70 AND MONTH(t_theinsured.THE_INSURED_AGE) = 0 AND DAY(t_theinsured.THE_INSURED_AGE) = 0 THEN t_offer.OFFER_SUBMISSION_CODE
                                            ELSE '-'
                                        END
                                    ELSE t_offer.OFFER_SUBMISSION_CODE
                                END
                        END
                    ELSE '-'
                END AS KODE_PENGAJUAN
            "),
            'r_offer_status.offer_status_name',
            'r_staging_pengajuan.staging_pengajuan_name',
            't_theinsured.THE_INSURED_NAME',
            't_theinsured.THE_INSURED_DATE_OF_BIRTH',
            't_theinsured.THE_INSURED_AGE',
            't_offer.OFFER_AGE_ON_DUE_DATE',
            't_theinsured.THE_INSURED_ID_NUMBER',
            'r_jenis_asuransi.JENIS_ASURANSI_NAME',
            'r_tarif_payroll.TARIF_PAYROLL_NAME',
            't_offer.OFFER_INCEPTION_DATE',
            't_offer.OFFER_DUE_DATE',
            't_offer.OFFER_TENOR',
            't_offer.OFFER_SUM_INSURED',
            't_offer.OFFER_BANK_OFFICE_CODE',
            't_offer.OFFER_BANK_OFFICE_NAME',
            't_offer.OFFER_BANK_BRANCH_CODE',
            't_offer.OFFER_BANK_BRANCH_NAME',
            't_loan_type.loan_type_name',
            't_product.product_name',
            't_scheme.scheme_name',
            't_theinsured.THE_INSURED_CIF',
            DB::raw("CONCAT(t_user.user_login, ', ', t_offer.OFFER_CREATED_DATE)")
        );

        $query->leftJoin('t_theinsured', 't_theinsured.THE_INSURED_ID', '=', 't_offer.THE_INSURED_ID');
        $query->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_offer.JENIS_ASURANSI_ID');
        $query->leftJoin('r_tarif_payroll', 'r_tarif_payroll.TARIF_PAYROLL_ID', '=', 't_offer.TARIF_PAYROLL_ID');
        $query->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_offer.LOAN_TYPE_ID');
        $query->leftJoin('t_product_scheme_loan_type', 't_product_scheme_loan_type.loan_type_id', '=', 't_loan_type.loan_type_id');
        $query->leftJoin('t_product_scheme', 't_product_scheme.product_scheme_id', '=', 't_product_scheme_loan_type.product_scheme_id');
        $query->leftJoin('t_product', 't_product.product_id', '=', 't_product_scheme.product_id');
        $query->leftJoin('t_scheme', 't_scheme.scheme_id', '=', 't_product_scheme.scheme_id');
        $query->leftJoin('r_offer_status', 'r_offer_status.offer_status_id', '=', 't_offer.OFFER_STATUS_ID');
        $query->leftJoin('r_staging_pengajuan', 'r_staging_pengajuan.staging_pengajuan_id', '=', 't_offer.OFFER_STAGING_ID');
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer.BANK_INSURANCE_ID');
        $query->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID');
        $query->leftJoin('t_user', 't_user.id', '=', 't_offer.USER_BANK_ID');

        // $query->orderBy($sortColumn, $sortDirection);
        $query->orderBy('OFFER_UPDATED_DATE', 'DESC');
        $dataFilter = $request->dataFiltering;


        if ($dataFilter['START_DATE'] != "" || $dataFilter['END_DATE'] != "" || $dataFilter['JENIS_INSURANCE'] != "" || $dataFilter['STATUS_PENGAJUAN'] != "" || $dataFilter['STATUS_PROSES'] != "") {
            // for dataFilter
            if ($dataFilter['START_DATE'] != "" && $dataFilter['END_DATE'] != "") {
                // $query->where('t_offer.OFFER_SUBMISSION_CODE', 'like', "%{$dataFilter['START_DATE']}%");
                $query->whereBetween('t_offer.OFFER_INCEPTION_DATE', [$dataFilter['START_DATE'], $dataFilter['END_DATE']]);
            }
            if ($dataFilter['JENIS_INSURANCE'] != "") {
                $query->where('r_jenis_asuransi.JENIS_ASURANSI_ID', $dataFilter['JENIS_INSURANCE']['value']);
            }
            if ($dataFilter['STATUS_PENGAJUAN'] != "") {
                $query->where('t_offer.OFFER_STAGING_ID', $dataFilter['STATUS_PENGAJUAN']['value']);
            }
            if ($dataFilter['STATUS_PROSES'] != "") {
                $query->where('t_offer.OFFER_STATUS_ID', $dataFilter['STATUS_PROSES']['value']);
            }

            if ($userType == 2 || $userType == "2") { // for bank
                $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
            }
            if ($userType == 4 || $userType == "4") { // for insurance
                $query->where('t_insurance.INSURANCE_ID', $user->INSURANCE_ID);
            }
            // end for search
        } else {
            // Filter data sesuai login usser
            $query->where('t_offer.OFFER_SUBMISSION_CODE', "asdasdasda");
        }

        $arrData = $query->get();
        $date = now();
        return Excel::download(new LaporanPengajuan($arrData), $date . ' - LaporanPengajuan.xlsx');
    }
}
