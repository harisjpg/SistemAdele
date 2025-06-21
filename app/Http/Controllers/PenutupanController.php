<?php

namespace App\Http\Controllers;

use App\Models\Insurance;
use App\Models\TBusinessDocument;
use App\Models\TBusinessList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function App\Helpers\downloadFile;
use function App\Helpers\downloadFileCoverNote;

class PenutupanController extends Controller
{
    public function index()
    {
        $arrInsuranceList = Insurance::get();
        return Inertia::render('Penutupan/Penutupan', [
            "arrInsuranceList"          => $arrInsuranceList
        ]);
    }

    public function getBusinessList(Request $request)
    {
        $user = Auth::user();
        $userType = $user->user_type_id;
        // dd($user);

        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 't_business_list.BUSINESS_LIST_ID');
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
            't_business_list.BUSINESS_LIST_ID',
            't_business_list.BUSINESS_LIST_SUBMISSION_CODE',
            't_business_list.BankOfficeName',
            't_theinsured.THE_INSURED_NAME',
            't_covernote.covernote_date',
            't_covernote.covernote_due_date',
            't_covernote.document_id',
            't_covernote.covernote_number',
            't_loan_type.loan_type_name',
            'r_tarif_payroll.TARIF_PAYROLL_NAME',
            't_business_list.BUSINESS_LIST_INCEPTION_DATE',
            't_business_list.BUSINESS_LIST_DUE_DATE',
            't_business_list.BUSINESS_LIST_SUM_INSURED',
            't_business_list.BUSINESS_LIST_AMOUNT',
            't_insurance.INSURANCE_NAME',
            'r_jenis_asuransi.JENIS_ASURANSI_NAME',
            't_business_list.BUSINESS_LIST_CREATED_DATE',
        );

        $query->leftJoin('t_theinsured', 't_theinsured.THE_INSURED_ID', '=', 't_business_list.THE_INSURED_ID');
        $query->leftJoin('t_covernote', 't_covernote.businesslist_id', '=', 't_business_list.BUSINESS_LIST_ID');
        $query->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_business_list.LOAN_TYPE_ID');
        $query->leftJoin('r_tarif_payroll', 'r_tarif_payroll.TARIF_PAYROLL_ID', '=', 't_business_list.TARIF_PAYROLL_ID');
        $query->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_business_list.BANK_INSURANCE_ID');
        $query->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID');
        $query->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_business_list.JENIS_ASURANSI_ID');

        $query->orderBy($sortColumn, $sortDirection);

        if ($search != "") {
            // for search
            $query->where('t_insurance.INSURANCE_ID', $search);
            // end for search
            // Filter data sesuai login usser
            if ($userType == 2 || $userType == "2") { // for bank
                // $query->whereIn('t_offer.OFFER_STATUS_ID', [1, 2, 4]);
                $query->where('t_business_list.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
            }
            if ($userType == 3 || $userType == "3") { // for broker
                // $query->whereIn('t_offer.OFFER_STATUS_ID', [1, 2, 4]);
                // $query->whereIn('t_offer.OFFER_STAGING_ID', [2, 3, 4, 5, 8, 9, 10, 12, 13, 14]);
            }
            if ($userType == 4 || $userType == "4") { // for insurance
                // $query->whereIn('t_offer.OFFER_STAGING_ID', [6, 7]);
                $query->where('t_insurance.INSURANCE_ID', $user->INSURANCE_ID);
            }
        } else {
            // Filter data sesuai login usser
            if ($userType == 2 || $userType == "2") { // for bank
                // $query->whereIn('t_offer.OFFER_STATUS_ID', [1, 2, 4]);
                $query->where('t_business_list.BANK_BRANCH_ID', $user->BANK_BRANCH_ID);
            }
            if ($userType == 3 || $userType == "3") { // for broker
                // $query->whereIn('t_offer.OFFER_STATUS_ID', [1, 2, 4]);
                // $query->whereIn('t_offer.OFFER_STAGING_ID', [2, 3, 4, 5, 8, 9, 10, 12, 13, 14]);
            }
            if ($userType == 4 || $userType == "4") { // for insurance
                // $query->whereIn('t_offer.OFFER_STAGING_ID', [6, 7]);
                $query->where('t_insurance.INSURANCE_ID', $user->INSURANCE_ID);
            }
        }




        // $arrData = $query->toSql();
        // echo $arrData;
        // exit;
        $arrData = $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($arrData);
    }

    public function downloadCoverNote($idDocument)
    {
        return downloadFile($idDocument);
    }

    public function getDetailBusinessList(Request $request)
    {
        $arrData = TBusinessList::select(
            "t_business_list.BUSINESS_LIST_ID",
            "t_theinsured.THE_INSURED_NAME",
            "t_theinsured.THE_INSURED_DATE_OF_BIRTH",
            "t_theinsured.THE_INSURED_ID_NUMBER",
            "t_theinsured.THE_INSURED_AGE",
            "t_theinsured.THE_INSURED_CIF",
            "t_business_list.BankOfficeName",
            "t_insurance.INSURANCE_NAME",
            "t_covernote.covernote_date",
            "t_covernote.covernote_due_date",
            "t_business_list.BUSINESS_LIST_SUM_INSURED",
            "t_covernote.covernote_number",
            "t_bank_insurance.BANK_INSURANCE_STATUS",
            "t_business_list.BUSINESS_LIST_RATE",
            "t_offer.OFFER_AGE_ON_DUE_DATE",
            "t_business_list.BUSINESS_LIST_AMOUNT"
        )
            ->leftJoin('t_theinsured', 't_theinsured.THE_INSURED_ID', '=', 't_business_list.THE_INSURED_ID')
            ->leftJoin('t_offer_detail', 't_offer_detail.OFFER_DETAIL_ID', '=', 't_business_list.offer_detail_id')
            ->leftJoin('t_offer', 't_offer.OFFER_ID', '=', 't_offer_detail.OFFER_ID')
            ->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_business_list.BANK_INSURANCE_ID')
            ->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID')
            ->leftJoin('t_covernote', 't_covernote.businesslist_id', '=', 't_business_list.BUSINESS_LIST_ID')
            ->where('BUSINESS_LIST_ID', $request->idBusinessList)->first();

        $arrDoc = TBusinessDocument::where('BUSINESS_LIST_ID', $request->idBusinessList)
            ->leftJoin('t_document', 't_document.document_id', '=', 't_business_document.document_id')
            ->leftJoin('r_document_type', 'r_document_type.document_type_id', '=', 't_business_document.document_type_id')
            ->get();

        return array(
            "arrData"   => $arrData,
            "arrDoc"    => $arrDoc,
        );
    }
}
