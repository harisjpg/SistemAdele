<?php

namespace App\Http\Controllers;

use App\Models\BankBranch;
use App\Models\Document;
use App\Models\Insurance;
use App\Models\MOfferInsurance;
use App\Models\RDocumentType;
use App\Models\RJenisAsuransi;
use App\Models\RTarifPayroll;
use App\Models\TBankInsurance;
use App\Models\TBusinessDocument;
use App\Models\TBusinessList;
use App\Models\TCatatanBroker;
use App\Models\TCoverNote;
use App\Models\TLoanType;
use App\Models\TMekanismeProdukAsuransi;
use App\Models\TOffer;
use App\Models\TOfferDetail;
use App\Models\TOfferStaging;
use App\Models\TParameterProduk;
use App\Models\TProductSchemeLoanType;
use App\Models\TProdukAsuransi;
use App\Models\TRateHistory;
use App\Models\TTheInsured;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

use function App\Helpers\calculateRatePremiAdeleSistem;
use function App\Helpers\generatePdfCoverNote;
use function App\Helpers\getAllInsurance;
use function App\Helpers\getAllTotal;
use function App\Helpers\getAllTotalBatal;
use function App\Helpers\getAllTotalPending;
use function App\Helpers\getAllTotalPengajuan;
use function App\Helpers\getAllTotalPenutupan;
use function App\Helpers\getAllTotalProses;
use function App\Helpers\getAllTotalSetuju;
use function App\Helpers\getAllTotalTolak;
use function App\Helpers\getBankInsuranceEffective;
use function App\Helpers\getCoverNoteNumber;
use function App\Helpers\getCurrentEffectiveDate;
use function App\Helpers\getCurrentEffectiveDateInsurance;
use function App\Helpers\getDataCoverNoteById;
use function App\Helpers\getDetailOfferAll;
use function App\Helpers\getDetailOfferAllForBusiness;
use function App\Helpers\getInsuranceById;
use function App\Helpers\getInsuranceId;
use function App\Helpers\getProdukAsuransi;
use function App\Helpers\getProdukAsuransiById;
use function App\Helpers\getProdukSubProdukNew;
use function App\Helpers\getRateHistory;
use function App\Helpers\getShareConfigurationByEffectiveIdAndNoRedFlag;
use function App\Helpers\regNumberCodePengajuan;
use function App\Helpers\tgl_format_indo;
use function App\Helpers\tgl_format_indo_lengkap;

class PengajuanController extends Controller
{
    public function RemoveSpecialChar($str)
    {
        $replace = Str::of($str)->replace(
            [
                '`',
                '~',
                ' ',
                '!',
                '@',
                '#',
                '$',
                '%',
                '^',
                '&',
                '*',
                '(',
                ')',
                '+',
                '=',
                '<',
                '>',
                '{',
                '}',
                '[',
                ']',
                '?',
                '/',
                ':',
                ';'
            ],
            '-'
        );
        return $replace;
    }

    public function index(Request $request)
    {
        $filter = $request->input('filter', null);
        $bankId = NULL;
        $dataComboBankBranch = DB::select('call sp_combo_bankbranch(?)', [$bankId]);
        $tarifPayroll = RTarifPayroll::get();
        $loanType = TLoanType::get();
        $arrStatusPengajuan = DB::table('r_staging_pengajuan')->get();
        $arrStatusProses = DB::table('r_offer_status')->get();
        $arrMaritalStatus = DB::table('r_marital_status')->get();

        return Inertia::render('PengajuanDebitur/Index', [
            'dataComboBankBranch' => $dataComboBankBranch,
            'tarifPayroll'        => $tarifPayroll,
            'loanType'            => $loanType,
            'arrStatusPengajuan'  => $arrStatusPengajuan,
            'arrStatusProses'     => $arrStatusProses,
            'filter'              => $filter,
            'arrMaritalStatus'    => $arrMaritalStatus
        ]);
    }

    public function getOffer(Request $request)
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
        // $query->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_share_effective_date.JENIS_ASURANSI_ID')
        $query->orderBy($sortColumn, $sortDirection);
        $query->orderBy('OFFER_UPDATED_DATE', 'DESC');
        $query->where('t_offer.OFFER_IS_UNDERWRITING', 0);
        $query->where('t_offer.OFFER_IS_PENAWARAN', 0);

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

    public function getFindTheInsured(Request $request)
    {
        $data = TTheInsured::select('THE_INSURED_ID', 'THE_INSURED_NAME', 'THE_INSURED_DATE_OF_BIRTH', 'THE_INSURED_AGE', 'THE_INSURED_ID_NUMBER', 'THE_INSURED_CIF', 'DOCUMENT_KTP_ID')->get();

        return response()->json($data);
    }

    public function getProdukSubProduk(Request $request)
    {
        $data = TProductSchemeLoanType::where('loan_type_id', $request->idLoanType)->leftJoin('t_product_scheme', 't_product_scheme.product_scheme_id', '=', 't_product_scheme_loan_type.product_scheme_id')->leftJoin('t_product', 't_product.product_id', '=', 't_product_scheme.product_id')->leftJoin('t_scheme', 't_scheme.scheme_id', '=', 't_product_scheme.scheme_id')->get();

        return response()->json($data);
    }

    public function getBranchCodeName(Request $request)
    {
        $data['data1'] = BankBranch::where('BANK_BRANCH_ID', $request->idCabang)->get();
        $getParentId = $data['data1'][0]['BANK_BRANCH_PARENT_ID'];

        if (($getParentId === 0 || $getParentId === "0") || ($getParentId == 1 || $getParentId == "1")) {
            $data['data2'] = BankBranch::where('BANK_BRANCH_ID', $request->idCabang)->get();
        } else {
            $data['data2'] = BankBranch::where('BANK_BRANCH_ID', $getParentId)->get();
        }

        return response()->json($data);
    }

    public function getOfferToken($id)
    {
        $data = TOffer::where('THE_INSURED_ID', $id)
            ->leftJoin('t_offer_detail', 't_offer_detail.offer_id', '=', 't_offer.offer_id')
            ->where('OFFER_STATUS', 0)
            ->where('OFFER_DETAIL_DEBITUR_IS_AGREE', 0)->get();

        return $data;
    }

    public function addPengajuanDebitur(Request $request)
    {
        // dd($request);
        $validateData = Validator::make($request->all(), [
            // 'data_kredit.*.JENIS_ASURANSI'              => 'required',
            'data_kredit.*.NAMA_KANTOR'                 => 'required',
            'data_kredit.*.TARIF_PAYROLL'               => 'required',
            'data_kredit.*.LOAN_TYPE'                   => 'required',
            'data_debitur.*.TGL_LAHIR'                   => 'required',
            'data_kredit.*.RENCANA_TANGGAL_PENCAIRAN'   => 'required',
        ], [
            // 'data_kredit.*.JENIS_ASURANSI'              => 'Jenis Asuransi is required!',
            'data_kredit.*.NAMA_KANTOR'                 => 'Nama Kantor is required!',
            'data_kredit.*.TARIF_PAYROLL'               => 'Tarif Payroll is required!',
            'data_kredit.*.LOAN_TYPE'                   => 'Loan Type is required!',
            'data_debitur.*.TGL_LAHIR'                   => 'Tgl Lahir is required!',
            'data_kredit.*.RENCANA_TANGGAL_PENCAIRAN'   => 'Rencana Tgl Pencairan is required!',
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        $result = DB::transaction(function () use ($request) {

            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // cek existing the insured create or update
            $debiturBaru = $request->DEBITUR_BARU['value'];
            $idTheInsured = "";
            $documentKTP = $request->file('UPLOAD_KTP');
            if ($debiturBaru == 1 || $debiturBaru == "1") { // Buat Debitur Baru
                $dataDebitur = is_countable($request->data_debitur);
                if ($dataDebitur) {
                    for ($i = 0; $i < sizeof($request->data_debitur); $i++) {
                        $arrDebitur = $request->data_debitur[$i];

                        $createDebitur = TTheInsured::create([
                            "THE_INSURED_NAME"          => $arrDebitur['NAMA_DEBITUR'],
                            "THE_INSURED_ID_NUMBER"     => $arrDebitur['NIK_DEBITUR'],
                            "THE_INSURED_DATE_OF_BIRTH" => $arrDebitur['TGL_LAHIR'],
                            "THE_INSURED_AGE"           => $arrDebitur['USIA_DEBITUR'],
                            "THE_INSURED_CREATED_BY"    => $user_id,
                            "THE_INSURED_CREATED_DATE"  => $date,
                            "THE_INSURED_CIF"           => isset($arrDebitur['CIF_DEBITUR']) ? $arrDebitur['CIF_DEBITUR'] : NULL,
                        ])->THE_INSURED_ID;


                        if ($request->detail_insurance_life[0]['EMAIL_DEBITUR'] !== null && $request->detail_insurance_life[0]['GENDER_DEBITUR'] !== null && $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] !== null && $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] !== null && $request->detail_insurance_life[0]['MARITAL_STATUS'] !== null) {
                            $updateTheInsured = TTheInsured::where('THE_INSURED_ID', $createDebitur)->update([
                                "THE_INSURED_EMAIL"         => $request->detail_insurance_life[0]['EMAIL_DEBITUR'] !== null ? $request->detail_insurance_life[0]['EMAIL_DEBITUR'] : NULL,
                                "THE_INSURED_GENDER"        => $request->detail_insurance_life[0]['GENDER_DEBITUR'] !== null ? $request->detail_insurance_life[0]['GENDER_DEBITUR']['value'] : NULL,
                                "THE_INSURED_WEIGHT"        => $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] !== null ? $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] : NULL,
                                "THE_INSURED_HEIGHT"        => $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] !== null ? $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] : NULL,
                                "MARITAL_STATUS_ID"         => $request->detail_insurance_life[0]['MARITAL_STATUS'] !== null ? $request->detail_insurance_life[0]['MARITAL_STATUS']['value'] : NULL,
                            ]);
                        }

                        UserLog::create([
                            'created_by' => $user->id,
                            'action'     => json_encode([
                                "description" => "Created (The Insured)",
                                "module"      => "Pengajuan",
                                "id"          => $createDebitur
                            ]),
                            'action_by'  => $user->user_login
                        ]);
                    }


                    // Create Document KTP for The Insured
                    if ($documentKTP != null) {

                        for ($i = 0; $i < sizeof($documentKTP); $i++) {
                            $arrDocument = $documentKTP;

                            // create folder the insured
                            $parentDir = ((floor(($createDebitur) / 1000)) * 1000) . '/';
                            $RateSettingId = $createDebitur . '/';
                            $typeDir = "";
                            $uploadPath = 'document/DEBITUR/KTP/' . $parentDir . $RateSettingId . $typeDir;

                            // get Data Document
                            $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                            $documentFileName = $createDebitur . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                            $documentDirName = $uploadPath;
                            $documentFileType = $arrDocument[$i]->getMimeType();
                            $documentFileSize = $arrDocument[$i]->getSize();

                            // create folder in directory laravel
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $createDebitur . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

                            // masukan data file ke database
                            $document = Document::create([
                                'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                                'DOCUMENT_FILENAME'             => $documentFileName,
                                'DOCUMENT_DIRNAME'              => $documentDirName,
                                'DOCUMENT_FILETYPE'             => $documentFileType,
                                'DOCUMENT_FILESIZE'             => $documentFileSize,
                                'DOCUMENT_CREATED_BY'           => $user_id
                            ])->DOCUMENT_ID;

                            if ($document) {
                                TTheInsured::where('THE_INSURED_ID', $createDebitur)
                                    ->update([
                                        'DOCUMENT_KTP_ID'    => $document
                                    ]);
                            }
                        }
                    }

                    $idTheInsured = $createDebitur;
                }
            } else { // Existing Debitur
                $dataDebitur = is_countable($request->data_debitur);
                if ($dataDebitur) {
                    for ($i = 0; $i < sizeof($request->data_debitur); $i++) {
                        $arrDebitur = $request->data_debitur[$i];
                        // Get Name Debitur With Id
                        $nameDebitur = TTheInsured::select('THE_INSURED_NAME')->where('THE_INSURED_ID', $arrDebitur['NAMA_DEBITUR']['value'])->get();


                        $createDebitur = TTheInsured::where('THE_INSURED_ID', $arrDebitur['NAMA_DEBITUR']['value'])->update([
                            "THE_INSURED_NAME"          => $nameDebitur[0]['THE_INSURED_NAME'],
                            "THE_INSURED_ID_NUMBER"     => $arrDebitur['NIK_DEBITUR'],
                            "THE_INSURED_DATE_OF_BIRTH" => $arrDebitur['TGL_LAHIR'],
                            "THE_INSURED_AGE"           => $arrDebitur['USIA_DEBITUR'],
                            "THE_INSURED_UPDATED_BY"    => $user_id,
                            "THE_INSURED_UPDATED_DATE"  => $date,
                            "THE_INSURED_CIF"           => isset($arrDebitur['CIF_DEBITUR']) ? $arrDebitur['CIF_DEBITUR'] : NULL,
                        ]);

                        if ($request->detail_insurance_life[0]['EMAIL_DEBITUR'] !== null && $request->detail_insurance_life[0]['GENDER_DEBITUR'] !== null && $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] !== null && $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] !== null && $request->detail_insurance_life[0]['MARITAL_STATUS'] !== null) {
                            $updateTheInsured = TTheInsured::where('THE_INSURED_ID', $arrDebitur['NAMA_DEBITUR']['value'])->update([
                                "THE_INSURED_EMAIL"         => $request->detail_insurance_life[0]['EMAIL_DEBITUR'] !== null ? $request->detail_insurance_life[0]['EMAIL_DEBITUR'] : NULL,
                                "THE_INSURED_GENDER"        => $request->detail_insurance_life[0]['GENDER_DEBITUR'] !== null ? $request->detail_insurance_life[0]['GENDER_DEBITUR']['value'] : NULL,
                                "THE_INSURED_WEIGHT"        => $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] !== null ? $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] : NULL,
                                "THE_INSURED_HEIGHT"        => $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] !== null ? $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] : NULL,
                                "MARITAL_STATUS_ID"         => $request->detail_insurance_life[0]['MARITAL_STATUS'] !== null ? $request->detail_insurance_life[0]['MARITAL_STATUS']['value'] : NULL,
                            ]);
                        }

                        UserLog::create([
                            'created_by' => $user->id,
                            'action'     => json_encode([
                                "description" => "Updated (The Insured)",
                                "module"      => "Pengajuan",
                                "id"          => $arrDebitur['NAMA_DEBITUR']['value']
                            ]),
                            'action_by'  => $user->user_login
                        ]);
                    }

                    // Create Document KTP for The Insured
                    if ($documentKTP != null) {
                        for ($i = 0; $i < sizeof($documentKTP); $i++) {
                            $arrDocument = $documentKTP;

                            // create folder the insured
                            $parentDir = ((floor(($request->data_debitur[0]['NAMA_DEBITUR']['value']) / 1000)) * 1000) . '/';
                            $RateSettingId = $request->data_debitur[0]['NAMA_DEBITUR']['value'] . '/';
                            $typeDir = "";
                            $uploadPath = 'document/DEBITUR/KTP/' . $parentDir . $RateSettingId . $typeDir;

                            // get Data Document
                            $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                            $documentFileName = $request->data_debitur[0]['NAMA_DEBITUR']['value'] . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                            $documentDirName = $uploadPath;
                            $documentFileType = $arrDocument[$i]->getMimeType();
                            $documentFileSize = $arrDocument[$i]->getSize();

                            // create folder in directory laravel
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $request->data_debitur[0]['NAMA_DEBITUR']['value'] . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

                            // masukan data file ke database
                            $document = Document::create([
                                'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                                'DOCUMENT_FILENAME'             => $documentFileName,
                                'DOCUMENT_DIRNAME'              => $documentDirName,
                                'DOCUMENT_FILETYPE'             => $documentFileType,
                                'DOCUMENT_FILESIZE'             => $documentFileSize,
                                'DOCUMENT_CREATED_BY'           => $user_id
                            ])->DOCUMENT_ID;

                            if ($document) {
                                TTheInsured::where('THE_INSURED_ID', $request->data_debitur[0]['NAMA_DEBITUR']['value'])
                                    ->update([
                                        'DOCUMENT_KTP_ID'    => $document
                                    ]);
                            }
                        }
                    }

                    $idTheInsured = $arrDebitur['NAMA_DEBITUR']['value'];
                }
            }
            // end cek existing the insured create or update


            // create data pengajuan
            // get offer toker
            $token = "";
            $cariToken = $this->getOfferToken($idTheInsured);

            if (isset($cariToken[0]['OFFER_TOKEN'])) {
                $token = $cariToken[0]['OFFER_TOKEN'];
            } else {
                $token = time();
            }

            for ($i = 0; $i < sizeof($request->data_kredit); $i++) {
                $arrKredit = $request->data_kredit[$i];

                // get code pengajuan debitur
                $getTanggalAwal = $arrKredit['RENCANA_TANGGAL_PENCAIRAN'];
                $getCodeKantor = $arrKredit['KODE_KANTOR'];
                $codePengajuan = regNumberCodePengajuan($kode_broker = "FPM", $getCodeKantor, $getTanggalAwal);
                // end get code pengajuan debitur

                // get Product Id dan Schema(Sub Produk) \
                $arrDataLoanType = getProdukSubProdukNew($arrKredit['LOAN_TYPE']['value']);
                $produk_id = $arrDataLoanType[0]['product_id'];
                $sub_produk_id = $arrDataLoanType[0]['scheme_id'];
                // end get Product Id dan Schema(Sub Produk)

                // get nama kantor dan code 
                $arrKantor = BankBranch::where('BANK_BRANCH_ID', $arrKredit['NAMA_KANTOR']['value'])->get();
                $nameKantor = $arrKantor[0]['BANK_BRANCH_NAME'];
                // end get nama kantor dan code


                $createTOffer = TOffer::create([
                    "OFFER_TOKEN"               => $token,
                    "BANK_LIST_ID"              => $user->BANK_LIST_ID,
                    "BANK_BRANCH_ID"            => $user->BANK_BRANCH_ID,
                    "USER_BANK_ID"              => $user_id,
                    "THE_INSURED_ID"            => $idTheInsured,
                    "OFFER_SUBMISSION_CODE"     => $codePengajuan,
                    "OFFER_SUM_INSURED"         => $arrKredit['SUM_INSURED'],
                    "OFFER_INCEPTION_DATE"      => $arrKredit['RENCANA_TANGGAL_PENCAIRAN'],
                    "OFFER_DUE_DATE"            => $arrKredit['TGL_AKHIR_KREDIT'],
                    "OFFER_AGE_ON_DUE_DATE"     => $arrKredit['USIA_JATUH_TEMPO'],
                    // "OFFER_BANK_BRANCH_NAME"    => $arrKredit['NAMA_CABANG'],
                    // "OFFER_BANK_BRANCH_CODE"    => $arrKredit['KODE_CABANG'],
                    "OFFER_BANK_OFFICE_NAME"    => $nameKantor,
                    "OFFER_BANK_OFFICE_CODE"    => $arrKredit['KODE_KANTOR'],
                    "LOAN_TYPE_ID"              => $arrKredit['LOAN_TYPE']['value'],
                    "PRODUCT_ID"                => $produk_id,
                    "SCHEMA_ID"                 => $sub_produk_id,
                    "OFFER_TENOR"               => $arrKredit['TENOR'],
                    "OFFER_CREATED_BY"          => $user_id,
                    "OFFER_CREATED_DATE"        => $date,
                    "TARIF_PAYROLL_ID"          => $arrKredit['TARIF_PAYROLL']['value'],
                    // "JENIS_ASURANSI_ID"         => $arrKredit['JENIS_ASURANSI']['value'],
                    "OFFER_STATUS_ID"           => 2,
                    "OFFER_STAGING_ID"          => 2,
                    "KODE_AO"                   => $request->detail_insurance_life[0]['KODE_AO'] !== null ? $request->detail_insurance_life[0]['KODE_AO'] : NULL,
                ])->OFFER_ID;

                // create log
                UserLog::create([
                    'created_by' => $user->id,
                    'action'     => json_encode([
                        "description" => "Created (Pengajuan Debitur)",
                        "module"      => "Pengajuan",
                        "id"          => $createTOffer
                    ]),
                    'action_by'  => $user->user_login
                ]);
            }
            // end create data pengajuan

            // create staging
            TOfferStaging::create([
                'offer_id'              => $createTOffer,
                'staging_pengajuan_id'  => 1,
                'offer_staging_by'      => $user_id,
                'offer_staging_date'    => $date
            ]);
            TOfferStaging::create([
                'offer_id'              => $createTOffer,
                'staging_pengajuan_id'  => 2,
                'offer_staging_by'      => $user_id,
                'offer_staging_date'    => $date
            ]);
            // end create staging

            // create ktp jika ada ke document business
            $arrData = TTheInsured::where('THE_INSURED_ID', $idTheInsured)->get();
            $cekExistingKTP = $arrData[0]['DOCUMENT_KTP_ID'];
            if ($cekExistingKTP != null) {
                $createDocumentKTP = TBusinessDocument::create([
                    "OFFER_ID"          => $createTOffer,
                    "DOCUMENT_TYPE_ID"  => 1,
                    "DOCUMENT_ID"       => $cekExistingKTP
                ]);
            } else {
                $documentUploadKTP = $request->file('UPLOAD_KTP');
                if ($documentUploadKTP != null) {
                    for ($i = 0; $i < sizeof($documentUploadKTP); $i++) {
                        $arrDocument = $documentUploadKTP;

                        // create folder the insured
                        $parentDir = ((floor(($createTOffer) / 1000)) * 1000) . '/';
                        $RateSettingId = $createTOffer . '/';
                        $typeDir = "";
                        $uploadPath = 'document/BUSINESS/KTP/' . $parentDir . $RateSettingId . $typeDir;

                        // get Data Document
                        $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                        $documentFileName = $createTOffer . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                        $documentDirName = $uploadPath;
                        $documentFileType = $arrDocument[$i]->getMimeType();
                        $documentFileSize = $arrDocument[$i]->getSize();

                        // create folder in directory laravel
                        Storage::makeDirectory($uploadPath, 0777, true, true);
                        Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $createTOffer . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

                        // masukan data file ke database
                        $document = Document::create([
                            'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                            'DOCUMENT_FILENAME'             => $documentFileName,
                            'DOCUMENT_DIRNAME'              => $documentDirName,
                            'DOCUMENT_FILETYPE'             => $documentFileType,
                            'DOCUMENT_FILESIZE'             => $documentFileSize,
                            'DOCUMENT_CREATED_BY'           => $user_id
                        ])->DOCUMENT_ID;

                        if ($document) {
                            $createDocumentKTP = TBusinessDocument::create([
                                "OFFER_ID"          => $createTOffer,
                                "DOCUMENT_TYPE_ID"  => 1,
                                "DOCUMENT_ID"       => $document
                            ]);
                        }
                    }
                }
            }
            // end create ktp jika ada ke document business

            // for upload ktp spajk dan mcu jika ada
            $documentUploadSPAJK = $request->file('UPLOAD_SPAJK');
            $documentUploadMCU = $request->file('UPLOAD_MCU');


            if ($documentUploadSPAJK != null) {
                for ($i = 0; $i < sizeof($documentUploadSPAJK); $i++) {
                    $arrDocument = $documentUploadSPAJK;

                    // create folder the insured
                    $parentDir = ((floor(($createTOffer) / 1000)) * 1000) . '/';
                    $RateSettingId = $createTOffer . '/';
                    $typeDir = "";
                    $uploadPath = 'document/BUSINESS/SPAJK/' . $parentDir . $RateSettingId . $typeDir;

                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentFileName = $createTOffer . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $arrDocument[$i]->getMimeType();
                    $documentFileSize = $arrDocument[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $createTOffer . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

                    // masukan data file ke database
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                        'DOCUMENT_FILENAME'             => $documentFileName,
                        'DOCUMENT_DIRNAME'              => $documentDirName,
                        'DOCUMENT_FILETYPE'             => $documentFileType,
                        'DOCUMENT_FILESIZE'             => $documentFileSize,
                        'DOCUMENT_CREATED_BY'           => $user_id
                    ])->DOCUMENT_ID;

                    if ($document) {
                        $createDocumentKTP = TBusinessDocument::create([
                            "OFFER_ID"          => $createTOffer,
                            "DOCUMENT_TYPE_ID"  => 2,
                            "DOCUMENT_ID"       => $document
                        ]);
                    }
                }
            }
            if ($documentUploadMCU != null) {
                for ($i = 0; $i < sizeof($documentUploadMCU); $i++) {
                    $arrDocument = $documentUploadMCU;

                    // create folder the insured
                    $parentDir = ((floor(($createTOffer) / 1000)) * 1000) . '/';
                    $RateSettingId = $createTOffer . '/';
                    $typeDir = "";
                    $uploadPath = 'document/BUSINESS/MCU/' . $parentDir . $RateSettingId . $typeDir;

                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentFileName = $createTOffer . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $arrDocument[$i]->getMimeType();
                    $documentFileSize = $arrDocument[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $createTOffer . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

                    // masukan data file ke database
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                        'DOCUMENT_FILENAME'             => $documentFileName,
                        'DOCUMENT_DIRNAME'              => $documentDirName,
                        'DOCUMENT_FILETYPE'             => $documentFileType,
                        'DOCUMENT_FILESIZE'             => $documentFileSize,
                        'DOCUMENT_CREATED_BY'           => $user_id
                    ])->DOCUMENT_ID;

                    if ($document) {
                        $createDocumentKTP = TBusinessDocument::create([
                            "OFFER_ID"          => $createTOffer,
                            "DOCUMENT_TYPE_ID"  => 3,
                            "DOCUMENT_ID"       => $document
                        ]);
                    }
                }
            }
            // end for upload ktp spajk dan mcu jika ada

            // create offer detail
            // get asuransi dari insurance yang ada asuransinya, karena sudah tidak menggunakan lagi share effective date, dan bank insurance idnya

            $arrInsurance = getAllInsurance();

            for ($i = 0; $i < sizeof($arrInsurance); $i++) {
                // get data offer untuk detailing
                $arrOffer = TOffer::where('OFFER_ID', $createTOffer)->get();
                $arrTheInsured = TTheInsured::where('THE_INSURED_ID', $arrOffer[0]['THE_INSURED_ID'])->get();
                // $arrBankInsurance = TBankInsurance::where('INSURANCE_ID', $arrInsurance[$i]['INSURANCE_ID'])->first();
                // dd($arrBankInsurance);

                $reg["documenIdRate"] = $arrInsurance[$i]["RATE_MANAGE_ID"];
                $reg["insurance_id"] = $arrInsurance[$i]["INSURANCE_ID"];
                $reg["age"] = $arrTheInsured[0]['THE_INSURED_AGE'];
                $reg["tenor_reg"] = $arrOffer[0]['OFFER_TENOR'];
                $reg["birth_date"] = $arrTheInsured[0]['THE_INSURED_DATE_OF_BIRTH'];
                $reg["plafond"] = $arrOffer[0]['OFFER_SUM_INSURED'];
                $reg["jenis_rate"] = $arrOffer[0]['TARIF_PAYROLL_ID'];
                $reg["tanggal_awal"] = $arrOffer[0]['OFFER_INCEPTION_DATE'];

                $hasilPremiRate = calculateRatePremiAdeleSistem($reg);

                $hasilTotal = $hasilPremiRate["premium"];

                if ($hasilTotal > 0) {
                    $arrayInsurance["INSURANCE_ID"] = $arrInsurance[$i]["INSURANCE_ID"];
                    $arrayInsurance["rateRegular"] = $hasilPremiRate["rate"];
                    $arrayInsurance["premiRegular"] = $hasilPremiRate["premium"];
                    $arrayInsurance["rateGP"] = '0';
                    $arrayInsurance["premiGP"] = '0';
                    $arrayInsurance["totalPremi"] =  $hasilTotal;
                } else {
                    $arrayInsurance["INSURANCE_ID"] = $arrInsurance[$i]["INSURANCE_ID"];
                    $arrayInsurance["rateRegular"] = '0';
                    $arrayInsurance["premiRegular"] = '0';
                    $arrayInsurance["rateGP"] = '0';
                    $arrayInsurance["premiGP"] = '0';
                    $arrayInsurance["totalPremi"] =  $hasilTotal;
                }

                // create data di t_offer_detail
                $createTOfferDetail = TOfferDetail::create([
                    "OFFER_ID"                      => $arrOffer[0]['OFFER_ID'],
                    "INSURANCE_ID"                  => $arrayInsurance["INSURANCE_ID"],
                    "OFFER_DETAIL_RATE"             => $arrayInsurance['rateRegular'],
                    "OFFER_DETAIL_AMOUNT"           => $arrayInsurance['premiRegular'],
                    "OFFER_DETAIL_CREATED_BY"       => $user_id,
                    "OFFER_DETAIL_CREATED_DATE"     => $date
                ])->OFFER_DETAIL_ID;


                // PROSES VERIFIKASI SEMUA ASURANSI TERHADAP PENGAJUAN
                // get data produk asuransi by id
                $arrProdukAsuransi = getProdukAsuransiById($arrInsurance[$i]['PRODUK_ASURANSI_ID']);
                // get data mekanisme produk

                // Hardcode 
                $batasUsia = 55;
                $batasUangPinjaman = 500000000.00;

                if ($arrTheInsured[0]['THE_INSURED_AGE'] <= $batasUsia && $arrOffer[0]['OFFER_SUM_INSURED'] <= $batasUangPinjaman) {
                    // simpan mapping asuransi dan t_offer
                    $createMOfferInsurance = MOfferInsurance::create([
                        "OFFER_ID"          => $arrOffer[0]['OFFER_ID'],
                        "OFFER_DETAIL_ID"   => $createTOfferDetail,
                        "INSURANCE_ID"      => $arrInsurance[$i]['INSURANCE_ID']
                    ]);
                }

                // create log
                UserLog::create([
                    'created_by' => $user->id,
                    'action'     => json_encode([
                        "description" => "Created (Pengajuan Detail)",
                        "module"      => "Pengajuan",
                        "id"          => $createTOfferDetail
                    ]),
                    'action_by'  => $user->user_login
                ]);
            }
            // end create offer detail
        });

        return new JsonResponse([
            'Pengajuan Created Success'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getOfferDetail(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'OFFER_DETAIL_ID');
        $sortDirection = $request->input('sort_direction', 'DESC');
        $search = json_decode($request->input('search', ''));
        $arrGetOffer = TOfferDetail::where('OFFER_ID', $request->id)->where('OFFER_DETAIL_IS_USED', 1)->first();
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listGetOffer = TOfferDetail::select(
            't_offer_detail.OFFER_DETAIL_ID',
            't_offer_detail.OFFER_ID',
            't_offer_detail.OFFER_DETAIL_RATE',
            't_offer_detail.OFFER_DETAIL_AMOUNT',
            't_offer_detail.OFFER_DETAIL_IS_USED',
            't_offer_detail.OFFER_DETAIL_DEBITUR_IS_AGREE',
            't_insurance.INSURANCE_NAME',

        )->when($search, function ($query, $search) {
            return $query->where('JENIS_ASURANSI_ID', 'like', "%{$search}%");
        })

            ->leftJoin('t_bank_insurance', 't_bank_insurance.BANK_INSURANCE_ID', '=', 't_offer_detail.BANK_INSURANCE_ID')
            ->leftJoin('t_insurance', 't_bank_insurance.INSURANCE_ID', '=', 't_insurance.INSURANCE_ID')
            // ->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_share_effective_date.JENIS_ASURANSI_ID')
            ->orderBy($sortColumn, $sortDirection)
            ->where('t_offer_detail.OFFER_ID', $request->id)
            ->when($arrGetOffer, function ($query, $arrGetOffer) {
                if ($arrGetOffer != null) {
                    return $query->where('t_offer_detail.OFFER_DETAIL_IS_USED', 1);
                }
            })
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return response()->json($listGetOffer);
    }

    public function getDetailDataEditPremi(Request $request)
    {
        $detailOffer = TOfferDetail::where('OFFER_DETAIL_ID', $request->idOfferDetail)
            ->leftJoin('t_offer', 't_offer.OFFER_ID', '=', 't_offer_detail.OFFER_ID')
            ->first();
        $arrRateHistory = TRateHistory::where('offer_detail_id', $request->idOfferDetail)->first();


        return array(
            "detailOffer"               => $detailOffer,
            "arrRateHistory"            => $arrRateHistory,
        );
    }

    public function getReviewPengajuanDebitur(Request $request)
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
        )
            ->leftJoin('t_theinsured', 't_theinsured.THE_INSURED_ID', '=', 't_offer.THE_INSURED_ID')
            ->leftJoin('r_marital_status', 'r_marital_status.MARITAL_STATUS_SELECT', '=', 't_theinsured.MARITAL_STATUS_ID')
            ->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_offer.JENIS_ASURANSI_ID')
            ->leftJoin('r_tarif_payroll', 'r_tarif_payroll.TARIF_PAYROLL_ID', '=', 't_offer.TARIF_PAYROLL_ID')
            ->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_offer.LOAN_TYPE_ID')
            ->leftJoin('t_user', 't_user.id', '=', 't_offer.USER_BANK_ID')
            ->where('t_offer.OFFER_ID', $request->idOffer)
            ->first();

        // for document offer
        $arrDoc = TBusinessDocument::where('OFFER_ID', $request->idOffer)
            ->leftJoin('t_document', 't_document.document_id', '=', 't_business_document.document_id')
            ->leftJoin('r_document_type', 'r_document_type.document_type_id', '=', 't_business_document.document_type_id')
            ->get();
        // end for document offer

        // for catatan
        $arrCatatan = TCatatanBroker::where('OFFER_ID', $request->idOffer)->leftJoin('t_user', 't_user.id', '=', 't_catatan_broker.CATATAN_BROKER_CREATED_BY')->get();
        // end for catatan

        // for rate history
        // get detail id yang ada asuransinya
        $getOfferDetail = TOfferDetail::where('OFFER_ID', $request->idOffer)->where('OFFER_DETAIL_IS_USED', 1)->first();
        $arrRateHistory = array();
        if ($getOfferDetail !== null) {
            $arrRateHistory = TRateHistory::where('t_rate_history.offer_detail_id', $getOfferDetail->OFFER_DETAIL_ID)->where('t_rate_history.rate_history_is_original', 1)->get();
        }
        // end for rate history

        // get insurance from offer id
        $getMappingInsurance = MOfferInsurance::where('m_offer_insurance.OFFER_ID', $request->idOffer)
            ->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 'm_offer_insurance.INSURANCE_ID')
            ->get();

        // get all product
        $getAllMekanisme = TMekanismeProdukAsuransi::get();

        // get jenis asuransi
        $getJenisAsuransi = RJenisAsuransi::get();

        return array(
            "pengajuanDetail"       => $arrOffer,
            "arrDoc"                => $arrDoc,
            "arrCatatan"            => $arrCatatan,
            "arrRateHistory"        => $arrRateHistory,
            "getOfferDetail"        => $getOfferDetail,
            "getMappingInsurance"   => $getMappingInsurance,
            "getAllMekanisme"       => $getAllMekanisme,
            "getJenisAsuransi"      => $getJenisAsuransi
        );
    }

    public function editDocument(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();



            // get data the insured untuk edit ktp jika tipe ktp di ubah
            $arrData = TTheInsured::select('THE_INSURED_ID')->where('DOCUMENT_KTP_ID', $request->DOCUMENT_ID)->first();

            $documentUploadFile = $request->file('UPLOAD_FILE');
            if ($documentUploadFile != null) {
                // upload file yang terbaru
                for ($i = 0; $i < sizeof($documentUploadFile); $i++) {
                    $arrDocument = $documentUploadFile;

                    // create folder the insured
                    $parentDir = ((floor(($request->OFFER_ID) / 1000)) * 1000) . '/';
                    $RateSettingId = $request->OFFER_ID . '/';
                    $typeDir = "";
                    $uploadPath = "";
                    if ($request->DOCUMENT_TYPE_ID == 1) {
                        $uploadPath = 'document/BUSINESS/KTP/' . $parentDir . $RateSettingId . $typeDir;
                    } else if ($request->DOCUMENT_TYPE_ID == 2) {
                        $uploadPath = 'document/BUSINESS/SPAJK/' . $parentDir . $RateSettingId . $typeDir;
                    } else if ($request->DOCUMENT_TYPE_ID == 3) {
                        $uploadPath = 'document/BUSINESS/MCU/' . $parentDir . $RateSettingId . $typeDir;
                    } else {
                        $uploadPath = 'document/BUSINESS/Others/' . $parentDir . $RateSettingId . $typeDir;
                    }

                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentFileName = $request->OFFER_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $arrDocument[$i]->getMimeType();
                    $documentFileSize = $arrDocument[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $request->OFFER_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

                    // masukan data file ke database
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                        'DOCUMENT_FILENAME'             => $documentFileName,
                        'DOCUMENT_DIRNAME'              => $documentDirName,
                        'DOCUMENT_FILETYPE'             => $documentFileType,
                        'DOCUMENT_FILESIZE'             => $documentFileSize,
                        'DOCUMENT_CREATED_BY'           => $user_id
                    ])->DOCUMENT_ID;

                    if ($document) {
                        $createDocumentKTP = TBusinessDocument::where('BUSINESS_DOCUMENT_ID', $request->BUSINESS_DOCUMENT_ID)->update([
                            "OFFER_ID"          => $request->OFFER_ID,
                            "DOCUMENT_TYPE_ID"  => $request->DOCUMENT_TYPE_ID,
                            "DOCUMENT_ID"       => $document
                        ]);
                    }

                    if ($request->DOCUMENT_TYPE_ID == 1) {
                        TTheInsured::where('THE_INSURED_ID', $arrData->THE_INSURED_ID)->update([
                            "DOCUMENT_KTP_ID"          => $document,
                        ]);
                    }

                    // create log
                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Edit (Document Pengajuan)",
                            "module"      => "Pengajuan",
                            "id"          => $request->OFFER_ID
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }
            }
        });

        return new JsonResponse([
            'Edit Document Pengajuan Success',
            $request->OFFER_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getJenisDocumentTypeAll(Request $request)
    {
        $data = RDocumentType::get();

        return response()->json($data);
    }

    public function uploadDocument(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();



            // get data the insured untuk edit ktp jika tipe ktp di ubah
            $arrData = TOffer::select('THE_INSURED_ID')->where('OFFER_ID', $request->OFFER_ID)->first();

            $documentUploadFile = $request->file('UPLOAD_FILE');
            if ($documentUploadFile != null) {
                // upload file yang terbaru
                for ($i = 0; $i < sizeof($documentUploadFile); $i++) {
                    $arrDocument = $documentUploadFile;

                    // create folder the insured
                    $parentDir = ((floor(($request->OFFER_ID) / 1000)) * 1000) . '/';
                    $RateSettingId = $request->OFFER_ID . '/';
                    $typeDir = "";
                    $uploadPath = "";
                    if ($request->JENIS_DOCUMENT['value'] == 1 || $request->JENIS_DOCUMENT['value'] == "1") {
                        $uploadPath = 'document/BUSINESS/KTP/' . $parentDir . $RateSettingId . $typeDir;
                    } else if ($request->JENIS_DOCUMENT['value'] == 2 || $request->JENIS_DOCUMENT['value'] == "2") {
                        $uploadPath = 'document/BUSINESS/SPAJK/' . $parentDir . $RateSettingId . $typeDir;
                    } else if ($request->JENIS_DOCUMENT['value'] == 3 || $request->JENIS_DOCUMENT['value'] == "3") {
                        $uploadPath = 'document/BUSINESS/MCU/' . $parentDir . $RateSettingId . $typeDir;
                    } else {
                        $uploadPath = 'document/BUSINESS/Others/' . $parentDir . $RateSettingId . $typeDir;
                    }

                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentFileName = $request->OFFER_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $arrDocument[$i]->getMimeType();
                    $documentFileSize = $arrDocument[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $request->OFFER_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

                    // masukan data file ke database
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                        'DOCUMENT_FILENAME'             => $documentFileName,
                        'DOCUMENT_DIRNAME'              => $documentDirName,
                        'DOCUMENT_FILETYPE'             => $documentFileType,
                        'DOCUMENT_FILESIZE'             => $documentFileSize,
                        'DOCUMENT_CREATED_BY'           => $user_id,
                        'DOCUMENT_CREATED_BY'           => $date
                    ])->DOCUMENT_ID;

                    if ($document) {
                        // cek business document
                        $arrBusinessDoc = TBusinessDocument::where('OFFER_ID', $request->OFFER_ID)->where('DOCUMENT_TYPE_ID', $request->JENIS_DOCUMENT['value'])->first();
                        if ($arrBusinessDoc != null) {
                            $createDocumentKTP = TBusinessDocument::where('OFFER_ID', $request->OFFER_ID)->where('DOCUMENT_TYPE_ID', $request->JENIS_DOCUMENT['value'])->update([
                                "OFFER_ID"          => $request->OFFER_ID,
                                "DOCUMENT_TYPE_ID"  => $request->JENIS_DOCUMENT['value'],
                                "DOCUMENT_ID"       => $document
                            ]);
                        } else {
                            $createDocumentKTP = TBusinessDocument::create([
                                "OFFER_ID"          => $request->OFFER_ID,
                                "DOCUMENT_TYPE_ID"  => $request->JENIS_DOCUMENT['value'],
                                "DOCUMENT_ID"       => $document
                            ]);
                        }
                    }

                    if ($request->JENIS_DOCUMENT['value'] == 1 || $request->JENIS_DOCUMENT['value'] == "1") {
                        TTheInsured::where('THE_INSURED_ID', $arrData->THE_INSURED_ID)->update([
                            "DOCUMENT_KTP_ID"          => $document,
                        ]);
                    }

                    // create log
                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Upload (Document Pengajuan)",
                            "module"      => "Pengajuan",
                            "id"          => $request->OFFER_ID
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }
            }
        });

        return new JsonResponse([
            'Upload Document Pengajuan Success',
            $request->OFFER_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function addCatatan(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $createCatatan = TCatatanBroker::create([
                "OFFER_ID"                          => $request->OFFER_ID,
                "CATATAN_BROKER_ISI"                => $request->CATATAN_BROKER_ISI,
                "CATATAN_BROKER_CREATED_BY"         => $user_id,
                "CATATAN_BROKER_CREATED_DATE"       => $date,
                "CATATAN_BROKER_FOR"                => $request->CATATAN_BROKER_FOR
            ])->CATATAN_BROKER_ID;

            // create log
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Catatan (Catatan Pengajuan)",
                    "module"      => "Pengajuan",
                    "id"          => $request->OFFER_ID
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'Catatan Pengajuan Create Success',
            $request->OFFER_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function terimaPengajuan(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // get data offer
            $arrOffer = TOffer::where('OFFER_ID', $request->idOffer)->first();
            if ($arrOffer->OFFER_STAGING_ID == 2 || $arrOffer->OFFER_STAGING_ID == "2") {
                // update offer staging
                TOffer::where('OFFER_ID', $request->idOffer)->update([
                    'OFFER_STAGING_ID'             => 3,
                    'OFFER_UPDATED_BY'              => $user_id,
                    'OFFER_UPDATED_DATE'            => $date
                ]);

                // create staging
                TOfferStaging::create([
                    'offer_id'              => $request->idOffer,
                    'staging_pengajuan_id'  => 3,
                    'offer_staging_by'      => $user_id,
                    'offer_staging_date'    => $date
                ]);
                // end create staging
            }

            if ($arrOffer->OFFER_STAGING_ID == 4 || $arrOffer->OFFER_STAGING_ID == "4") {
                // update offer staging
                TOffer::where('OFFER_ID', $request->idOffer)->update([
                    'OFFER_STAGING_ID'             => 5,
                    'OFFER_UPDATED_BY'              => $user_id,
                    'OFFER_UPDATED_DATE'            => $date
                ]);

                // create staging
                TOfferStaging::create([
                    'offer_id'              => $request->idOffer,
                    'staging_pengajuan_id'  => 5,
                    'offer_staging_by'      => $user_id,
                    'offer_staging_date'    => $date
                ]);
                // end create staging
            }

            if ($arrOffer->OFFER_STAGING_ID == 6 || $arrOffer->OFFER_STAGING_ID == "6") {
                // update offer staging
                TOffer::where('OFFER_ID', $request->idOffer)->update([
                    'OFFER_STAGING_ID'             => 7,
                    'OFFER_UPDATED_BY'              => $user_id,
                    'OFFER_UPDATED_DATE'            => $date
                ]);

                // create staging
                TOfferStaging::create([
                    'offer_id'              => $request->idOffer,
                    'staging_pengajuan_id'  => 7,
                    'offer_staging_by'      => $user_id,
                    'offer_staging_date'    => $date
                ]);
                // end create staging
            }

            if ($arrOffer->OFFER_STAGING_ID == 9 || $arrOffer->OFFER_STAGING_ID == "9") {
                // update offer staging
                TOffer::where('OFFER_ID', $request->idOffer)->update([
                    'OFFER_STAGING_ID'             => 10,
                    'OFFER_UPDATED_BY'              => $user_id,
                    'OFFER_UPDATED_DATE'            => $date
                ]);

                // create staging
                TOfferStaging::create([
                    'offer_id'              => $request->idOffer,
                    'staging_pengajuan_id'  => 10,
                    'offer_staging_by'      => $user_id,
                    'offer_staging_date'    => $date
                ]);
                // end create staging
            }


            // create log
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Pengajuan (Terima Pengajuan)",
                    "module"      => "Pengajuan",
                    "id"          => $request->idOffer
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'Terima Pengajuan Success',
            $request->idOffer
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function addCatatanKonfirmasi(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // add catatan Konfirmasi Broker Ke Bank
            $createCatatan = TCatatanBroker::create([
                "OFFER_ID"                          => $request->OFFER_ID,
                "CATATAN_BROKER_ISI"                => $request->CATATAN_BROKER_ISI,
                "CATATAN_BROKER_CREATED_BY"         => $user_id,
                "CATATAN_BROKER_CREATED_DATE"       => $date,
                "CATATAN_BROKER_FOR"                => $request->CATATAN_BROKER_FOR
            ])->CATATAN_BROKER_ID;

            // create log
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Catatan Konfirmasi Broker Ke Bank(Catatan Pengajuan)",
                    "module"      => "Pengajuan",
                    "id"          => $request->OFFER_ID
                ]),
                'action_by'  => $user->user_login
            ]);
            // end add catatan Konfirmasi Broker Ke Bank

            // get data offer
            $arrOffer = TOffer::where('OFFER_ID', $request->OFFER_ID)->first();
            if ($arrOffer->OFFER_STAGING_ID == 3 || $arrOffer->OFFER_STAGING_ID == "3") {
                // update offer staging
                TOffer::where('OFFER_ID', $request->OFFER_ID)->update([
                    'OFFER_STAGING_ID'              => 4,
                    'OFFER_UPDATED_BY'              => $user_id,
                    'OFFER_UPDATED_DATE'            => $date
                ]);

                // create staging
                TOfferStaging::create([
                    'offer_id'              => $request->OFFER_ID,
                    'staging_pengajuan_id'  => 4,
                    'offer_staging_by'      => $user_id,
                    'offer_staging_date'    => $date
                ]);
                // end create staging
            }

            if ($arrOffer->OFFER_STAGING_ID == 10 || $arrOffer->OFFER_STAGING_ID == "10") {
                // update offer staging
                TOffer::where('OFFER_ID', $request->OFFER_ID)->update([
                    'OFFER_STAGING_ID'              => 4,
                    'OFFER_UPDATED_BY'              => $user_id,
                    'OFFER_UPDATED_DATE'            => $date
                ]);

                // create staging
                TOfferStaging::create([
                    'offer_id'              => $request->OFFER_ID,
                    'staging_pengajuan_id'  => 4,
                    'offer_staging_by'      => $user_id,
                    'offer_staging_date'    => $date
                ]);
                // end create staging
            }


            // create log
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Pengajuan (Konfirmasi Broker Ke Bank Pengajuan)",
                    "module"      => "Pengajuan",
                    "id"          => $request->OFFER_ID
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'Konfirmasi Broker Ke Bank Success',
            $request->OFFER_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function addCatatanAjukanKeBroker(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // add catatan Konfirmasi Broker Ke Bank
            $createCatatan = TCatatanBroker::create([
                "OFFER_ID"                          => $request->OFFER_ID,
                "CATATAN_BROKER_ISI"                => $request->CATATAN_BROKER_ISI,
                "CATATAN_BROKER_CREATED_BY"         => $user_id,
                "CATATAN_BROKER_CREATED_DATE"       => $date,
                "CATATAN_BROKER_FOR"                => $request->CATATAN_BROKER_FOR
            ])->CATATAN_BROKER_ID;

            // create log
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Catatan Ajukan Ke Broker(Catatan Pengajuan)",
                    "module"      => "Pengajuan",
                    "id"          => $request->OFFER_ID
                ]),
                'action_by'  => $user->user_login
            ]);
            // end add catatan Konfirmasi Broker Ke Bank

            // get data offer
            $arrOffer = TOffer::where('OFFER_ID', $request->OFFER_ID)->first();
            if ($arrOffer->OFFER_STAGING_ID == 5 || $arrOffer->OFFER_STAGING_ID == "5") {
                // update offer staging
                TOffer::where('OFFER_ID', $request->OFFER_ID)->update([
                    'OFFER_STAGING_ID'             => 2,
                    'OFFER_UPDATED_BY'              => $user_id,
                    'OFFER_UPDATED_DATE'            => $date
                ]);
            }

            // create staging
            TOfferStaging::create([
                'offer_id'              => $request->OFFER_ID,
                'staging_pengajuan_id'  => 2,
                'offer_staging_by'      => $user_id,
                'offer_staging_date'    => $date
            ]);
            // end create staging

            // create log
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Pengajuan (Ajukan Ke Broker Pengajuan)",
                    "module"      => "Pengajuan",
                    "id"          => $request->OFFER_ID
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'Ajukan Ke Broker Success',
            $request->OFFER_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function ajukanKeAsuransi(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // get data offer
            $arrOffer = TOfferDetail::select('t_offer.OFFER_STAGING_ID', 't_offer.OFFER_ID', 't_offer_detail.BANK_INSURANCE_ID')->leftJoin('t_offer', 't_offer.OFFER_ID', '=', 't_offer_detail.OFFER_ID')->where('OFFER_DETAIL_ID', $request->idOfferDetail)->first();
            if (($arrOffer->OFFER_STAGING_ID == 3 || $arrOffer->OFFER_STAGING_ID == "3") || ($arrOffer->OFFER_STAGING_ID == 10 || $arrOffer->OFFER_STAGING_ID == "10")) {
                // update offer staging
                TOffer::where('OFFER_ID', $arrOffer->OFFER_ID)->update([
                    'OFFER_STAGING_ID'             => 6,
                    'OFFER_UPDATED_BY'              => $user_id,
                    'OFFER_UPDATED_DATE'            => $date,
                    'BANK_INSURANCE_ID'             => $arrOffer->BANK_INSURANCE_ID
                ]);

                // create staging
                TOfferStaging::create([
                    'offer_id'              => $arrOffer->OFFER_ID,
                    'staging_pengajuan_id'  => 6,
                    'offer_staging_by'      => $user_id,
                    'offer_staging_date'    => $date
                ]);
                // end create staging

                // update is used t_offer_detail
                TOfferDetail::where('OFFER_DETAIL_ID', $request->idOfferDetail)->update([
                    'OFFER_DETAIL_IS_USED'             => 1,
                    'OFFER_DETAIL_UPDATED_BY'          => $user_id,
                    'OFFER_DETAIL_UPDATED_DATE'        => $date
                ]);
                // end update is used t_offer_detail
            }

            // create log
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Pengajuan (Ajukan Ke Asuransi)",
                    "module"      => "Pengajuan",
                    "id"          => $arrOffer->OFFER_ID
                ]),
                'action_by'  => $user->user_login
            ]);

            return $arrOffer->OFFER_ID;
        });

        return new JsonResponse([
            'Terima Pengajuan Success',
            $result
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getHistoryPengajuan(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'offer_staging_id');
        $sortDirection = $request->input('sort_direction', 'ASC');
        $search = json_decode($request->input('search', ''));
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listHistoryPengajuan = TOfferStaging::select(
            't_offer_staging.offer_id',
            'r_staging_pengajuan.staging_pengajuan_name',
            't_offer_staging.offer_staging_by',
            't_offer_staging.offer_staging_date',
            't_user.user_login'

        )

            ->leftJoin('r_staging_pengajuan', 'r_staging_pengajuan.staging_pengajuan_id', '=', 't_offer_staging.staging_pengajuan_id')
            ->leftJoin('t_user', 't_user.id', '=', 't_offer_staging.offer_staging_by')
            ->orderBy($sortColumn, $sortDirection)
            ->where('t_offer_staging.offer_id', $request->id)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        return response()->json($listHistoryPengajuan);
    }

    public function editDataPengajuan(Request $request)
    {

        $validateData = Validator::make($request->all(), [
            'data_kredit.*.JENIS_ASURANSI'              => 'required',
            'data_kredit.*.NAMA_KANTOR'                 => 'required',
            'data_kredit.*.TARIF_PAYROLL'               => 'required',
            'data_kredit.*.LOAN_TYPE'                   => 'required',
            'data_debitur.*.TGL_LAHIR'                  => 'required',
            'data_kredit.*.RENCANA_TANGGAL_PENCAIRAN'   => 'required',
        ], [
            'data_kredit.*.JENIS_ASURANSI'              => 'Jenis Asuransi is required!',
            'data_kredit.*.NAMA_KANTOR'                 => 'Nama Kantor is required!',
            'data_kredit.*.TARIF_PAYROLL'               => 'Tarif Payroll is required!',
            'data_kredit.*.LOAN_TYPE'                   => 'Loan Type is required!',
            'data_debitur.*.TGL_LAHIR'                   => 'Tgl Lahir is required!',
            'data_kredit.*.RENCANA_TANGGAL_PENCAIRAN'   => 'Rencana Tgl Pencairan is required!',
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        $result = DB::transaction(function () use ($request) {

            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // get data offer id
            $idOfferNew = "";
            $arrOfferData = TOffer::where('OFFER_ID', $request->OFFER_ID)->first();
            if ($request->OLD_USIA != $request->data_debitur[0]['USIA_DEBITUR'] || $arrOfferData->OFFER_SUM_INSURED != $request->data_kredit[0]['SUM_INSURED'] || $arrOfferData->OFFER_TENOR != $request->data_kredit[0]['TENOR'] || $arrOfferData->TARIF_PAYROLL_ID != $request->data_kredit[0]['TARIF_PAYROLL']) {
                // buat t offer lagi jika ada yang beda, di karenakan untuk perhitungan rate

                // update data the insured
                $dataDebitur = is_countable($request->data_debitur);
                if ($dataDebitur) {
                    for ($i = 0; $i < sizeof($request->data_debitur); $i++) {
                        $arrDebitur = $request->data_debitur[$i];

                        $createDebitur = TTheInsured::where('THE_INSURED_ID', $arrOfferData->THE_INSURED_ID)->update([
                            "THE_INSURED_NAME"          => $arrDebitur['NAMA_DEBITUR'],
                            "THE_INSURED_ID_NUMBER"     => $arrDebitur['NIK_DEBITUR'],
                            "THE_INSURED_DATE_OF_BIRTH" => $arrDebitur['TGL_LAHIR'],
                            "THE_INSURED_AGE"           => $arrDebitur['USIA_DEBITUR'],
                            "THE_INSURED_UPDATED_BY"    => $user_id,
                            "THE_INSURED_UPDATED_DATE"  => $date,
                            "THE_INSURED_CIF"           => isset($arrDebitur['CIF_DEBITUR']) ? $arrDebitur['CIF_DEBITUR'] : NULL,
                        ]);

                        if ($request->detail_insurance_life[0]['EMAIL_DEBITUR'] !== null && $request->detail_insurance_life[0]['GENDER_DEBITUR'] !== null && $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] !== null && $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] !== null && $request->detail_insurance_life[0]['MARITAL_STATUS'] !== null) {
                            $updateTheInsured = TTheInsured::where('THE_INSURED_ID', $arrOfferData->THE_INSURED_ID)->update([
                                "THE_INSURED_EMAIL"         => $request->detail_insurance_life[0]['EMAIL_DEBITUR'] !== null ? $request->detail_insurance_life[0]['EMAIL_DEBITUR'] : NULL,
                                "THE_INSURED_GENDER"        => $request->detail_insurance_life[0]['GENDER_DEBITUR'] !== null ? $request->detail_insurance_life[0]['GENDER_DEBITUR'] : NULL,
                                "THE_INSURED_WEIGHT"        => $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] !== null ? $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] : NULL,
                                "THE_INSURED_HEIGHT"        => $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] !== null ? $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] : NULL,
                                "MARITAL_STATUS_ID"         => $request->detail_insurance_life[0]['MARITAL_STATUS'] !== null ? $request->detail_insurance_life[0]['MARITAL_STATUS'] : NULL,
                            ]);
                        }

                        UserLog::create([
                            'created_by' => $user->id,
                            'action'     => json_encode([
                                "description" => "Updated (The Insured)",
                                "module"      => "Pengajuan",
                                "id"          => $arrOfferData->THE_INSURED_ID
                            ]),
                            'action_by'  => $user->user_login
                        ]);
                    }
                }

                // create data kredit
                for ($i = 0; $i < sizeof($request->data_kredit); $i++) {
                    $arrKredit = $request->data_kredit[$i];

                    // get code pengajuan debitur
                    $getTanggalAwal = $arrKredit['RENCANA_TANGGAL_PENCAIRAN'];
                    $getCodeKantor = $arrKredit['KODE_KANTOR'];
                    $codePengajuan = regNumberCodePengajuan($kode_broker = "", $getCodeKantor, $getTanggalAwal);
                    // end get code pengajuan debitur

                    // get Product Id dan Schema(Sub Produk) \
                    $arrDataLoanType = getProdukSubProdukNew($arrKredit['LOAN_TYPE']);
                    $produk_id = $arrDataLoanType[0]['product_id'];
                    $sub_produk_id = $arrDataLoanType[0]['scheme_id'];
                    // end get Product Id dan Schema(Sub Produk)


                    $createTOffer = TOffer::create([
                        "OFFER_TOKEN"               => $arrOfferData->OFFER_TOKEN,
                        "BANK_LIST_ID"              => $user->BANK_LIST_ID,
                        "BANK_BRANCH_ID"            => $user->BANK_BRANCH_ID,
                        "USER_BANK_ID"              => $user_id,
                        "THE_INSURED_ID"            => $arrOfferData->THE_INSURED_ID,
                        "OFFER_SUBMISSION_CODE"     => $codePengajuan,
                        "OFFER_SUM_INSURED"         => $arrKredit['SUM_INSURED'],
                        "OFFER_INCEPTION_DATE"      => $arrKredit['RENCANA_TANGGAL_PENCAIRAN'],
                        "OFFER_DUE_DATE"            => $arrKredit['TGL_AKHIR_KREDIT'],
                        "OFFER_AGE_ON_DUE_DATE"     => $arrKredit['USIA_JATUH_TEMPO'],
                        // "OFFER_BANK_BRANCH_NAME"    => $arrKredit['NAMA_CABANG'],
                        // "OFFER_BANK_BRANCH_CODE"    => $arrKredit['KODE_CABANG'],
                        "OFFER_BANK_OFFICE_NAME"    => $arrKredit['NAMA_KANTOR'],
                        "OFFER_BANK_OFFICE_CODE"    => $arrKredit['KODE_KANTOR'],
                        "LOAN_TYPE_ID"              => $arrKredit['LOAN_TYPE'],
                        "PRODUCT_ID"                => $produk_id,
                        "SCHEMA_ID"                 => $sub_produk_id,
                        "OFFER_TENOR"               => $arrKredit['TENOR'],
                        "OFFER_CREATED_BY"          => $user_id,
                        "OFFER_CREATED_DATE"        => $date,
                        "TARIF_PAYROLL_ID"          => $arrKredit['TARIF_PAYROLL'],
                        "JENIS_ASURANSI_ID"         => $arrKredit['JENIS_ASURANSI'],
                        "OFFER_STATUS_ID"           => 2,
                        "OFFER_STAGING_ID"          => 2,
                        "KODE_AO"                   => isset($request->detail_insurance_life[0]['KODE_AO']) ? $request->detail_insurance_life[0]['KODE_AO'] : NULL,
                    ])->OFFER_ID;

                    // create log
                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Created (Pengajuan Debitur)",
                            "module"      => "Pengajuan",
                            "id"          => $createTOffer
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }

                // create staging
                TOfferStaging::create([
                    'offer_id'              => $createTOffer,
                    'staging_pengajuan_id'  => 2,
                    'offer_staging_by'      => $user_id,
                    'offer_staging_date'    => $date
                ]);
                // end create staging

                // get document ktp dan spajk
                $documentKTPSPAJK = TBusinessDocument::where('OFFER_ID', $arrOfferData->OFFER_ID)->whereIn('DOCUMENT_TYPE_ID', [1, 2])->get();
                // insert document existing
                for ($i = 0; $i < sizeof($documentKTPSPAJK); $i++) {
                    // for t_business_document
                    TBusinessDocument::create([
                        "OFFER_ID" => $createTOffer,
                        "DOCUMENT_TYPE_ID" => $documentKTPSPAJK[$i]['DOCUMENT_TYPE_ID'],
                        "DOCUMENT_ID" => $documentKTPSPAJK[$i]['DOCUMENT_ID']
                    ]);
                }

                // get detail offer
                $arrInsurance = TOfferDetail::where('OFFER_ID', $arrOfferData->OFFER_ID)->leftJoin('t_bank_insurance', 't_offer_detail.BANK_INSURANCE_ID', '=', 't_bank_insurance.BANK_INSURANCE_ID')->leftJoin('t_insurance', 't_bank_insurance.INSURANCE_ID', '=', 't_insurance.INSURANCE_ID')->get();

                for ($i = 0; $i < sizeof($arrInsurance); $i++) {
                    // get data offer untuk detailing
                    $arrOffer = TOffer::where('OFFER_ID', $createTOffer)->get();
                    $arrTheInsured = TTheInsured::where('THE_INSURED_ID', $arrOffer[0]['THE_INSURED_ID'])->get();

                    $reg["documenIdRate"] = $arrInsurance[$i]["RATE_MANAGE_ID"];
                    $reg["insurance_id"] = $arrInsurance[$i]["INSURANCE_ID"];
                    $reg["age"] = $arrTheInsured[0]['THE_INSURED_AGE'];
                    $reg["tenor_reg"] = $arrOffer[0]['OFFER_TENOR'];
                    $reg["birth_date"] = $arrTheInsured[0]['THE_INSURED_DATE_OF_BIRTH'];
                    $reg["plafond"] = $arrOffer[0]['OFFER_SUM_INSURED'];
                    $reg["jenis_rate"] = $arrOffer[0]['TARIF_PAYROLL_ID'];
                    $reg["tanggal_awal"] = $arrOffer[0]['OFFER_INCEPTION_DATE'];

                    $hasilPremiRate = calculateRatePremiAdeleSistem($reg);

                    $hasilTotal = $hasilPremiRate["premium"];

                    if ($hasilTotal > 0) {
                        $arrayInsurance["BankInsuranceId"] = $arrInsurance[$i]["BANK_INSURANCE_ID"];
                        $arrayInsurance["rateRegular"] = $hasilPremiRate["rate"];
                        $arrayInsurance["premiRegular"] = $hasilPremiRate["premium"];
                        $arrayInsurance["rateGP"] = '0';
                        $arrayInsurance["premiGP"] = '0';
                        $arrayInsurance["totalPremi"] =  $hasilTotal;
                    } else {
                        $arrayInsurance["BankInsuranceId"] = $arrInsurance[$i]["BANK_INSURANCE_ID"];
                        $arrayInsurance["rateRegular"] = '0';
                        $arrayInsurance["premiRegular"] = '0';
                        $arrayInsurance["rateGP"] = '0';
                        $arrayInsurance["premiGP"] = '0';
                        $arrayInsurance["totalPremi"] =  $hasilTotal;
                    }

                    // create data di t_offer_detail
                    $createTOfferDetail = TOfferDetail::create([
                        "OFFER_ID"                          => $arrOffer[0]['OFFER_ID'],
                        "BANK_INSURANCE_ID"                 => $arrayInsurance["BankInsuranceId"],
                        "OFFER_DETAIL_RATE"                 => $arrayInsurance['rateRegular'],
                        "OFFER_DETAIL_AMOUNT"               => $arrayInsurance['premiRegular'],
                        "OFFER_DETAIL_RATE_COMBINATION"     => $arrayInsurance['rateGP'],
                        "OFFER_DETAIL_AMOUNT_COMBINATION"   => $arrayInsurance['premiGP'],
                        "OFFER_DETAIL_CREATED_BY"           => $user_id,
                        "OFFER_DETAIL_CREATED_DATE"         => $date
                    ])->OFFER_DETAIL_ID;

                    // create log
                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Created (Pengajuan Detail)",
                            "module"      => "Pengajuan",
                            "id"          => $createTOfferDetail
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }

                return $createTOffer;
            } else {
                // update the insured
                // update data the insured
                $dataDebitur = is_countable($request->data_debitur);
                if ($dataDebitur) {
                    for ($i = 0; $i < sizeof($request->data_debitur); $i++) {
                        $arrDebitur = $request->data_debitur[$i];

                        $createDebitur = TTheInsured::where('THE_INSURED_ID', $arrOfferData->THE_INSURED_ID)->update([
                            "THE_INSURED_NAME"          => $arrDebitur['NAMA_DEBITUR'],
                            "THE_INSURED_ID_NUMBER"     => $arrDebitur['NIK_DEBITUR'],
                            "THE_INSURED_DATE_OF_BIRTH" => $arrDebitur['TGL_LAHIR'],
                            "THE_INSURED_AGE"           => $arrDebitur['USIA_DEBITUR'],
                            "THE_INSURED_UPDATED_BY"    => $user_id,
                            "THE_INSURED_UPDATED_DATE"  => $date,
                            "THE_INSURED_CIF"           => isset($arrDebitur['CIF_DEBITUR']) ? $arrDebitur['CIF_DEBITUR'] : NULL,

                        ]);

                        if ($request->detail_insurance_life[0]['EMAIL_DEBITUR'] !== null && $request->detail_insurance_life[0]['GENDER_DEBITUR'] !== null && $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] !== null && $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] !== null && $request->detail_insurance_life[0]['MARITAL_STATUS'] !== null) {
                            $updateTheInsured = TTheInsured::where('THE_INSURED_ID', $arrOfferData->THE_INSURED_ID)->update([
                                "THE_INSURED_EMAIL"         => $request->detail_insurance_life[0]['EMAIL_DEBITUR'] !== null ? $request->detail_insurance_life[0]['EMAIL_DEBITUR'] : NULL,
                                "THE_INSURED_GENDER"        => $request->detail_insurance_life[0]['GENDER_DEBITUR'] !== null ? $request->detail_insurance_life[0]['GENDER_DEBITUR'] : NULL,
                                "THE_INSURED_WEIGHT"        => $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] !== null ? $request->detail_insurance_life[0]['WEIGHT_DEBITUR'] : NULL,
                                "THE_INSURED_HEIGHT"        => $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] !== null ? $request->detail_insurance_life[0]['HEIGHT_DEBITUR'] : NULL,
                                "MARITAL_STATUS_ID"         => $request->detail_insurance_life[0]['MARITAL_STATUS'] !== null ? $request->detail_insurance_life[0]['MARITAL_STATUS'] : NULL,
                            ]);
                        }


                        UserLog::create([
                            'created_by' => $user->id,
                            'action'     => json_encode([
                                "description" => "Updated (The Insured)",
                                "module"      => "Pengajuan",
                                "id"          => $arrOfferData->THE_INSURED_ID
                            ]),
                            'action_by'  => $user->user_login
                        ]);
                    }
                }


                // update data kredit
                for ($i = 0; $i < sizeof($request->data_kredit); $i++) {
                    $arrKredit = $request->data_kredit[$i];

                    // get Product Id dan Schema(Sub Produk) \
                    $arrDataLoanType = getProdukSubProdukNew($arrKredit['LOAN_TYPE']);
                    $produk_id = $arrDataLoanType[0]['product_id'];
                    $sub_produk_id = $arrDataLoanType[0]['scheme_id'];
                    // end get Product Id dan Schema(Sub Produk)


                    $createTOffer = TOffer::where('OFFER_ID', $arrOfferData->OFFER_ID)->update([
                        "OFFER_TOKEN"               => $arrOfferData->OFFER_TOKEN,
                        "BANK_LIST_ID"              => $user->BANK_LIST_ID,
                        "BANK_BRANCH_ID"            => $user->BANK_BRANCH_ID,
                        "USER_BANK_ID"              => $user_id,
                        "THE_INSURED_ID"            => $arrOfferData->THE_INSURED_ID,
                        "OFFER_SUM_INSURED"         => $arrKredit['SUM_INSURED'],
                        "OFFER_INCEPTION_DATE"      => $arrKredit['RENCANA_TANGGAL_PENCAIRAN'],
                        "OFFER_DUE_DATE"            => $arrKredit['TGL_AKHIR_KREDIT'],
                        "OFFER_AGE_ON_DUE_DATE"     => $arrKredit['USIA_JATUH_TEMPO'],
                        // "OFFER_BANK_BRANCH_NAME"    => $arrKredit['NAMA_CABANG'],
                        // "OFFER_BANK_BRANCH_CODE"    => $arrKredit['KODE_CABANG'],
                        "OFFER_BANK_OFFICE_NAME"    => $arrKredit['NAMA_KANTOR'],
                        "OFFER_BANK_OFFICE_CODE"    => $arrKredit['KODE_KANTOR'],
                        "LOAN_TYPE_ID"              => $arrKredit['LOAN_TYPE'],
                        "PRODUCT_ID"                => $produk_id,
                        "SCHEMA_ID"                 => $sub_produk_id,
                        "OFFER_TENOR"               => $arrKredit['TENOR'],
                        "OFFER_CREATED_BY"          => $user_id,
                        "OFFER_CREATED_DATE"        => $date,
                        "TARIF_PAYROLL_ID"          => $arrKredit['TARIF_PAYROLL'],
                        "JENIS_ASURANSI_ID"         => $arrKredit['JENIS_ASURANSI'],
                        // "OFFER_STATUS_ID"           => 2,
                        // "OFFER_STAGING_ID"         => 2,
                        "KODE_AO"                   => isset($request->detail_insurance_life[0]['KODE_AO']) ? $request->detail_insurance_life[0]['KODE_AO'] : NULL,
                    ]);

                    // create log
                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Update (Pengajuan Debitur)",
                            "module"      => "Pengajuan",
                            "id"          => $arrOfferData->OFFER_ID
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }

                $arrInsurance = TOfferDetail::where('OFFER_ID', $arrOfferData->OFFER_ID)->leftJoin('t_bank_insurance', 't_offer_detail.BANK_INSURANCE_ID', '=', 't_bank_insurance.BANK_INSURANCE_ID')->leftJoin('t_insurance', 't_bank_insurance.INSURANCE_ID', '=', 't_insurance.INSURANCE_ID')->get();


                for ($i = 0; $i < sizeof($arrInsurance); $i++) {

                    // get data offer untuk detailing
                    $arrOffer = TOffer::where('OFFER_ID', $arrOfferData->OFFER_ID)->get();
                    $arrTheInsured = TTheInsured::where('THE_INSURED_ID', $arrOffer[0]['THE_INSURED_ID'])->get();

                    $reg["documenIdRate"] = $arrInsurance[$i]["RATE_MANAGE_ID"];
                    $reg["insurance_id"] = $arrInsurance[$i]["INSURANCE_ID"];
                    $reg["age"] = $arrTheInsured[0]['THE_INSURED_AGE'];
                    $reg["tenor_reg"] = $arrOffer[0]['OFFER_TENOR'];
                    $reg["birth_date"] = $arrTheInsured[0]['THE_INSURED_DATE_OF_BIRTH'];
                    $reg["plafond"] = $arrOffer[0]['OFFER_SUM_INSURED'];
                    $reg["jenis_rate"] = $arrOffer[0]['TARIF_PAYROLL_ID'];
                    $reg["tanggal_awal"] = $arrOffer[0]['OFFER_INCEPTION_DATE'];

                    $hasilPremiRate = calculateRatePremiAdeleSistem($reg);

                    $hasilTotal = $hasilPremiRate["premium"];

                    if ($hasilTotal > 0) {
                        $arrayInsurance["BankInsuranceId"] = $arrInsurance[$i]["BANK_INSURANCE_ID"];
                        $arrayInsurance["rateRegular"] = $hasilPremiRate["rate"];
                        $arrayInsurance["premiRegular"] = $hasilPremiRate["premium"];
                        $arrayInsurance["rateGP"] = '0';
                        $arrayInsurance["premiGP"] = '0';
                        $arrayInsurance["totalPremi"] =  $hasilTotal;
                    } else {
                        $arrayInsurance["BankInsuranceId"] = $arrInsurance[$i]["BANK_INSURANCE_ID"];
                        $arrayInsurance["rateRegular"] = '0';
                        $arrayInsurance["premiRegular"] = '0';
                        $arrayInsurance["rateGP"] = '0';
                        $arrayInsurance["premiGP"] = '0';
                        $arrayInsurance["totalPremi"] =  $hasilTotal;
                    }

                    // update data di t_offer_detail
                    $createTOfferDetail = TOfferDetail::where('OFFER_DETAIL_ID', $arrInsurance[$i]['OFFER_DETAIL_ID'])->update([
                        "OFFER_ID"                          => $arrOffer[0]['OFFER_ID'],
                        "BANK_INSURANCE_ID"                 => $arrayInsurance["BankInsuranceId"],
                        "OFFER_DETAIL_RATE"                 => $arrayInsurance['rateRegular'],
                        "OFFER_DETAIL_AMOUNT"               => $arrayInsurance['premiRegular'],
                        "OFFER_DETAIL_RATE_COMBINATION"     => $arrayInsurance['rateGP'],
                        "OFFER_DETAIL_AMOUNT_COMBINATION"   => $arrayInsurance['premiGP'],
                        "OFFER_DETAIL_UPDATED_BY"           => $user_id,
                        "OFFER_DETAIL_UPDATED_DATE"         => $date
                    ]);

                    // update for create rate history
                    $rateHistory = getRateHistory($arrInsurance[$i]['OFFER_DETAIL_ID']);

                    if ($rateHistory === null) {
                        // create data di t_offer_detail
                        $createRateHistory = TRateHistory::create([
                            "offer_detail_id"                   => $arrInsurance[$i]['OFFER_DETAIL_ID'],
                            "rate_history_tenor_regular"        => $arrOffer[0]['OFFER_TENOR'],
                            "rate_history_rate_regular"         => $arrayInsurance['rateRegular'],
                            "rate_history_premium_regular"      => $arrayInsurance['premiRegular'],
                            // "rate_history_tenor_combination" => $tenor_kom,
                            "rate_history_rate_combination"     => $arrayInsurance['rateGP'],
                            "rate_history_premium_combination"  => $arrayInsurance['premiGP'],
                            "rate_history_is_original"          => 1,
                            "rate_history_created_by"           => $user_id,
                            "rate_history_created_date"         => $date
                        ])->OFFER_DETAIL_ID;
                    } else {
                        $createRateHistory = TRateHistory::create([
                            "offer_detail_id"                   => $arrInsurance[$i]['OFFER_DETAIL_ID'],
                            "rate_history_tenor_regular"        => $arrOffer[0]['OFFER_TENOR'],
                            "rate_history_rate_regular"         => $arrayInsurance['rateRegular'],
                            "rate_history_premium_regular"      => $arrayInsurance['premiRegular'],
                            // "rate_history_tenor_combination" => $tenor_kom,
                            "rate_history_rate_combination"     => $arrayInsurance['rateGP'],
                            "rate_history_premium_combination"  => $arrayInsurance['premiGP'],
                            "rate_history_is_original"          => 0,
                            "rate_history_created_by"           => $user_id,
                            "rate_history_created_date"         => $date
                        ])->OFFER_DETAIL_ID;
                    }
                }

                return $arrOfferData->OFFER_ID;
            }
        });

        return new JsonResponse([
            'Pengajuan Edited Success',
            $result
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function insertBusinessNew($idOfferDetail, $coverNote)
    {
        $result = DB::transaction(function () use ($idOfferDetail, $coverNote) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $arrOfferDetail = getDetailOfferAllForBusiness($idOfferDetail);

            $codeBusiness = $arrOfferDetail[0]["OFFER_SUBMISSION_CODE"];
            $offer_id = $arrOfferDetail[0]["OFFER_ID"];
            $bankAdminId = $arrOfferDetail[0]["USER_BANK_ID"];
            $branchId = $arrOfferDetail[0]["bankBranchId"];
            $bankId = $arrOfferDetail[0]["BANK_LIST_ID"];
            $the_insured_id = $arrOfferDetail[0]["THE_INSURED_ID"];
            $sum_insured = $arrOfferDetail[0]["OFFER_SUM_INSURED"];
            $inception_date = $arrOfferDetail[0]["OFFER_INCEPTION_DATE"];
            $due_date = $arrOfferDetail[0]["OFFER_DUE_DATE"];
            $loan_type_id = $arrOfferDetail[0]["LOAN_TYPE_ID"];
            // $credit_reference = $arrOfferDetail[0]["CreditReference"];
            $tenor = $arrOfferDetail[0]["OFFER_TENOR"];
            // $credit_plafond = $arrOfferDetail[0]["CreditPlafond"];
            $premi = $arrOfferDetail[0]["OFFER_DETAIL_AMOUNT"];
            $rate = $arrOfferDetail[0]["OFFER_DETAIL_RATE"];
            // $offer_detail_type = $arrOfferDetail[0]["offer_detail_type"];
            // $health_letter = $arrOfferDetail[0]["health_letter"];
            // $health_status = $arrOfferDetail[0]["health_status"];
            $offer_detail_id = $arrOfferDetail[0]["OFFER_DETAIL_ID"];
            $totalPremi = $arrOfferDetail[0]["OFFER_DETAIL_AMOUNT"] + $arrOfferDetail[0]["OFFER_DETAIL_AMOUNT_COMBINATION"] + $arrOfferDetail[0]["OFFER_DETAIL_AMOUNT_EXTRA_PREMI"];
            $total_premi = $totalPremi;
            $bankInsuranceId = $arrOfferDetail[0]["BANK_INSURANCE_ID"];
            // $offer_rm = $arrOfferDetail[0]["offer_rm"];
            // $norek_pinjaman = $arrOfferDetail[0]["offer_credit_account_number"];
            $BankOfficeCode = $arrOfferDetail[0]['OFFER_BANK_OFFICE_CODE'];
            $BankOfficeName = $arrOfferDetail[0]['OFFER_BANK_OFFICE_NAME'];
            $BankBranchCode = $arrOfferDetail[0]['OFFER_BANK_BRANCH_CODE'];
            $BankBranchName = $arrOfferDetail[0]['OFFER_BANK_BRANCH_NAME'];
            $tarif_payroll = $arrOfferDetail[0]['TARIF_PAYROLL_ID'];
            $jenis_asuransi = $arrOfferDetail[0]['JENIS_ASURANSI_ID'];
            $dataNow = now();
            $todayNow = $dataNow->format('Y-m-d');
            $dataNow->modify('+30 days');
            $tanggalPeriod = $dataNow->format('Y-m-d');


            // create business list id
            $createBusinessList = TBusinessList::create([
                // "businesslist_credit_account_number" => $norek_pinjaman,
                "BANK_LIST_ID" => $bankId,
                "BANK_BRANCH_ID" => $branchId,
                "DatePeriode" => $todayNow . ' s/d ' . $tanggalPeriod,
                "USER_BANK_ID" => $bankAdminId,
                "THE_INSURED_ID" => $the_insured_id,
                "BANK_INSURANCE_ID" => $bankInsuranceId,
                // "CreditAgreementDate" => $credit_agreement_date,
                "BUSINESS_LIST_INCEPTION_DATE" => $inception_date,
                "BUSINESS_LIST_DUE_DATE" => $due_date,
                "StatusCertificateId" => 1,
                "BUSINESS_LIST_SUM_INSURED" => $sum_insured,
                "BUSINESS_LIST_CODE" => $codeBusiness,
                "BUSINESS_LIST_SUBMISSION_CODE" => $codeBusiness,
                // "CreditPlafond" => $credit_plafond,
                "CoverNoteNumber" => $coverNote,
                "BUSINESS_LIST_AMOUNT" => $total_premi,
                "BankOfficeCode" => $BankOfficeCode,
                "BankBranchCode" => $BankBranchCode,
                "BankOfficeName" => $BankOfficeName,
                "BankBranchName" => $BankBranchName,
                "TARIF_PAYROLL_ID" => $tarif_payroll,
                "JENIS_ASURANSI_ID" => $jenis_asuransi,
                "BUSINESS_LIST_RATE" => $rate,
                "BUSINESS_LIST_TENOR" => $tenor,
                "BUSINESS_LIST_STATUS" => "process",
                // "CreditReference" => $credit_reference,
                "offer_detail_id" => $offer_detail_id,
                // "business_type" => $offer_detail_type,
                "loan_type_id" => $loan_type_id,
                // "health_status" => $health_status,
                // "health_letter" => $health_letter,
                // "businesslist_rm" => $offer_rm,
                "BUSINESS_LIST_CREATED_DATE" => $date,
                "BUSINESS_LIST_CREATED_BY" => $user_id
            ])->BUSINESS_LIST_ID;

            //update code businesslist
            TBusinessList::where('BUSINESS_LIST_ID', $createBusinessList)->update([
                'BUSINESS_LIST_CODE' => "B" . date('Y') . "" . date('m') .  "" . $createBusinessList
            ]);
            //end of update code

            //update business list id di t history
            TBusinessDocument::where('OFFER_ID', $offer_id)->update([
                'BUSINESS_LIST_ID' => $createBusinessList
            ]);
            //end of update document

            //Update offer status menjadi finalized
            TOffer::where('OFFER_ID', $offer_id)->update([
                'offer_status' => 1
            ]);

            return $createBusinessList;
        });

        return $result;
    }

    function templateSuratCoverNoteChubb($cover_note_id, $logo_insurance)
    {
        $today = tgl_format_indo_lengkap(date("Y-m-d"));
        $currentYear = date('Y');
        $arrDataCoverNote = getDataCoverNoteById($cover_note_id);
        // print_r($today);exit;
        $bankName = "";
        if ($arrDataCoverNote[0]['BANK_LIST_ID'] == 1 || $arrDataCoverNote[0]['BANK_LIST_ID'] == "1") {
            $bankName = "BJB";
        }

        $cover_note_number = $arrDataCoverNote[0]["covernote_number"];
        $cover_note_debitur = $arrDataCoverNote[0]["THE_INSURED_NAME"];
        $cabangName = $arrDataCoverNote[0]["BankOfficeName"];
        $cover_note_tenor = ceil($arrDataCoverNote[0]["BUSINESS_LIST_TENOR"] / 12);
        $cover_note_plafond = number_format($arrDataCoverNote[0]["BUSINESS_LIST_SUM_INSURED"], 2);
        $cover_note_plafond_pure = $arrDataCoverNote[0]["BUSINESS_LIST_SUM_INSURED"];
        // $cover_note_inception_date = $this->utility->tgl_indo_full_format($arrDataCoverNote[0]["InceptionDate"]);
        // $cover_note_due_date = $this->utility->tgl_indo_full_format($arrDataCoverNote[0]["DueDate"]);
        $cover_note_premi = number_format($arrDataCoverNote[0]["BUSINESS_LIST_AMOUNT"], 2);
        $cover_note_rate = number_format($arrDataCoverNote[0]["BUSINESS_LIST_RATE"], 2);
        $cover_note_premi_pure = $arrDataCoverNote[0]["BUSINESS_LIST_AMOUNT"];

        $cover_note_ktp = $arrDataCoverNote[0]["THE_INSURED_ID_NUMBER"];
        $cover_note_tanggal_lahir = tgl_format_indo($arrDataCoverNote[0]["THE_INSURED_DATE_OF_BIRTH"]);
        $cover_note_age = $arrDataCoverNote[0]["THE_INSURED_AGE"];
        // $cover_note_job_name = $arrDataCoverNote[0]["work_type_name"];
        // $terbilang = $this->utility->counted_as($cover_note_premi_pure);
        // $terbilang_plafond = $this->utility->counted_as($cover_note_plafond_pure);
        $dataNow = now();
        $todayNow = tgl_format_indo($dataNow->format('Y-m-d'));
        $dataNow->modify('+30 days');
        $tanggalPeriod = tgl_format_indo($dataNow->format('Y-m-d'));
        $extraPremi = number_format($arrDataCoverNote[0]["OFFER_DETAIL_AMOUNT_EXTRA_PREMI"], 2);
        $extraPremiPure = $arrDataCoverNote[0]["OFFER_DETAIL_AMOUNT_EXTRA_PREMI"];
        // total Premi
        $totalPremi = $cover_note_premi_pure + $extraPremiPure;

        $html = '<table width="610" border="0" cellpadding="0" cellspacing="0">
					
				  <tr>
						<td style="width:120">
                            <img width="100" style="position:absolute;" src="' . $logo_insurance . '"/>
                        </td>
						<td width="150" valign="top">
							<p style="font-size:7px;font-weight:bold;">PT Chubb Life Insurance Indonesia<br />
							Head Office <br />
                Chubb Square, lantai 6. <br />
                Jl. M.H. Thamrin No.10 <br />
                Jakarta 10230, Indonesia</p>
						</td>
						<td width="120" valign="top">
							<p style="font-size:7px;font-weight:bold;"><br />
							Chubb Life Care <br />
                Chubb Square, lantai 5. <br />
                Jl. M.H. Thamrin No.10 <br />
                Jakarta 10230, Indonesia</p>
						</td>
						<td width="100" valign="top">
							<p style="font-size:7px;font-weight:bold;"><br />
							Tel : +62 21 2356 8887 <br />
                WA : 081584814087 <br />
                Hotline : 14087 <br />
                www.chubb.com/id</p>
						</td>
				  </tr>
				</table>
	
				<table border="0" cellpadding="0" cellspacing="0" width="489">
	<tbody>
	<tr><td></td></tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;">Jakarta, ' . $today . '<br />
				No. ' . $cover_note_number . '
				</p>
			</td>
		</tr>
	<tr><td></td></tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;"><strong>' . $bankName . ' ' . $cabangName . '</strong><br />
				</p>
			</td>
		</tr>
	<tr><td></td></tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;">
				Dengan Hormat,
				</p>
			</td>
		</tr>
	<tr><td></td></tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;text-align: justify;
  text-justify: inter-word;">
				Terima kasih atas kepercayaan Anda kepada PT Chubb Life Insurance
        Indonesia dalam memberikan perlindungan Asuransi Jiwa Kredit Kumpulan
        bagi Nasabah Anda.
				</p>
			</td>
		</tr>
		
		<tr><td></td></tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;">Sehubungan dengan Proposal Pengajuan Asuransi Jiwa (PPAJ) Kredit Kumpulan bagi Nasabah yang Anda ajukan, dengan gembira kami sampaikan bahwa PPAJ Kredit Kumpulan tersebut telah kami setujui. Dengan demikian kami akan memberikan pertanggungan terhadap:
				</p>
			</td>
		</tr>
		<tr>
			<td colspan="2" valign="top">
				<br />
				<br />
				<table border="0" cellpadding="0" cellspacing="0" width="550">
					<tbody>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Nama Calon Tertanggung</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">' . $cover_note_debitur . '</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Tanggal Lahir (Usia)</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">' . $cover_note_tanggal_lahir . ' (' . $cover_note_age . ') Tahun</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Uang Pertanggungan</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">Rp. ' . $cover_note_plafond . '</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Masa Pertanggungan</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">' . $cover_note_tenor . ' Tahun</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Tarif Premi</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">' . $cover_note_rate . ' Per 1000 Uang Pertanggungan</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Premi</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">Rp. ' . $cover_note_premi . '</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Ekstra Premi</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">Rp. ' . $extraPremi . '</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Total Premi</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">Rp. ' . number_format($totalPremi, 2) . '</p>
							</td>
						</tr>
                        <tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Cover Note Period</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">' . $todayNow . ' - ' . $tanggalPeriod . '</p>
							</td>
						</tr>
                        <tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="149">
								<p style="font-size:9px;">Produk Asuransi</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">Asuransi Jiwa Kredit</p>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
		
	<tr><td></td></tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;">Surat Akseptasi ini berlaku selama 30 (tiga puluh) hari kalender sejak tanggal diterbitkan. Untuk penerbitan Sertifikat Asuransi, maka kolom persetujuan wajib diisi dan di email ke Group.ReportCreditLife@chubb.com.
				</p>
				</td>
		</tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;"><br/>Pembayaran premi harus segera dilakukan dan dibayarkan pada rekening di
        bawah ini:
				</p>
				</td>
		</tr>
		<tr>
			<td colspan="2" valign="top">
				<br />
				<br />
				<table border="0" cellpadding="0" cellspacing="0" width="550">
					<tbody>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="70">
								<p style="font-size:9px;">Atas Nama</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">PT Chubb Life Insurance Indonesia</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="70">
								<p style="font-size:9px;">Bank</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">Bank CIMB NIAGA</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="70">
								<p style="font-size:9px;">Cabang</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">CIMB Niaga Plaza</p>
							</td>
						</tr>
						<tr>
							<td valign="top" width="20">
								&nbsp;</td>
							<td valign="top" width="70">
								<p style="font-size:9px;">No. Rek</p>	
							</td>
							<td valign="top" width="10">
								<p style="font-size:9px;">:</p>
							</td>
							<td valign="top" width="371">
								<p style="font-size:9px;">5189-11-0000003706</p>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
		<tr><td></td></tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;">Demikian Surat Akseptasi ini kami sampaikan.
				</p>
				</td>
		</tr>
		<tr><td></td></tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;">Hormat Kami,<br />
				PT Chubb Life Insurance Indonesia
				</p>
				</td>
		</tr>
		<tr><td></td></tr>
		<tr>
			<td colspan="2" valign="top">
				<p style="font-size:9px;">Hery Arianto<br />
				Head of NB-UW
				</p>
				</td>
		</tr>
		<tr><td></td></tr>
        </tbody>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" style="font-size:7px;">
        <tr>
			<td colspan="2" valign="top">
				<p>*<u>Catatan:</u>
				</p>
				</td>
		</tr>
        <tr>
			<td width="10">-</td>
        <td width="489">
          Bila dana pinjaman kredit yang disetujui oleh Bank berubah dan mengakibatkan Calon Tertanggung tidak memerlukan <i>Medical Check Up</i> atau terjadi perubahan tipe <i>Medical Check Up</i>, maka biaya/selisih biaya <i>Medical Check Up</i> yang timbul akan dibebankan kepada Calon Tertanggung.
        </td>
        </tr>
        <tr>
			<td width="10">-</td>
        <td width="489">
          Bila Calon tertanggung melakukan pembatalan pengajuan pertanggungan Asuransi Jiwa Kredit Kumpulan, maka <i>Medical Check Up</i> yang timbul wajib dibayarkan oleh Calon Tertanggung.
        </td>
        </tr>
        <tr>
			<td width="10">-</td>
        <td width="489">
          Premi yang berlaku adalah Premi pada tanggal pengikatan kredit pada saat dana pinjaman telah diterima oleh Tertanggung ("Tanggal Mulai Pertanggungan"). Apabila Tanggal Mulai Pertanggungan melewati atau sama dengan tanggal ulang tahun calon Tertanggung, maka premi pada surat akseptasi ini akan disesuaikan, dan PT Chubb Life Insurance Indonesia akan menerbitkan perubahan atas Surat Akseptasi ini yang memuat besaran jumlah Premi yang belaku.
        </td>
        </tr>
	
</table>

<table width="489" style="border-right-style: solid;border-left-style: solid;border-top-style: solid;border-bottom-style: solid;" cellpadding="0" cellspacing="0">
		<tr>
			<td colspan="2" style="display: block;text-align: center; 
    vertical-align: middle;">
				<p style="font-size:8px;"><strong><u>Kolom Persetujuan</u></strong>
				</p>
				</td>
		</tr>
		<tr>
			<td colspan="2" style="display: block;">
				<p style="font-size:7px;">
				&nbsp;&nbsp;&nbsp;&nbsp;Dengan ini kami menyetujui Surat Akseptasi ini dan harap diterbitkan
        Lembar Tagihan dengan ketentuan :<br />
				&nbsp;&nbsp;&nbsp;&nbsp;Tanggal Mulai Pertanggungan :<br />
				&nbsp;&nbsp;&nbsp;&nbsp;Nama/Jabatan/Tanda Tangan/Stempel Perusahaan :<br />
				&nbsp;&nbsp;&nbsp;&nbsp;(wajib diisi oleh CSA / Petugas Bank dan di email ke
        Group.ReportCreditLife@chubb.com)
				</p>
				</td>
		</tr>
</table>
<table width="489" cellpadding="0" cellspacing="0">
		<tr>
			<td colspan="2" style="display: block;">
				<p style="font-size:7px;">
				<strong
        >Surat Akseptasi ini dicetak dengan komputer, sehingga pencantuman tanda
        tangan tidak diperlukan.</strong
      ></p>
				</td>
		</tr>
</table>';

        return $html;
    }

    function generatePdfCoverNoteChubb($business_list_id, $cover_note_id, $by, $date)
    {
        $getInsuranceId = getInsuranceId($business_list_id);
        $logo_insurance = '/storage/' . $getInsuranceId[0]["DOCUMENT_DIRNAME"] . $getInsuranceId[0]["DOCUMENT_FILENAME"];
        //Detail HTML Content for PDF
        $templateSurat = $this->templateSuratCoverNoteChubb($cover_note_id, $logo_insurance);
        $getNoSuratCn = getCoverNoteNumber($cover_note_id);
        $noSuratCn = $getNoSuratCn[0]["covernote_number"];
        $generatePdfCoverNote = generatePdfCoverNote($templateSurat, $business_list_id, $by, $date, $noSuratCn);

        return $generatePdfCoverNote;
    }

    public function generateCoverNoteChubb($business_list_id, $cn_number)
    {
        $result = DB::transaction(function () use ($business_list_id, $cn_number) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $arrBusinessList = TBusinessList::where('BUSINESS_LIST_ID', $business_list_id)
                ->leftJoin('t_theinsured', 't_business_list.THE_INSURED_ID', '=', 't_theinsured.THE_INSURED_ID')
                ->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_business_list.loan_type_id')
                ->leftJoin('t_product_scheme_loan_type', 't_product_scheme_loan_type.loan_type_id', '=', 't_loan_type.loan_type_id')
                ->leftJoin('t_product_scheme', 't_product_scheme.product_scheme_id', '=', 't_product_scheme_loan_type.product_scheme_id')
                ->leftJoin('t_product', 't_product.product_id', '=', 't_product_scheme.product_id')
                ->leftJoin('t_scheme', 't_scheme.scheme_id', '=', 't_product_scheme.scheme_id')
                ->leftJoin('t_bank_branch', 't_business_list.BANK_BRANCH_ID', '=', 't_bank_branch.BANK_BRANCH_ID')
                ->get();

            $due_date = $arrBusinessList[0]["BUSINESS_LIST_DUE_DATE"];
            $dataNow = now();
            $todayNow = $dataNow->format('Y-m-d');
            $dataNow->modify('+30 days');
            $tanggalPeriod = $dataNow->format('Y-m-d');
            $si_plafond = $arrBusinessList[0]["BUSINESS_LIST_SUM_INSURED"];
            $premium = $arrBusinessList[0]["BUSINESS_LIST_AMOUNT"];

            // create cover note
            $createCoverNote = TCoverNote::create([
                'businesslist_id' => $business_list_id,
                // 'document_id' =>,
                'covernote_number' => $cn_number,
                'covernote_date' => $date,
                'covernote_due_date' => $tanggalPeriod,
                'covernote_si' => $si_plafond,
                'covernote_premium' => $premium,
                'covernote_due_to_us' => $premium,
                'covernote_created_by' => $user_id,
                'covernote_created_date' => $date,
                // 'credit_note_paid_date'
            ])->covernote_id;

            $doc_id_cover_note = $this->generatePdfCoverNoteChubb($business_list_id, $createCoverNote, $user_id, $date, 'no');

            TCoverNote::where('covernote_id', $createCoverNote)->update([
                'document_id' => $doc_id_cover_note
            ]);
        });
    }

    function templateSuratCoverNoteHeksa($cover_note_id, $logo_insurance)
    {
        $today = tgl_format_indo_lengkap(date("Y-m-d"));
        $currentYear = date('Y');
        $arrDataCoverNote = getDataCoverNoteById($cover_note_id);
        // print_r($today);exit;
        $bankName = "";
        if ($arrDataCoverNote[0]['BANK_LIST_ID'] == 1 || $arrDataCoverNote[0]['BANK_LIST_ID'] == "1") {
            $bankName = "BJB";
        }

        $cover_note_number = $arrDataCoverNote[0]["covernote_number"];
        $cover_note_debitur = $arrDataCoverNote[0]["THE_INSURED_NAME"];
        $cabangName = $arrDataCoverNote[0]["BankOfficeName"];
        $cover_note_tenor = ceil($arrDataCoverNote[0]["BUSINESS_LIST_TENOR"] / 12);
        $cover_note_plafond = number_format($arrDataCoverNote[0]["BUSINESS_LIST_SUM_INSURED"], 2);
        $cover_note_plafond_pure = $arrDataCoverNote[0]["BUSINESS_LIST_SUM_INSURED"];
        $cover_note_inception_date = tgl_format_indo($arrDataCoverNote[0]["OFFER_INCEPTION_DATE"]);
        // $cover_note_due_date = $this->utility->tgl_indo_full_format($arrDataCoverNote[0]["DueDate"]);
        $cover_note_premi = number_format($arrDataCoverNote[0]["BUSINESS_LIST_AMOUNT"], 2);
        $cover_note_rate = number_format($arrDataCoverNote[0]["BUSINESS_LIST_RATE"], 2);
        $cover_note_premi_pure = $arrDataCoverNote[0]["BUSINESS_LIST_AMOUNT"];

        $cover_note_ktp = $arrDataCoverNote[0]["THE_INSURED_ID_NUMBER"];
        $cover_note_tanggal_lahir = tgl_format_indo($arrDataCoverNote[0]["THE_INSURED_DATE_OF_BIRTH"]);
        $cover_note_age = $arrDataCoverNote[0]["THE_INSURED_AGE"];
        // $cover_note_job_name = $arrDataCoverNote[0]["work_type_name"];
        // $terbilang = $this->utility->counted_as($cover_note_premi_pure);
        // $terbilang_plafond = $this->utility->counted_as($cover_note_plafond_pure);
        $dataNow = now();
        $todayNow = $dataNow->format('Y-m-d');
        $dataNow->modify('+30 days');
        $tanggalPeriod = $dataNow->format('Y-m-d');
        $periodCN = tgl_format_indo($tanggalPeriod);

        $html = '<table border="0">
        <tr>
            <td style="width: 20%"><img src="uploads/' . $logo_insurance . '"/></td>
            <td style="width: 55%;text-align:center;"><div><span style="font-size:17px;font-weight:bold;">PT HEKSA SOLUTION INSURANCE</span>
                    <span style="font-size:8px;">Satrio Tower 8<sup>th</sup> Floor, Jl. Prof. Dr.Satrio Block C4 No. 5, Jakarta Selatan 12950<br />Telp. 021-27883999 www.heksainsurance.co.id</span></div>
                    </td>
            <td style="width: 20%"><img src="uploads/mari-berasuransi.png"/></td>
        </tr>
        <tr>
            <td colspan="3" align="center" style="color:#4285F4;font-weight:bold;">COVER NOTE</td>
        </tr>
                <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Nomor</td>
            <td>: ' . $cover_note_number . '</td>
            <td align="right">Jakarta, ' . $today . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Hal</td>
            <td>: Persetujuan Penutupan Asuransi HEKSA Jiwa Kredit</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Kepada Yth.</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Bapak / Ibu ' . $cover_note_debitur . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Nasabah ' . $bankName . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Cabang ' . $cabangName . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Di Tempat</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Dengan Hormat,</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3" style="text-align: justify">Memperhatikan daftar pengajuan permohonan kepesertaan Asuransi HEKSA
            Jiwa Kredit tanggal ' . $cover_note_inception_date . ' dengan
            ini kami sampaikan bahwa setelah kami teliti ketentuan kepesertaan
            Asuransi HEKSA Jiwa Kredit yang dipersyaratkan, kami dapat menyetujui
            permohonan Asuransi HEKSA Jiwa Kredit dengan ketentuan sebagai berikut :
            </td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Pemegang Polis/No. Polis</td>
            <td>: ' . $bankName . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Nama Tertanggung</td>
            <td>: ' . $cover_note_debitur . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>No. Peserta</td>
            <td>: ' . $cover_note_number . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Tanggal lahir</td>
            <td>: ' . $cover_note_tanggal_lahir . ' Usia : ' . $cover_note_age . ' Tahun</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Tanggal Terbit Covernote</td>
            <td>: ' . $today . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Uang Pertanggungan Awal</td>
            <td>: Rp ' . $cover_note_plafond . ',-</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Jangka Waktu Asuransi</td>
            <td>: ' . $cover_note_tenor . ' Bulan</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Manfaat Asuransi</td>
            <td>: Meninggal Dunia sebab alami/sakit/kecelekaan terhadap Perserta/Tertanggung dalam masa asuransi.</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Total Premi Dibayar</td>
            <td>: Rp. ' . $cover_note_premi . ', -</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Banker Clause</td>
            <td>: ' . $bankName . ' - ' . $cabangName . '</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Surat Persetujuan Penutupan Asuransi ini hanya berlaku sampai dengan
            tanggal ' . $periodCN . ' dan pertanggungan akan berlaku bila premi telah
            dibayarkan dan telah kami terima.
            </td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Demikian kami sampaikan, atas perhatian dan kerjasama yang baik kami
            ucapkan terima kasih.
            </td>
        </tr>
        </table>';

        return $html;
    }

    function generatePdfCoverNoteHeksa($business_list_id, $cover_note_id, $by, $date)
    {
        $getInsuranceId = getInsuranceId($business_list_id);
        $logo_insurance = '/storage/' . $getInsuranceId[0]["DOCUMENT_DIRNAME"] . $getInsuranceId[0]["DOCUMENT_FILENAME"];
        //Detail HTML Content for PDF
        $templateSurat = $this->templateSuratCoverNoteHeksa($cover_note_id, $logo_insurance);
        $getNoSuratCn = getCoverNoteNumber($cover_note_id);
        $noSuratCn = $getNoSuratCn[0]["covernote_number"];
        $generatePdfCoverNote = generatePdfCoverNote($templateSurat, $business_list_id, $by, $date, $noSuratCn);

        return $generatePdfCoverNote;
    }

    public function generateCoverNoteHeksa($business_list_id, $cn_number)
    {
        $result = DB::transaction(function () use ($business_list_id, $cn_number) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $arrBusinessList = TBusinessList::where('BUSINESS_LIST_ID', $business_list_id)
                ->leftJoin('t_theinsured', 't_business_list.THE_INSURED_ID', '=', 't_theinsured.THE_INSURED_ID')
                ->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_business_list.loan_type_id')
                ->leftJoin('t_product_scheme_loan_type', 't_product_scheme_loan_type.loan_type_id', '=', 't_loan_type.loan_type_id')
                ->leftJoin('t_product_scheme', 't_product_scheme.product_scheme_id', '=', 't_product_scheme_loan_type.product_scheme_id')
                ->leftJoin('t_product', 't_product.product_id', '=', 't_product_scheme.product_id')
                ->leftJoin('t_scheme', 't_scheme.scheme_id', '=', 't_product_scheme.scheme_id')
                ->leftJoin('t_bank_branch', 't_business_list.BANK_BRANCH_ID', '=', 't_bank_branch.BANK_BRANCH_ID')
                ->get();

            $due_date = $arrBusinessList[0]["BUSINESS_LIST_DUE_DATE"];
            $dataNow = now();
            $todayNow = $dataNow->format('Y-m-d');
            $dataNow->modify('+30 days');
            $tanggalPeriod = $dataNow->format('Y-m-d');
            $si_plafond = $arrBusinessList[0]["BUSINESS_LIST_SUM_INSURED"];
            $premium = $arrBusinessList[0]["BUSINESS_LIST_AMOUNT"];

            // create cover note
            $createCoverNote = TCoverNote::create([
                'businesslist_id' => $business_list_id,
                // 'document_id' =>,
                'covernote_number' => $cn_number,
                'covernote_date' => $date,
                'covernote_due_date' => $tanggalPeriod,
                'covernote_si' => $si_plafond,
                'covernote_premium' => $premium,
                'covernote_due_to_us' => $premium,
                'covernote_created_by' => $user_id,
                'covernote_created_date' => $date,
                // 'credit_note_paid_date'
            ])->covernote_id;

            $doc_id_cover_note = $this->generatePdfCoverNoteHeksa($business_list_id, $createCoverNote, $user_id, $date, 'no');

            TCoverNote::where('covernote_id', $createCoverNote)->update([
                'document_id' => $doc_id_cover_note
            ]);
        });
    }

    function templateSuratCoverNoteJamkridaJabar($cover_note_id, $logo_insurance)
    {
        $today = tgl_format_indo_lengkap(date("Y-m-d"));
        $currentYear = date('Y');
        $arrDataCoverNote = getDataCoverNoteById($cover_note_id);
        // print_r($today);exit;
        $bankName = "";
        if ($arrDataCoverNote[0]['BANK_LIST_ID'] == 1 || $arrDataCoverNote[0]['BANK_LIST_ID'] == "1") {
            $bankName = "BJB";
        }

        $cover_note_number = $arrDataCoverNote[0]["covernote_number"];
        $cover_note_debitur = $arrDataCoverNote[0]["THE_INSURED_NAME"];
        $cabangName = $arrDataCoverNote[0]["BankOfficeName"];
        $cover_note_tenor = ceil($arrDataCoverNote[0]["BUSINESS_LIST_TENOR"] / 12);
        $cover_note_plafond = number_format($arrDataCoverNote[0]["BUSINESS_LIST_SUM_INSURED"], 2);
        $cover_note_plafond_pure = $arrDataCoverNote[0]["BUSINESS_LIST_SUM_INSURED"];
        $cover_note_inception_date = tgl_format_indo($arrDataCoverNote[0]["OFFER_INCEPTION_DATE"]);
        // $cover_note_due_date = $this->utility->tgl_indo_full_format($arrDataCoverNote[0]["DueDate"]);
        $cover_note_premi = number_format($arrDataCoverNote[0]["BUSINESS_LIST_AMOUNT"], 2);
        $cover_note_rate = number_format($arrDataCoverNote[0]["BUSINESS_LIST_RATE"], 2);
        $cover_note_premi_pure = $arrDataCoverNote[0]["BUSINESS_LIST_AMOUNT"];

        $cover_note_ktp = $arrDataCoverNote[0]["THE_INSURED_ID_NUMBER"];
        $cover_note_tanggal_lahir = tgl_format_indo($arrDataCoverNote[0]["THE_INSURED_DATE_OF_BIRTH"]);
        $cover_note_age = $arrDataCoverNote[0]["THE_INSURED_AGE"];
        // $cover_note_job_name = $arrDataCoverNote[0]["work_type_name"];
        // $terbilang = $this->utility->counted_as($cover_note_premi_pure);
        // $terbilang_plafond = $this->utility->counted_as($cover_note_plafond_pure);
        $dataNow = now();
        $todayNow = $dataNow->format('Y-m-d');
        $dataNow->modify('+30 days');
        $tanggalPeriod = $dataNow->format('Y-m-d');
        $periodCN = tgl_format_indo($tanggalPeriod);

        $html = '<table border="0">
        <tr>
            <td style="width: 20%"><img src="uploads/' . $logo_insurance . '"/></td>
            <td style="width: 55%;text-align:center;"><div><span style="font-size:17px;font-weight:bold;">PT Jamkrida Jabar</span>
                    <span style="font-size:8px;">-</span></div>
                    </td>
            <td style="width: 20%"><img src="uploads/mari-berasuransi.png"/></td>
        </tr>
        <tr>
            <td colspan="3" align="center" style="color:#4285F4;font-weight:bold;">COVER NOTE</td>
        </tr>
                <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Nomor</td>
            <td>: ' . $cover_note_number . '</td>
            <td align="right">Jakarta, ' . $today . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Hal</td>
            <td>: Persetujuan Penutupan Asuransi Jamkrida Jabar</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Kepada Yth.</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Bapak / Ibu ' . $cover_note_debitur . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Nasabah ' . $bankName . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Cabang ' . $cabangName . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Di Tempat</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Dengan Hormat,</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3" style="text-align: justify">Memperhatikan daftar pengajuan permohonan kepesertaan Asuransi Jamkrida Jabar Kredit tanggal ' . $cover_note_inception_date . ' dengan
            ini kami sampaikan bahwa setelah kami teliti ketentuan kepesertaan
            Asuransi Jamkirda Jabar Kredit yang dipersyaratkan, kami dapat menyetujui
            permohonan Asuransi Jamkrida Jabar Kredit dengan ketentuan sebagai berikut :
            </td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Pemegang Polis/No. Polis</td>
            <td>: ' . $bankName . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Nama Tertanggung</td>
            <td>: ' . $cover_note_debitur . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>No. Peserta</td>
            <td>: ' . $cover_note_number . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Tanggal lahir</td>
            <td>: ' . $cover_note_tanggal_lahir . ' Usia : ' . $cover_note_age . ' Tahun</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Tanggal Terbit Covernote</td>
            <td>: ' . $today . '</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Uang Pertanggungan Awal</td>
            <td>: Rp ' . $cover_note_plafond . ',-</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Jangka Waktu Asuransi</td>
            <td>: ' . $cover_note_tenor . ' Bulan</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Manfaat Asuransi</td>
            <td>: Meninggal Dunia sebab alami/sakit/kecelekaan terhadap Perserta/Tertanggung dalam masa asuransi.</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Total Premi Dibayar</td>
            <td>: Rp. ' . $cover_note_premi . ', -</td>
        </tr>
        <tr style="font-size:8px;">
            <td>Banker Clause</td>
            <td>: ' . $bankName . ' - ' . $cabangName . '</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Surat Persetujuan Penutupan Asuransi ini hanya berlaku sampai dengan
            tanggal ' . $periodCN . ' dan pertanggungan akan berlaku bila premi telah
            dibayarkan dan telah kami terima.
            </td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr style="font-size:8px;">
            <td colspan="3">Demikian kami sampaikan, atas perhatian dan kerjasama yang baik kami
            ucapkan terima kasih.
            </td>
        </tr>
        </table>';

        return $html;
    }

    function generatePdfCoverNoteJamkridaJabar($business_list_id, $cover_note_id, $by, $date)
    {
        $getInsuranceId = getInsuranceId($business_list_id);
        $logo_insurance = '/storage/' . $getInsuranceId[0]["DOCUMENT_DIRNAME"] . $getInsuranceId[0]["DOCUMENT_FILENAME"];
        //Detail HTML Content for PDF
        $templateSurat = $this->templateSuratCoverNoteJamkridaJabar($cover_note_id, $logo_insurance);
        $getNoSuratCn = getCoverNoteNumber($cover_note_id);
        $noSuratCn = $getNoSuratCn[0]["covernote_number"];
        $generatePdfCoverNote = generatePdfCoverNote($templateSurat, $business_list_id, $by, $date, $noSuratCn);

        return $generatePdfCoverNote;
    }

    public function generateCoverNoteJamkridaJabar($business_list_id, $cn_number)
    {
        $result = DB::transaction(function () use ($business_list_id, $cn_number) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $arrBusinessList = TBusinessList::where('BUSINESS_LIST_ID', $business_list_id)
                ->leftJoin('t_theinsured', 't_business_list.THE_INSURED_ID', '=', 't_theinsured.THE_INSURED_ID')
                ->leftJoin('t_loan_type', 't_loan_type.loan_type_id', '=', 't_business_list.loan_type_id')
                ->leftJoin('t_product_scheme_loan_type', 't_product_scheme_loan_type.loan_type_id', '=', 't_loan_type.loan_type_id')
                ->leftJoin('t_product_scheme', 't_product_scheme.product_scheme_id', '=', 't_product_scheme_loan_type.product_scheme_id')
                ->leftJoin('t_product', 't_product.product_id', '=', 't_product_scheme.product_id')
                ->leftJoin('t_scheme', 't_scheme.scheme_id', '=', 't_product_scheme.scheme_id')
                ->leftJoin('t_bank_branch', 't_business_list.BANK_BRANCH_ID', '=', 't_bank_branch.BANK_BRANCH_ID')
                ->get();

            $due_date = $arrBusinessList[0]["BUSINESS_LIST_DUE_DATE"];
            $dataNow = now();
            $todayNow = $dataNow->format('Y-m-d');
            $dataNow->modify('+30 days');
            $tanggalPeriod = $dataNow->format('Y-m-d');
            $si_plafond = $arrBusinessList[0]["BUSINESS_LIST_SUM_INSURED"];
            $premium = $arrBusinessList[0]["BUSINESS_LIST_AMOUNT"];

            // create cover note
            $createCoverNote = TCoverNote::create([
                'businesslist_id' => $business_list_id,
                // 'document_id' =>,
                'covernote_number' => $cn_number,
                'covernote_date' => $date,
                'covernote_due_date' => $tanggalPeriod,
                'covernote_si' => $si_plafond,
                'covernote_premium' => $premium,
                'covernote_due_to_us' => $premium,
                'covernote_created_by' => $user_id,
                'covernote_created_date' => $date,
                // 'credit_note_paid_date'
            ])->covernote_id;

            $doc_id_cover_note = $this->generatePdfCoverNoteJamkridaJabar($business_list_id, $createCoverNote, $user_id, $date, 'no');

            TCoverNote::where('covernote_id', $createCoverNote)->update([
                'document_id' => $doc_id_cover_note
            ]);
        });
    }

    public function prosesApproval($idOfferDetail)
    {
        $result = DB::transaction(function () use ($idOfferDetail) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $arrOfferDetail = getDetailOfferAll($idOfferDetail);

            $tenor = $arrOfferDetail[0]["OFFER_TENOR"];
            $rate = $arrOfferDetail[0]["OFFER_DETAIL_RATE"];
            $premi = $arrOfferDetail[0]["OFFER_DETAIL_AMOUNT"];
            $coverNote = $arrOfferDetail[0]['OFFER_SUBMISSION_CODE'];
            $insurance_id = $arrOfferDetail[0]["INSURANCE_ID"];

            if ($rate !== "0.00" && $premi !== "0.00" && $tenor !== "0") {
                $updateOfferDetail = TOfferDetail::where('OFFER_DETAIL_ID', $idOfferDetail)->update([
                    'OFFER_DETAIL_DEBITUR_IS_AGREE'             => 0,
                    'OFFER_DETAIL_CONFIRMED_BY'                 => $user_id,
                    'OFFER_DETAIL_CONFIRMED_DATE'               => $date,
                    'OFFER_DETAIL_UPDATED_BY'                   => $user_id,
                    'OFFER_DETAIL_UPDATED_DATE'                 => $date,
                ]);

                $business_list_id = $this->insertBusinessNew($idOfferDetail, $coverNote);
                switch ($insurance_id) {
                    case 1: //chubb
                        $this->generateCoverNoteChubb($business_list_id, $coverNote);
                        // $business_list_id = $this->insertBusinessNew($offer_detail_id, $coverNoteNumber);
                        // $this->generateDebitNote($business_list_id);
                        // $this->generateCoverNoteAskrida($business_list_id, $coverNoteNumber);
                        // $this->generateSertifikatAskrida($business_list_id, $arrRespondSertifikat);

                        break;
                    case 2: //heksa
                        $this->generateCoverNoteHeksa($business_list_id, $coverNote);
                        // $business_list_id = $this->insertBusinessNew($offer_detail_id, $coverNoteNumber=NULL);
                        // $this->generateDebitNote($business_list_id);
                        //$this->generateCoverNoteAskrida($business_list_id, $coverNoteNumber);
                        //$this->generateSertifikatAskrida($business_list_id, $arrRespondSertifikat);

                        break;
                    case 3: //jamkrida jabar
                        $this->generateCoverNoteJamkridaJabar($business_list_id, $coverNote);
                        // $business_list_id = $this->insertBusinessNew($offer_detail_id, $coverNoteNumber=NULL);
                        // $this->generateDebitNote($business_list_id);
                        //$this->generateCoverNoteAskrida($business_list_id, $coverNoteNumber);
                        //$this->generateSertifikatAskrida($business_list_id, $arrRespondSertifikat);

                        break;
                }
            }
        });
    }

    public function insuranceApprovePengajuan(Request $request)
    {

        // get detail offer seluruhan
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $arrOfferDetail = getDetailOfferAll($request->idOfferDetail);
            $tanggal_mulai = $arrOfferDetail[0]["OFFER_INCEPTION_DATE"];
            $tanggal_akhir = $arrOfferDetail[0]["OFFER_DUE_DATE"];

            if ($tanggal_mulai !== NULL && $tanggal_akhir !== null) {
                $this->prosesApproval($request->idOfferDetail);

                TOfferDetail::where('OFFER_ID', $arrOfferDetail[0]['OFFER_ID'])->update([
                    'OFFER_DETAIL_DEBITUR_IS_AGREE'     => 0
                ]);

                TOffer::where('OFFER_ID', '<>', $arrOfferDetail[0]['OFFER_ID'])->where('OFFER_TOKEN', $arrOfferDetail[0]['OFFER_TOKEN'])->update([
                    "OFFER_IS_DELETED" => '1',
                    'OFFER_STATUS' => '1',
                    "OFFER_DELETED_DATE" => $date,
                    "OFFER_DELETED_BY" => $user_id,
                ]);

                $arrOffer = TOffer::where('OFFER_ID', $arrOfferDetail[0]['OFFER_ID'])->first();
                if ($arrOffer->OFFER_STAGING_ID == 7 || $arrOffer->OFFER_STAGING_ID == "7") {
                    // update offer staging
                    TOffer::where('OFFER_ID', $arrOfferDetail[0]['OFFER_ID'])->update([
                        'OFFER_STAGING_ID'              => 11,
                        'OFFER_STATUS_ID'               => 3,
                        'OFFER_UPDATED_BY'              => $user_id,
                        'OFFER_UPDATED_DATE'            => $date
                    ]);

                    // create staging
                    TOfferStaging::create([
                        'offer_id'              => $arrOfferDetail[0]['OFFER_ID'],
                        'staging_pengajuan_id'  => 11,
                        'offer_staging_by'      => $user_id,
                        'offer_staging_date'    => $date
                    ]);
                    // end create staging
                }
            }
        });

        return new JsonResponse([
            'Pengajuan Success di Setujui'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function uploadPendingDocument(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();



            // get data the insured untuk edit ktp jika tipe ktp di ubah
            $arrData = TOffer::select('THE_INSURED_ID')->where('OFFER_ID', $request->OFFER_ID)->first();

            $documentUploadFile = $request->file('UPLOAD_FILE');
            if ($documentUploadFile != null) {
                // upload file yang terbaru
                for ($i = 0; $i < sizeof($documentUploadFile); $i++) {
                    $arrDocument = $documentUploadFile;

                    // create folder the insured
                    $parentDir = ((floor(($request->OFFER_ID) / 1000)) * 1000) . '/';
                    $RateSettingId = $request->OFFER_ID . '/';
                    $typeDir = "";
                    $uploadPath = "";
                    if ($request->JENIS_DOCUMENT['value'] == 1 || $request->JENIS_DOCUMENT['value'] == "1") {
                        $uploadPath = 'document/BUSINESS/KTP/' . $parentDir . $RateSettingId . $typeDir;
                    } else if ($request->JENIS_DOCUMENT['value'] == 2 || $request->JENIS_DOCUMENT['value'] == "2") {
                        $uploadPath = 'document/BUSINESS/SPAJK/' . $parentDir . $RateSettingId . $typeDir;
                    } else if ($request->JENIS_DOCUMENT['value'] == 3 || $request->JENIS_DOCUMENT['value'] == "3") {
                        $uploadPath = 'document/BUSINESS/MCU/' . $parentDir . $RateSettingId . $typeDir;
                    } else {
                        $uploadPath = 'document/BUSINESS/Pending/' . $parentDir . $RateSettingId . $typeDir;
                    }

                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentFileName = $request->OFFER_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $arrDocument[$i]->getMimeType();
                    $documentFileSize = $arrDocument[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $request->OFFER_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

                    // masukan data file ke database
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                        'DOCUMENT_FILENAME'             => $documentFileName,
                        'DOCUMENT_DIRNAME'              => $documentDirName,
                        'DOCUMENT_FILETYPE'             => $documentFileType,
                        'DOCUMENT_FILESIZE'             => $documentFileSize,
                        'DOCUMENT_CREATED_BY'           => $user_id,
                        'DOCUMENT_CREATED_BY'           => $date
                    ])->DOCUMENT_ID;

                    if ($document) {
                        // cek business document
                        $arrBusinessDoc = TBusinessDocument::where('OFFER_ID', $request->OFFER_ID)->where('DOCUMENT_TYPE_ID', $request->JENIS_DOCUMENT['value'])->first();
                        if ($arrBusinessDoc != null) {
                            $createDocumentKTP = TBusinessDocument::where('OFFER_ID', $request->OFFER_ID)->where('DOCUMENT_TYPE_ID', $request->JENIS_DOCUMENT['value'])->update([
                                "OFFER_ID"          => $request->OFFER_ID,
                                "DOCUMENT_TYPE_ID"  => $request->JENIS_DOCUMENT['value'],
                                "DOCUMENT_ID"       => $document
                            ]);
                        } else {
                            $createDocumentKTP = TBusinessDocument::create([
                                "OFFER_ID"          => $request->OFFER_ID,
                                "DOCUMENT_TYPE_ID"  => $request->JENIS_DOCUMENT['value'],
                                "DOCUMENT_ID"       => $document
                            ]);
                        }
                    }

                    // update staging pending
                    $arrOffer = TOffer::where('OFFER_ID', $request->OFFER_ID)->first();
                    if ($arrOffer->OFFER_STAGING_ID == 7 || $arrOffer->OFFER_STAGING_ID == "7") {
                        // update offer staging
                        TOffer::where('OFFER_ID', $request->OFFER_ID)->update([
                            'OFFER_STAGING_ID'              => 9,
                            'OFFER_STATUS_ID'               => 4,
                            'OFFER_UPDATED_BY'              => $user_id,
                            'OFFER_UPDATED_DATE'            => $date
                        ]);

                        // create staging
                        TOfferStaging::create([
                            'offer_id'              => $request->OFFER_ID,
                            'staging_pengajuan_id'  => 8,
                            'offer_staging_by'      => $user_id,
                            'offer_staging_date'    => $date
                        ]);

                        TOfferStaging::create([
                            'offer_id'              => $request->OFFER_ID,
                            'staging_pengajuan_id'  => 9,
                            'offer_staging_by'      => $user_id,
                            'offer_staging_date'    => $date
                        ]);
                        // end create staging
                    }
                    // end update staging pending

                    // create log
                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Upload Pending Document (Document Pengajuan)",
                            "module"      => "Pengajuan",
                            "id"          => $request->OFFER_ID
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }
            }
        });

        return new JsonResponse([
            'Upload Pending Document Pengajuan Success',
            $request->OFFER_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function uploadTolakDocument(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();



            // get data the insured untuk edit ktp jika tipe ktp di ubah
            $arrData = TOffer::select('THE_INSURED_ID')->where('OFFER_ID', $request->OFFER_ID)->first();

            $documentUploadFile = $request->file('UPLOAD_FILE');
            if ($documentUploadFile != null) {
                // upload file yang terbaru
                for ($i = 0; $i < sizeof($documentUploadFile); $i++) {
                    $arrDocument = $documentUploadFile;

                    // create folder the insured
                    $parentDir = ((floor(($request->OFFER_ID) / 1000)) * 1000) . '/';
                    $RateSettingId = $request->OFFER_ID . '/';
                    $typeDir = "";
                    $uploadPath = "";
                    if ($request->JENIS_DOCUMENT['value'] == 1 || $request->JENIS_DOCUMENT['value'] == "1") {
                        $uploadPath = 'document/BUSINESS/KTP/' . $parentDir . $RateSettingId . $typeDir;
                    } else if ($request->JENIS_DOCUMENT['value'] == 2 || $request->JENIS_DOCUMENT['value'] == "2") {
                        $uploadPath = 'document/BUSINESS/SPAJK/' . $parentDir . $RateSettingId . $typeDir;
                    } else if ($request->JENIS_DOCUMENT['value'] == 3 || $request->JENIS_DOCUMENT['value'] == "3") {
                        $uploadPath = 'document/BUSINESS/MCU/' . $parentDir . $RateSettingId . $typeDir;
                    } else {
                        $uploadPath = 'document/BUSINESS/Tolak/' . $parentDir . $RateSettingId . $typeDir;
                    }

                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentFileName = $request->OFFER_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $arrDocument[$i]->getMimeType();
                    $documentFileSize = $arrDocument[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $request->OFFER_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

                    // masukan data file ke database
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                        'DOCUMENT_FILENAME'             => $documentFileName,
                        'DOCUMENT_DIRNAME'              => $documentDirName,
                        'DOCUMENT_FILETYPE'             => $documentFileType,
                        'DOCUMENT_FILESIZE'             => $documentFileSize,
                        'DOCUMENT_CREATED_BY'           => $user_id,
                        'DOCUMENT_CREATED_BY'           => $date
                    ])->DOCUMENT_ID;

                    if ($document) {
                        // cek business document
                        $arrBusinessDoc = TBusinessDocument::where('OFFER_ID', $request->OFFER_ID)->where('DOCUMENT_TYPE_ID', $request->JENIS_DOCUMENT['value'])->first();
                        if ($arrBusinessDoc != null) {
                            $createDocumentKTP = TBusinessDocument::where('OFFER_ID', $request->OFFER_ID)->where('DOCUMENT_TYPE_ID', $request->JENIS_DOCUMENT['value'])->update([
                                "OFFER_ID"          => $request->OFFER_ID,
                                "DOCUMENT_TYPE_ID"  => $request->JENIS_DOCUMENT['value'],
                                "DOCUMENT_ID"       => $document
                            ]);
                        } else {
                            $createDocumentKTP = TBusinessDocument::create([
                                "OFFER_ID"          => $request->OFFER_ID,
                                "DOCUMENT_TYPE_ID"  => $request->JENIS_DOCUMENT['value'],
                                "DOCUMENT_ID"       => $document
                            ]);
                        }
                    }

                    // update staging pending
                    $arrOffer = TOffer::where('OFFER_ID', $request->OFFER_ID)->first();
                    if ($arrOffer->OFFER_STAGING_ID == 7 || $arrOffer->OFFER_STAGING_ID == "7") {
                        // update offer staging
                        TOffer::where('OFFER_ID', $request->OFFER_ID)->update([
                            'OFFER_STAGING_ID'              => 12,
                            'OFFER_STAGING_ID'              => 5,
                            'OFFER_UPDATED_BY'              => $user_id,
                            'OFFER_UPDATED_DATE'            => $date,
                            'OFFER_IS_DELETED'              => 1,
                        ]);

                        // create staging
                        TOfferStaging::create([
                            'offer_id'              => $request->OFFER_ID,
                            'staging_pengajuan_id'  => 12,
                            'offer_staging_by'      => $user_id,
                            'offer_staging_date'    => $date
                        ]);
                        // end create staging
                    }
                    // end update staging pending

                    // create log
                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Upload Pending Document (Document Pengajuan)",
                            "module"      => "Pengajuan",
                            "id"          => $request->OFFER_ID
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }
            }
        });

        return new JsonResponse([
            'Upload Tolak Document Pengajuan Success',
            $request->OFFER_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function batalPengajuan(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // get data offer
            $arrOffer = TOffer::where('OFFER_ID', $request->idOffer)->first();
            // if ($arrOffer->OFFER_STAGING_ID == 13 || $arrOffer->OFFER_STAGING_ID == "13") {
            // update offer staging
            TOffer::where('OFFER_ID', $request->idOffer)->update([
                'OFFER_STAGING_ID'              => 13,
                'OFFER_IS_DELETED'              => 1,
                'OFFER_STATUS_ID'               => 6,
                'OFFER_UPDATED_BY'              => $user_id,
                'OFFER_UPDATED_DATE'            => $date
            ]);

            // create staging
            TOfferStaging::create([
                'offer_id'              => $request->idOffer,
                'staging_pengajuan_id'  => 13,
                'offer_staging_by'      => $user_id,
                'offer_staging_date'    => $date
            ]);
            // end create staging
            // }


            // create log
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Pengajuan Batal (Batal Pengajuan)",
                    "module"      => "Pengajuan",
                    "id"          => $request->idOffer
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'Batal Pengajuan Success',
            $request->idOffer
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getAllTotal(Request $request)
    {
        $arrDataPenutupan = getAllTotalPenutupan($request);
        $arrDataPengajuan = getAllTotalPengajuan($request);
        $arrDataProses = getAllTotalProses($request);
        $arrDataSetuju = getAllTotalSetuju($request);
        $arrDataPending = getAllTotalPending($request);
        $arrDataTolak = getAllTotalTolak($request);
        $arrDataBatal = getAllTotalBatal($request);



        return array(
            "arrDataProses"         => $arrDataProses,
            "arrDataPenutupan"      => $arrDataPenutupan,
            "arrDataPengajuan"      => $arrDataPengajuan,
            "arrDataSetuju"         => $arrDataSetuju,
            "arrDataPending"        => $arrDataPending,
            "arrDataTolak"          => $arrDataTolak,
            "arrDataBatal"          => $arrDataBatal,
        );
    }

    public function saveEditPremi(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // dd($request);
            // update for create rate history
            $rateHistory = getRateHistory($request->dataOfferDetail[0]['OFFER_DETAIL_ID']);

            if ($rateHistory === null) {
                // create data di t_offer_detail
                $createRateHistory = TRateHistory::create([
                    "offer_detail_id"                   => $request->dataOfferDetail[0]['OFFER_DETAIL_ID'],
                    "rate_history_tenor_regular"        => $request->dataOfferDetail[0]['OFFER_TENOR'],
                    "rate_history_rate_regular"         => $request->dataOfferDetail[0]['OFFER_DETAIL_RATE'],
                    "rate_history_premium_regular"      => $request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT'],
                    // "rate_history_tenor_combination" => $tenor_kom,
                    "rate_history_extra_premi"          => $request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT_EXTRA_PREMI'],
                    "rate_history_rate_combination"     => isset($request->dataOfferDetail[0]['OFFER_DETAIL_RATE_COMBINATION']) ? $request->dataOfferDetail[0]['OFFER_DETAIL_RATE_COMBINATION'] : null,
                    "rate_history_premium_combination"  => isset($request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT_COMBINATION']) ? $request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT_COMBINATION'] : null,
                    "rate_history_is_original"          => 1,
                    "rate_history_created_by"           => $user_id,
                    "rate_history_created_date"         => $date
                ])->OFFER_DETAIL_ID;
            } else {
                $createRateHistory = TRateHistory::create([
                    "offer_detail_id"                   => $request->dataOfferDetail[0]['OFFER_DETAIL_ID'],
                    "rate_history_tenor_regular"        => $request->dataOfferDetail[0]['OFFER_TENOR'],
                    "rate_history_rate_regular"         => $request->dataOfferDetail[0]['OFFER_DETAIL_RATE'],
                    "rate_history_premium_regular"      => $request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT'],
                    // "rate_history_tenor_combination" => $tenor_kom,
                    "rate_history_extra_premi"          => $request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT_EXTRA_PREMI'],
                    "rate_history_rate_combination"     => isset($request->dataOfferDetail[0]['OFFER_DETAIL_RATE_COMBINATION']) ? $request->dataOfferDetail[0]['OFFER_DETAIL_RATE_COMBINATION'] : null,
                    "rate_history_premium_combination"  => isset($request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT_COMBINATION']) ? $request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT_COMBINATION'] : null,
                    "rate_history_is_original"          => 0,
                    "rate_history_created_by"           => $user_id,
                    "rate_history_created_date"         => $date
                ])->OFFER_DETAIL_ID;
            }

            // update t_offer
            TOffer::where('OFFER_ID', $request->dataOfferDetail[0]['OFFER_ID'])->update([
                "OFFER_TENOR" => $request->dataOfferDetail[0]['OFFER_TENOR']
            ]);

            // update t_offer_detail
            TOfferDetail::where('OFFER_DETAIL_ID', $request->dataOfferDetail[0]['OFFER_DETAIL_ID'])->update([
                "OFFER_DETAIL_RATE"                 => $request->dataOfferDetail[0]['OFFER_DETAIL_RATE'],
                "OFFER_DETAIL_AMOUNT"               => $request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT'],
                "OFFER_DETAIL_AMOUNT_EXTRA_PREMI"   => $request->dataOfferDetail[0]['OFFER_DETAIL_AMOUNT_EXTRA_PREMI']
            ]);
        });

        return new JsonResponse([
            'Edit Extra Premi Success',
            $request->dataOfferDetail[0]['OFFER_ID']
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    function getSumberPembayaran()
    {
        $data = RTarifPayroll::get();

        return response()->json($data);
    }

    function calculatePremi(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            'TYPE_INSURANCE'                => 'required',
            'TYPE_PAYROLL'                  => 'required',
            'TGL_LAHIR'                     => 'required',
            'RENCANA_TGL_PENCAIRAN'         => 'required',
        ], [
            'TYPE_INSURANCE'                => 'Jenis Asuransi is required!',
            'TYPE_PAYROLL'                  => 'Sumber Pembayaran is required!',
            'TGL_LAHIR'                     => 'Tanggal Lahir is required!',
            'RENCANA_TGL_PENCAIRAN'         => 'Rencana Tgl Pencairan is required!',
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        // Data Auth
        $user = Auth::user();
        $user_id = $user->id;
        $date = now();

        // convert sum insured
        $numberSumInsured = (int) str_replace(',', '.', $request->SUM_INSURED);


        $arrDataEffecvtive = getCurrentEffectiveDate($user->BANK_LIST_ID, $request['TYPE_INSURANCE']['value']);
        $eff_id = $arrDataEffecvtive[0]["SHARE_EFFECTIVE_DATE_ID"];
        $arrInsurance = getShareConfigurationByEffectiveIdAndNoRedFlag($eff_id);
        $hasilRegOrGP = array();
        for ($i = 0; $i < sizeof($arrInsurance); $i++) {
            $reg["documenIdRate"] = $arrInsurance[$i]["RATE_MANAGE_ID"];
            $reg["insurance_id"] = $arrInsurance[$i]["INSURANCE_ID"];
            $reg["age"] = $request->USIA_DEBITUR;
            $reg["tenor_reg"] = $request->TENOR;
            $reg["birth_date"] = $request->TGL_LAHIR;
            $reg["plafond"] = $numberSumInsured;
            $reg["jenis_rate"] = $request['TYPE_INSURANCE']['value'];
            $reg["tanggal_awal"] = $request->RENCANA_TGL_PENCAIRAN;

            $hasilPremiRate = calculateRatePremiAdeleSistem($reg);

            $hasilTotal = $hasilPremiRate["premium"];

            if ($hasilTotal > 0) {
                $arrayInsurance["BankInsuranceId"] = $arrInsurance[$i]["BANK_INSURANCE_ID"];
                $arrayInsurance["rateRegular"] = $hasilPremiRate["rate"];
                $arrayInsurance["premiRegular"] = $hasilPremiRate["premium"];
                $arrayInsurance["rateGP"] = '0';
                $arrayInsurance["premiGP"] = '0';
                $arrayInsurance["totalPremi"] =  $hasilTotal;
            } else {
                $arrayInsurance["BankInsuranceId"] = $arrInsurance[$i]["BANK_INSURANCE_ID"];
                $arrayInsurance["rateRegular"] = '0';
                $arrayInsurance["premiRegular"] = '0';
                $arrayInsurance["rateGP"] = '0';
                $arrayInsurance["premiGP"] = '0';
                $arrayInsurance["totalPremi"] =  $hasilTotal;
            }

            $arrayInsurance["InsuranceName"] =  $arrInsurance[$i]["INSURANCE_NAME"];
            $arrayInsurance["TyePayroll"] = $request['TYPE_INSURANCE']['label'];
            array_push($hasilRegOrGP, $arrayInsurance);
        }

        return new JsonResponse([
            'Calculate Premi Success',
            $hasilRegOrGP
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function forInsuranceReview(Request $request)
    {

        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // data request
            $dataOfferDetail = $request->dataSelectRow;

            for ($i = 0; $i < count($dataOfferDetail); $i++) {
                $offerDetailId = $dataOfferDetail[$i]['OFFER_DETAIL_ID'];

                // update is used t_offer_detail
                TOfferDetail::where('OFFER_DETAIL_ID', $offerDetailId)->update([
                    'OFFER_DETAIL_IS_REVIEW'           => 1,
                    'OFFER_DETAIL_UPDATED_BY'          => $user_id,
                    'OFFER_DETAIL_UPDATED_DATE'        => $date
                ]);
            }





            // create log
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Pengajuan (Pemilihan Asuransi)",
                    "module"      => "Pengajuan",
                    "id"          => $request->dataSelectRow[0]['OFFER_ID']
                ]),
                'action_by'  => $user->user_login
            ]);

            return $request->dataSelectRow[0]['OFFER_ID'];
        });

        return new JsonResponse([
            'Select Asuransi Pengajuan Success',
            $result
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function selectInsurance(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // cek terlebih dulu, asuransi tersebut apakah ada underwriting, kalo gaada maka pindah ke proses penawaran, kalo ada lanjut proses underwriting
            // get data insurance
            $arrDataInsurance = getInsuranceById($request->dataInsurance['INSURANCE_ID']);
            $productId = $arrDataInsurance->PRODUK_ASURANSI_ID;
            // GET PRODUKNYA
            $arrDataProduk = getProdukAsuransiById($productId);
            // dd($arrDataInsurance);
            if ($arrDataProduk->UNDERWRITING_ID === null || $arrDataProduk->UNDERWRITING_ID === "") { // jika null atau kosong, masuk ke penawaran
                // update t_offer masuk ke proses penawaran
                TOffer::where('OFFER_ID', $request->dataInsurance['OFFER_ID'])
                    ->update([
                        "OFFER_IS_PENAWARAN"        => 1,
                        "OFFER_UPDATED_BY"          => $user_id,
                        "OFFER_UPDATED_DATE"        => $date
                    ]);

                TOfferDetail::where('OFFER_DETAIL_ID', $request->dataInsurance['OFFER_DETAIL_ID'])->update([
                    'OFFER_DETAIL_IS_USED'             => 1,
                    'OFFER_DETAIL_UPDATED_BY'          => $user_id,
                    'OFFER_DETAIL_UPDATED_DATE'        => $date
                ]);

                return new JsonResponse([
                    'Asuransi tidak ada proses underwting, maka akan dilanjutkan ke penawaran',
                    "Penawaran"
                ], 201, [
                    'X-Inertia' => true
                ]);
            } else {
                // update t_offer masuk ke proses penawaran
                TOffer::where('OFFER_ID', $request->dataInsurance['OFFER_ID'])
                    ->update([
                        "OFFER_IS_UNDERWRITING"         => 1,
                        "OFFER_UPDATED_BY"              => $user_id,
                        "OFFER_UPDATED_DATE"            => $date
                    ]);

                TOfferDetail::where('OFFER_DETAIL_ID', $request->dataInsurance['OFFER_DETAIL_ID'])->update([
                    'OFFER_DETAIL_IS_USED'             => 1,
                    'OFFER_DETAIL_UPDATED_BY'          => $user_id,
                    'OFFER_DETAIL_UPDATED_DATE'        => $date
                ]);

                return new JsonResponse([
                    'Asuransi ada proses underwting, maka akan dilanjutkan ke underwriting',
                    "Undwriting"
                ], 201, [
                    'X-Inertia' => true
                ]);
            }
        });

        return new JsonResponse([
            'Terima Pengajuan Success',
            $result
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getFilterInsurance(Request $request)
    {
        // get all mekanisme 
        $arrDataParameterProduk = TParameterProduk::where('PARAMETER_PRODUK_IS_CATEGORY', 0)->get();

        if ($request->flag == "penawaran") {
            $arrFilterInsurance = MOfferInsurance::leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 'm_offer_insurance.INSURANCE_ID')
                ->leftJoin('t_offer_detail', 't_offer_detail.OFFER_DETAIL_ID', '=', 'm_offer_insurance.OFFER_DETAIL_ID')
                ->where('t_insurance.INSURANCE_TYPE_ID', $request->jenisAsuransiId)
                ->where('t_offer_detail.offer_detail_is_used', 1)
                ->where('m_offer_insurance.OFFER_ID', $request->idOffer)
                ->get();
        } else {
            $arrFilterInsurance = MOfferInsurance::leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 'm_offer_insurance.INSURANCE_ID')
                ->where('t_insurance.INSURANCE_TYPE_ID', $request->jenisAsuransiId)
                ->where('m_offer_insurance.OFFER_ID', $request->idOffer)
                ->get();
        }


        return array(
            "arrDataParameterProduk"       => $arrDataParameterProduk,
            "arrFilterInsurance"           => $arrFilterInsurance
        );
    }
}
