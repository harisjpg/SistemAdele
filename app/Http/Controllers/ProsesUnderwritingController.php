<?php

namespace App\Http\Controllers;

use App\Models\TOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProsesUnderwritingController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->input('filter', null);

        return Inertia::render('ProsesUnderwriting/Index', []);
    }

    public function getOfferUnderwriting(Request $request)
    {
        $user = Auth::user();
        $userType = $user->user_type_id;

        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'OFFER_ID');
        $sortDirection = $request->input('sort_direction', 'DESC');
        $search = json_decode($request->input('search', ''));
        // $searchAble = is_countable($search);
        // dd($search);
        $status = $request->input('filter', null);  // Tambahkan status filter
        if ($status === 'null') {
            $status = null;
        }


        // Mulai query Bank List
        $query = TOffer::query();
        $query->select(
            't_offer.OFFER_ID',
            't_offer.BANK_INSURANCE_ID',
            't_offer.OFFER_STAGING_ID',
            't_offer.OFFER_SUBMISSION_CODE',
            't_theinsured.THE_INSURED_NAME',
            'r_tarif_payroll.TARIF_PAYROLL_NAME',
            'r_jenis_asuransi.JENIS_ASURANSI_NAME',
            't_loan_type.loan_type_name',
            't_user.user_login',
            't_offer.OFFER_CREATED_DATE',
            'r_offer_status.offer_status_name',
            'r_staging_pengajuan.staging_pengajuan_name',
            't_insurance.INSURANCE_NAME',
            't_insurance.INSURANCE_ID',
            't_theinsured.THE_INSURED_ID_NUMBER',
            't_theinsured.THE_INSURED_CIF',
            't_theinsured.THE_INSURED_DATE_OF_BIRTH',
            't_theinsured.THE_INSURED_AGE',
            't_offer.JENIS_ASURANSI_ID',
            't_offer.OFFER_BANK_OFFICE_NAME',
            't_offer.OFFER_BANK_OFFICE_CODE',
            't_offer.OFFER_BANK_BRANCH_NAME',
            't_offer.OFFER_BANK_BRANCH_CODE',
            't_offer.TARIF_PAYROLL_ID',
            't_offer.LOAN_TYPE_ID',
            't_offer.PRODUCT_ID',
            't_offer.SCHEMA_ID',
            't_offer.OFFER_SUM_INSURED',
            't_offer.OFFER_INCEPTION_DATE',
            't_offer.OFFER_TENOR',
            't_offer.OFFER_DUE_DATE',
            't_offer.OFFER_AGE_ON_DUE_DATE',
            't_product.product_name',
            't_scheme.scheme_name',
            't_theinsured.THE_INSURED_GENDER',
            't_theinsured.THE_INSURED_WEIGHT',
            't_theinsured.THE_INSURED_HEIGHT',
            't_theinsured.THE_INSURED_EMAIL',
            't_theinsured.MARITAL_STATUS_ID',
            't_offer.KODE_AO',
        );

        $query->leftJoin('t_theinsured', 't_theinsured.THE_INSURED_ID', '=', 't_offer.THE_INSURED_ID');
        $query->leftJoin('t_offer_detail', 't_offer_detail.OFFER_ID', '=', 't_offer.OFFER_ID');
        $query->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_offer.JENIS_ASURANSI_ID');
        $query->leftJoin('r_tarif_payroll', 'r_tarif_payroll.TARIF_PAYROLL_ID', '=', 't_offer.TARIF_PAYROLL_ID');
        $query->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_offer.LOAN_TYPE_ID');
        $query->leftJoin('t_product_scheme_loan_type', 't_product_scheme_loan_type.loan_type_id', '=', 't_loan_type.loan_type_id');
        $query->leftJoin('t_product_scheme', 't_product_scheme.product_scheme_id', '=', 't_product_scheme_loan_type.product_scheme_id');
        $query->leftJoin('t_product', 't_product.product_id', '=', 't_product_scheme.product_id');
        $query->leftJoin('t_scheme', 't_scheme.scheme_id', '=', 't_product_scheme.scheme_id');
        $query->leftJoin('r_offer_status', 'r_offer_status.offer_status_id', '=', 't_offer.OFFER_STATUS_ID');
        $query->leftJoin('r_staging_pengajuan', 'r_staging_pengajuan.staging_pengajuan_id', '=', 't_offer.OFFER_STAGING_ID');
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer_detail.BANK_INSURANCE_ID');
        $query->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID');
        $query->leftJoin('t_user', 't_user.id', '=', 't_offer.USER_BANK_ID');
        // $query->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_share_effective_date.JENIS_ASURANSI_ID')
        $query->orderBy($sortColumn, $sortDirection);
        $query->orderBy('OFFER_UPDATED_DATE', 'DESC');
        $query->where('t_offer.OFFER_IS_UNDERWRITING', 1);
        $query->where('t_offer_detail.OFFER_DETAIL_IS_USED', 1);

        // for filter status
        if ($status != null) {
            $query->where('t_offer.OFFER_STATUS_ID', $status);
            // Filter data sesuai login usser
            if ($userType == 2 || $userType == "2") { // for bank
                $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
            }
            if ($userType == 3 || $userType == "3") { // for broker
            }
            if ($userType == 4 || $userType == "4") { // for insurance
                $query->where('t_insurance.INSURANCE_ID', $user->INSURANCE_ID);
            }
        } else {
            if ($search !== "") {
                // for search
                $query->orWhere('t_offer.OFFER_SUBMISSION_CODE', 'like', "%{$search}%")
                    ->orWhere('t_theinsured.THE_INSURED_NAME', 'like', "%{$search}%")
                    ->orWhere('r_offer_status.offer_status_name', 'like', "%{$search}%");

                // if ($search->KODE_APLIKASI != "") {
                //     $query->where('t_offer.OFFER_SUBMISSION_CODE', 'like', "%{$search->KODE_APLIKASI}%");
                // }
                // if ($search->NAMA_DEBITUR != "") {
                //     $query->where('t_theinsured.THE_INSURED_NAME', 'like', "%{$search->NAMA_DEBITUR}%");
                // }
                // if ($search->STATUS_PENGAJUAN != null) {
                //     $query->where('t_offer.OFFER_STAGING_ID', $search->STATUS_PENGAJUAN->value);
                // }
                // if ($search->STATUS_PROSES != null) {
                //     $query->where('t_offer.OFFER_STATUS_ID', $search->STATUS_PROSES->value);
                // }
                // end for search

                // Filter data sesuai login usser
                if ($userType == 2 || $userType == "2") { // for bank
                    $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
                }
                if ($userType == 3 || $userType == "3") { // for broker
                }
                if ($userType == 4 || $userType == "4") { // for insurance
                    $query->where('t_insurance.INSURANCE_ID', $user->INSURANCE_ID);
                }
            } else {
                // Filter data sesuai login usser
                if ($userType == 2 || $userType == "2") { // for bank
                    $query->whereIn('t_offer.OFFER_STATUS_ID', [1, 2, 4]);
                    $query->where('t_offer.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
                }
                if ($userType == 3 || $userType == "3") { // for broker
                    $query->whereIn('t_offer.OFFER_STATUS_ID', [1, 2, 4]);
                    $query->whereIn('t_offer.OFFER_STAGING_ID', [2, 3, 4, 5, 8, 9, 10, 12, 13, 14]);
                }
                if ($userType == 4 || $userType == "4") { // for insurance
                    $query->whereIn('t_offer.OFFER_STAGING_ID', [6, 7]);
                    $query->where('t_insurance.INSURANCE_ID', $user->INSURANCE_ID);
                }
            }
        }
        // $arrData = $query->toSql();
        // echo $arrData;
        // exit;
        $arrData = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($arrData);
    }

    public function getDetailProsesUnderwriting(Request $request)
    {
        $arrOffer = TOffer::select(
            't_theinsured.THE_INSURED_NAME',
            't_theinsured.THE_INSURED_DATE_OF_BIRTH',
            't_theinsured.THE_INSURED_ID_NUMBER',
            't_theinsured.THE_INSURED_AGE',
            't_theinsured.THE_INSURED_CIF',
            't_theinsured.THE_INSURED_GENDER',
            't_theinsured.THE_INSURED_WEIGHT',
            't_theinsured.THE_INSURED_HEIGHT',
            't_theinsured.THE_INSURED_EMAIL',
            'r_marital_status.MARITAL_STATUS_NAME',
            'r_jenis_asuransi.JENIS_ASURANSI_NAME',
            'r_jenis_asuransi.JENIS_ASURANSI_ID',
            't_offer.OFFER_BANK_OFFICE_NAME',
            't_offer.OFFER_ID',
            't_offer.OFFER_STAGING_ID',
            'r_tarif_payroll.TARIF_PAYROLL_NAME',
            't_loan_type.loan_type_name',
            't_offer.OFFER_SUM_INSURED',
            't_offer.OFFER_INCEPTION_DATE',
            't_offer.OFFER_TENOR',
            't_offer.OFFER_DUE_DATE',
            't_offer.KODE_AO',
            't_offer.OFFER_AGE_ON_DUE_DATE',
            't_insurance.INSURANCE_NAME'
        )
            ->leftJoin('t_theinsured', 't_theinsured.THE_INSURED_ID', '=', 't_offer.THE_INSURED_ID')
            ->leftJoin('r_marital_status', 'r_marital_status.MARITAL_STATUS_SELECT', '=', 't_theinsured.MARITAL_STATUS_ID')
            ->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_offer.JENIS_ASURANSI_ID')
            ->leftJoin('r_tarif_payroll', 'r_tarif_payroll.TARIF_PAYROLL_ID', '=', 't_offer.TARIF_PAYROLL_ID')
            ->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_offer.LOAN_TYPE_ID')
            ->leftJoin('t_user', 't_user.id', '=', 't_offer.USER_BANK_ID')
            ->leftJoin('t_offer_detail', 't_offer_detail.OFFER_ID', '=', 't_offer.OFFER_ID')
            ->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer_Detail.BANK_INSURANCE_ID')
            ->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID')
            ->where('t_offer.OFFER_ID', $request->idOffer)
            ->where('t_offer_detail.OFFER_DETAIL_IS_USED', 1)
            ->first();

        return array(
            "pengajuanDetail"       => $arrOffer,
        );
    }
}
