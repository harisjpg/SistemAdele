<?php

namespace App\Http\Controllers;

use App\Exports\LaporanPenutupan;
use App\Models\TBusinessList;
use App\Models\TOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class laporanPenutupanController extends Controller
{
    public function index()
    {
        return Inertia::render('LaporanPenutupan/LaporanPenutupan', []);
    }

    public function getDataLaporanPenutupan(Request $request)
    {
        $user = Auth::user();
        $userType = $user->user_type_id;
        // dd($user);

        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'BUSINESS_LIST_ID');
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
        $query = TBusinessList::query();
        $query->select(
            't_business_list.BUSINESS_LIST_SUBMISSION_CODE',
            't_theinsured.THE_INSURED_NAME',
            't_theinsured.THE_INSURED_DATE_OF_BIRTH',
            't_theinsured.THE_INSURED_AGE',
            't_offer.OFFER_AGE_ON_DUE_DATE',
            't_theinsured.THE_INSURED_ID_NUMBER',
            'r_jenis_asuransi.JENIS_ASURANSI_NAME',
            'r_tarif_payroll.TARIF_PAYROLL_NAME',
            't_business_list.BUSINESS_LIST_INCEPTION_DATE',
            't_business_list.BUSINESS_LIST_DUE_DATE',
            't_business_list.BUSINESS_LIST_TENOR',
            't_business_list.BUSINESS_LIST_RATE',
            't_business_list.BUSINESS_LIST_AMOUNT',
            't_business_list.BUSINESS_LIST_SUM_INSURED',
            't_business_list.BankBranchCode',
            't_business_list.BankBranchName',
            't_business_list.BankOfficeCode',
            't_business_list.BankOfficeName',
            't_loan_type.loan_type_name',
            't_product.product_name',
            't_scheme.scheme_name',
            't_theinsured.THE_INSURED_CIF',
            // 't_business_list.BANK_INSURANCE_ID',
            // 't_business_list.OFFER_STAGING_ID',
            // 't_business_list.OFFER_SUBMISSION_CODE',
            // 't_user.user_login',
            // 't_business_list.OFFER_CREATED_DATE',
            // 'r_offer_status.offer_status_name',
            // 'r_staging_pengajuan.staging_pengajuan_name',
            // 't_insurance.INSURANCE_NAME',
            // // 't_insurance.INSURANCE_ID',
            // // 't_business_list.JENIS_ASURANSI_ID',
            // // 't_business_list.TARIF_PAYROLL_ID',
            // 't_business_list.LOAN_TYPE_ID',
            // 't_business_list.PRODUCT_ID',
            // 't_business_list.SCHEMA_ID',
        );

        $query->leftJoin('t_theinsured', 't_theinsured.THE_INSURED_ID', '=', 't_business_list.THE_INSURED_ID');
        $query->leftJoin('t_offer_detail', 't_offer_detail.OFFER_DETAIL_ID', '=', 't_business_list.offer_detail_id');
        $query->leftJoin('t_offer', 't_offer.OFFER_ID', '=', 't_offer_detail.OFFER_ID');
        $query->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_business_list.JENIS_ASURANSI_ID');
        $query->leftJoin('r_tarif_payroll', 'r_tarif_payroll.TARIF_PAYROLL_ID', '=', 't_business_list.TARIF_PAYROLL_ID');
        $query->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_business_list.LOAN_TYPE_ID');
        $query->leftJoin('t_product_scheme_loan_type', 't_product_scheme_loan_type.loan_type_id', '=', 't_loan_type.loan_type_id');
        $query->leftJoin('t_product_scheme', 't_product_scheme.product_scheme_id', '=', 't_product_scheme_loan_type.product_scheme_id');
        $query->leftJoin('t_product', 't_product.product_id', '=', 't_product_scheme.product_id');
        $query->leftJoin('t_scheme', 't_scheme.scheme_id', '=', 't_product_scheme.scheme_id');
        // $query->leftJoin('r_offer_status', 'r_offer_status.offer_status_id', '=', 't_business_list.OFFER_STATUS_ID');
        // $query->leftJoin('r_staging_pengajuan', 'r_staging_pengajuan.staging_pengajuan_id', '=', 't_business_list.OFFER_STAGING_ID');
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_business_list.BANK_INSURANCE_ID');
        $query->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID');
        // $query->leftJoin('t_user', 't_user.id', '=', 't_business_list.USER_BANK_ID');

        $query->orderBy($sortColumn, $sortDirection);
        $query->orderBy('t_business_list.BUSINESS_LIST_CREATED_DATE', 'DESC');

        if ($search->START_DATE != "" || $search->END_DATE != "") {
            // for search
            if ($search->START_DATE != "" && $search->END_DATE != "") {
                // $query->where('t_offer.OFFER_SUBMISSION_CODE', 'like', "%{$search->START_DATE}%");
                $query->whereBetween('t_business_list.BUSINESS_LIST_INCEPTION_DATE', [$search->START_DATE, $search->END_DATE]);
            }

            if ($userType == 2 || $userType == "2") { // for bank
                $query->where('t_business_list.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
            }
            if ($userType == 4 || $userType == "4") { // for insurance
                $query->where('t_insurance.INSURANCE_ID', $user->INSURANCE_ID);
            }
            // end for search
        } else {
            // Filter data sesuai login usser
            $query->where('t_business_list.BANK_BRANCH_ID', "asdasdasda");
        }




        // $arrData = $query->toSql();
        // echo $arrData;
        // exit;
        $arrData = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($arrData);
    }

    public function getGenerateExcelPenutupan(Request $request)
    {
        $user = Auth::user();
        $userType = $user->user_type_id;
        // dd($user);

        // $perPage = $request->input('per_page', 10);
        // $sortColumn = $request->input('sort_column', 'BUSINESS_LIST_ID');
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
        $query = TBusinessList::query();
        $query->select(
            't_business_list.BUSINESS_LIST_SUBMISSION_CODE',
            't_theinsured.THE_INSURED_NAME',
            't_theinsured.THE_INSURED_DATE_OF_BIRTH',
            't_theinsured.THE_INSURED_AGE',
            't_offer.OFFER_AGE_ON_DUE_DATE',
            't_theinsured.THE_INSURED_ID_NUMBER',
            'r_jenis_asuransi.JENIS_ASURANSI_NAME',
            'r_tarif_payroll.TARIF_PAYROLL_NAME',
            't_business_list.BUSINESS_LIST_INCEPTION_DATE',
            't_business_list.BUSINESS_LIST_DUE_DATE',
            't_business_list.BUSINESS_LIST_TENOR',
            't_business_list.BUSINESS_LIST_RATE',
            't_business_list.BUSINESS_LIST_AMOUNT',
            't_business_list.BUSINESS_LIST_SUM_INSURED',
            't_business_list.BankBranchCode',
            't_business_list.BankBranchName',
            't_business_list.BankOfficeCode',
            't_business_list.BankOfficeName',
            't_loan_type.loan_type_name',
            't_product.product_name',
            't_scheme.scheme_name',
            't_theinsured.THE_INSURED_CIF',
            // 't_business_list.BANK_INSURANCE_ID',
            // 't_business_list.OFFER_STAGING_ID',
            // 't_business_list.OFFER_SUBMISSION_CODE',
            // 't_user.user_login',
            // 't_business_list.OFFER_CREATED_DATE',
            // 'r_offer_status.offer_status_name',
            // 'r_staging_pengajuan.staging_pengajuan_name',
            // 't_insurance.INSURANCE_NAME',
            // // 't_insurance.INSURANCE_ID',
            // // 't_business_list.JENIS_ASURANSI_ID',
            // // 't_business_list.TARIF_PAYROLL_ID',
            // 't_business_list.LOAN_TYPE_ID',
            // 't_business_list.PRODUCT_ID',
            // 't_business_list.SCHEMA_ID',
        );

        $query->leftJoin('t_theinsured', 't_theinsured.THE_INSURED_ID', '=', 't_business_list.THE_INSURED_ID');
        $query->leftJoin('t_offer_detail', 't_offer_detail.OFFER_DETAIL_ID', '=', 't_business_list.offer_detail_id');
        $query->leftJoin('t_offer', 't_offer.OFFER_ID', '=', 't_offer_detail.OFFER_ID');
        $query->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_business_list.JENIS_ASURANSI_ID');
        $query->leftJoin('r_tarif_payroll', 'r_tarif_payroll.TARIF_PAYROLL_ID', '=', 't_business_list.TARIF_PAYROLL_ID');
        $query->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_business_list.LOAN_TYPE_ID');
        $query->leftJoin('t_product_scheme_loan_type', 't_product_scheme_loan_type.loan_type_id', '=', 't_loan_type.loan_type_id');
        $query->leftJoin('t_product_scheme', 't_product_scheme.product_scheme_id', '=', 't_product_scheme_loan_type.product_scheme_id');
        $query->leftJoin('t_product', 't_product.product_id', '=', 't_product_scheme.product_id');
        $query->leftJoin('t_scheme', 't_scheme.scheme_id', '=', 't_product_scheme.scheme_id');
        // $query->leftJoin('r_offer_status', 'r_offer_status.offer_status_id', '=', 't_business_list.OFFER_STATUS_ID');
        // $query->leftJoin('r_staging_pengajuan', 'r_staging_pengajuan.staging_pengajuan_id', '=', 't_business_list.OFFER_STAGING_ID');
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_business_list.BANK_INSURANCE_ID');
        $query->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID');
        // $query->leftJoin('t_user', 't_user.id', '=', 't_business_list.USER_BANK_ID');

        // $query->orderBy($sortColumn, $sortDirection);
        $query->orderBy('t_business_list.BUSINESS_LIST_CREATED_DATE', 'DESC');
        $dataFilter = $request->dataFiltering;

        if ($dataFilter['START_DATE'] != "" || $dataFilter['END_DATE'] != "") {
            // for search
            if ($dataFilter['START_DATE'] != "" && $dataFilter['END_DATE'] != "") {
                // $query->where('t_offer.OFFER_SUBMISSION_CODE', 'like', "%{$search->START_DATE}%");
                $query->whereBetween('t_business_list.BUSINESS_LIST_INCEPTION_DATE', [$dataFilter['START_DATE'], $dataFilter['END_DATE']]);
            }

            if ($userType == 2 || $userType == "2") { // for bank
                $query->where('t_business_list.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
            }
            if ($userType == 4 || $userType == "4") { // for insurance
                $query->where('t_insurance.INSURANCE_ID', $user->INSURANCE_ID);
            }
            // end for search
        } else {
            // Filter data sesuai login usser
            $query->where('t_business_list.BANK_BRANCH_ID', "asdasdasda");
        }




        // $arrData = $query->toSql();
        // echo $arrData;
        // exit;
        $arrData = $query->get();
        $date = now();
        return Excel::download(new LaporanPenutupan($arrData), $date . ' - LaporanPengajuan.xlsx');
    }
}
