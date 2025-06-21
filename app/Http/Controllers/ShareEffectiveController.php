<?php

namespace App\Http\Controllers;

use App\Models\Insurance;
use App\Models\RateSetting;
use App\Models\RJenisAsuransi;
use App\Models\TBankInsurance;
use App\Models\TShareEffectiveDate;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ShareEffectiveController extends Controller
{
    public function getCurrentEffectiveDate()
    {
        $today = now();
        $data = TShareEffectiveDate::where('SHARE_EFFECTIVE_DATE', '<=', $today)->where('JENIS_ASURANSI_ID', 1)->orderBy('SHARE_EFFECTIVE_CREATED', 'DESC')->orderBy('SHARE_EFFECTIVE_DATE', 'DESC')->limit(1)->get();

        return $data;
    }

    public function getCurrentEffectiveDateAll()
    {
        $today = now();
        $data = TShareEffectiveDate::where('SHARE_EFFECTIVE_DATE', '<=', $today)->orderBy('SHARE_EFFECTIVE_CREATED', 'DESC')->orderBy('SHARE_EFFECTIVE_DATE', 'DESC')->limit(1)->get();

        return $data;
    }

    public function getCurrentEffectiveDateKredit()
    {
        $today = now();
        $data = TShareEffectiveDate::where('SHARE_EFFECTIVE_DATE', '<=', $today)->where('JENIS_ASURANSI_ID', 2)->orderBy('SHARE_EFFECTIVE_CREATED', 'DESC')->orderBy('SHARE_EFFECTIVE_DATE', 'DESC')->limit(1)->get();

        return $data;
    }

    public function index()
    {
        $insuranceList = Insurance::select('INSURANCE_ID', 'INSURANCE_NAME')->get();
        $dataShareEffective = $this->getCurrentEffectiveDate();
        $dataRate = RateSetting::get();


        return Inertia::render('ShareEffective/ShareEffective', [
            'insuranceList'         => $insuranceList,
            'shareEffective'        => $dataShareEffective,
            'dataRate'              => $dataRate,
        ]);
    }


    public function getShareEffective(Request $request)
    {
        $dataShareEffective = $this->getCurrentEffectiveDate();
        $idShareEffective = "";
        if (sizeof($dataShareEffective) >= 1) {
            $idShareEffective = $dataShareEffective[0]['SHARE_EFFECTIVE_DATE_ID'];
        }
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'BANK_INSURANCE_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listShareEffective = TBankInsurance::select('INSURANCE_NAME', 'BANK_INSURANCE_SHARE')->where('SHARE_EFFECTIVE_DATE_ID', $idShareEffective)->when($search, function ($query, $search) {
            return $query->where('JENIS_ASURANSI_ID', 'like', "%{$search}%");
        })
            ->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID')
            ->leftJoin('t_bank_list', 't_bank_list.BANK_LIST_ID', '=', 't_bank_insurance.BANK_LIST_ID')
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listShareEffective);
    }

    public function getShareEffectiveKredit(Request $request)
    {
        $dataShareEffective = $this->getCurrentEffectiveDateKredit();
        $idShareEffective = "";
        if (sizeof($dataShareEffective) >= 1) {
            $idShareEffective = $dataShareEffective[0]['SHARE_EFFECTIVE_DATE_ID'];
        }
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'BANK_INSURANCE_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listShareEffective = TBankInsurance::select('INSURANCE_NAME', 'BANK_INSURANCE_SHARE')->where('SHARE_EFFECTIVE_DATE_ID', $idShareEffective)->when($search, function ($query, $search) {
            return $query->where('JENIS_ASURANSI_ID', 'like', "%{$search}%");
        })
            ->leftJoin('t_insurance', 't_insurance.INSURANCE_ID', '=', 't_bank_insurance.INSURANCE_ID')
            ->leftJoin('t_bank_list', 't_bank_list.BANK_LIST_ID', '=', 't_bank_insurance.BANK_LIST_ID')
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listShareEffective);
    }

    public function getInsuranceType()
    {
        $data = RJenisAsuransi::get();

        return response()->json($data);
    }

    public function getInsuranceList()
    {
        $data = Insurance::select('INSURANCE_ID', 'INSURANCE_NAME')->get();

        return response()->json($data);
    }


    public function saveConfigurationShare(Request $request)
    {
        // dd($request);
        $validateData = Validator::make($request->all(), [
            'SHARE_EFFECTIVE_DATE'    => 'required',
            'JENIS_ASURANSI_ID'       => 'required'
        ], [
            'SHARE_EFFECTIVE_DATE'    => 'Effective Date is Required',
            'JENIS_ASURANSI_ID'       => 'Jenis Asuransi is Required'
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        // Cek jika share nya kosong
        $bankInsurance = is_countable($request->bank_insurance);
        $totalShare = 0;
        if ($bankInsurance) {
            for ($i = 0; $i < sizeof($request->bank_insurance); $i++) {
                $bankInsurance = $request->bank_insurance[$i];
                if (isset($bankInsurance['SHARE'])) {
                    $totalShare += $bankInsurance['SHARE'];
                }
            }
        }
        if ($totalShare === 0 || $totalShare > 100) {
            return new JsonResponse([
                'Total share is not 100% !',
                'share',
                $request->bank_insurance
            ], 201, [
                'X-Inertia' => true
            ]);
        }

        $result = DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            // update dulu semua effective menjadi inactive lalu gantikan yang baru dengan status active
            $today = date('Y-m-d');
            $effectiveDate = date("Y-m-d", strtotime($request->SHARE_EFFECTIVE_DATE));
            if ($effectiveDate <= $today) {
                TShareEffectiveDate::where('JENIS_ASURANSI_ID', $request->JENIS_ASURANSI_ID['value'])->update([
                    "SHARE_EFFECTIVE_STATUS" => 1
                ]);
            }

            $createShareEffective = TShareEffectiveDate::create([
                "BANK_LIST_ID"                      => "1",
                "JENIS_ASURANSI_ID"                 => $request->JENIS_ASURANSI_ID['value'],
                "SHARE_EFFECTIVE_DATE"              => $request->SHARE_EFFECTIVE_DATE,
                "SHARE_EFFECTIVE_CREATED"           => $request->SHARE_EFFECTIVE_DATE,
                "SHARE_EFFECTIVE_CREATED_BY"        => $user_id,
                "SHARE_EFFECTIVE_CREATED_DATE"      => $date,
            ])->SHARE_EFFECTIVE_DATE_ID;

            $bankInsurance = is_countable($request->bank_insurance);

            if ($bankInsurance) {
                for ($i = 0; $i < sizeof($request->bank_insurance); $i++) {
                    $bankInsurance = $request->bank_insurance[$i];

                    if (isset($bankInsurance['SHARE'])) {
                        $createBankInsurance = TBankInsurance::create([
                            "BANK_LIST_ID"                        => "1",
                            "BANK_ADMIN_ID"                       => $user_id,
                            "INSURANCE_ID"                        => $bankInsurance['INSURANCE_ID'],
                            "BANK_INSURANCE_PIC"                  => isset($bankInsurance['PIC_NAME']) ? $bankInsurance['PIC_NAME'] : NULL,
                            "BANK_INSURANCE_EMAIL"                => isset($bankInsurance['EMAIL']) ? $bankInsurance['EMAIL'] : NULL,
                            "BANK_INSURANCE_MSISDN"               => isset($bankInsurance['PHONE_NUMBER']) ? $bankInsurance['PHONE_NUMBER'] : NULL,
                            "BANK_INSURANCE_ADDRESS"              => isset($bankInsurance['ADDRESS']) ? $bankInsurance['ADDRESS'] : NULL,
                            "BANK_INSURANCE_SHARE"                => isset($bankInsurance['SHARE']) ? $bankInsurance['SHARE'] : NULL,
                            "RATE_MANAGE_ID"                      => isset($bankInsurance['RATE_MANAGE_ID']) ? $bankInsurance['RATE_MANAGE_ID'] : NULL,
                            "BANK_INSURANCE_STATUS"               => "active",
                            "SHARE_EFFECTIVE_DATE_ID"             => $createShareEffective
                        ]);
                    }
                }
            }

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Share Effective Date)",
                    "module"      => "Share Effective Date",
                    "id"          => $createShareEffective
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'Share Effective Date Created'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function upcomingShareEffective(Request $request)
    {
        $today = now();
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'SHARE_EFFECTIVE_DATE');
        $sortDirection = $request->input('sort_direction', 'ASC');
        $search = json_decode($request->input('search', ''));
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listShareEffective = TShareEffectiveDate::with('bankInsurance')->select(
            'SHARE_EFFECTIVE_DATE',
            'SHARE_EFFECTIVE_CREATED',
            'SHARE_EFFECTIVE_CREATED_DATE',
            't_user.user_login',
            'SHARE_EFFECTIVE_UPDATED_BY',
            'SHARE_EFFECTIVE_UPDATED_DATE',
            't_share_effective_date.JENIS_ASURANSI_ID',
            'SHARE_EFFECTIVE_DATE_ID',
            'tu.user_login as userLogin',
            'r_jenis_asuransi.JENIS_ASURANSI_NAME'
        )
            ->where('SHARE_EFFECTIVE_DATE', '>', $today)->when($search, function ($query, $search) {
                return $query->where('JENIS_ASURANSI_ID', 'like', "%{$search}%");
            })
            ->leftJoin('t_user', 't_user.id', '=', 't_share_effective_date.SHARE_EFFECTIVE_CREATED_BY')
            ->leftJoin('t_user as tu', 'tu.id', '=', 't_share_effective_date.SHARE_EFFECTIVE_UPDATED_BY')
            ->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_share_effective_date.JENIS_ASURANSI_ID')
            ->orderBy($sortColumn, $sortDirection)
            ->orderBy('SHARE_EFFECTIVE_CREATED', 'DESC')
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listShareEffective);
    }

    public function getDataEffectiveDate($eff_id)
    {
        $data = TShareEffectiveDate::where('SHARE_EFFECTIVE_DATE_ID', $eff_id)->get();

        return $data;
    }

    public function listOfPreviousShare(Request $request)
    {
        // getCurrentEffectiveDate
        $arrEffective = $this->getCurrentEffectiveDateAll();
        $idShareEffective = "";
        if (sizeof($arrEffective) >= 1) {
            $idShareEffective = $arrEffective[0]['SHARE_EFFECTIVE_DATE_ID'];
        }

        $arr_current_effective_date = $this->getDataEffectiveDate($idShareEffective);
        $share_effective_date = "";
        if (sizeof($arr_current_effective_date) >= 1) {
            $share_effective_date = $arr_current_effective_date[0]["SHARE_EFFECTIVE_DATE"];
        }

        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'SHARE_EFFECTIVE_DATE');
        $sortDirection = $request->input('sort_direction', 'DESC');
        $search = json_decode($request->input('search', ''));
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listShareEffective = TShareEffectiveDate::with('bankInsurance')->select(
            'SHARE_EFFECTIVE_DATE',
            'SHARE_EFFECTIVE_CREATED',
            'SHARE_EFFECTIVE_CREATED_DATE',
            'user_login',
            'SHARE_EFFECTIVE_UPDATED_BY',
            'SHARE_EFFECTIVE_UPDATED_DATE',
            'r_jenis_asuransi.JENIS_ASURANSI_ID',
            'r_jenis_asuransi.JENIS_ASURANSI_NAME',
            'SHARE_EFFECTIVE_DATE_ID'
        )->where('SHARE_EFFECTIVE_DATE', '<', $share_effective_date)->when($search, function ($query, $search) {
            return $query->where('JENIS_ASURANSI_ID', 'like', "%{$search}%");
        })

            ->leftJoin('t_user', 't_user.id', '=', 't_share_effective_date.SHARE_EFFECTIVE_CREATED_BY')
            ->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_share_effective_date.JENIS_ASURANSI_ID')
            ->orderBy($sortColumn, $sortDirection)
            ->orderBy('SHARE_EFFECTIVE_CREATED', 'DESC')
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listShareEffective);
    }

    public function editShareEffective(Request $request)
    {
        // dd($request);
        $validateData = Validator::make($request->all(), [
            'SHARE_EFFECTIVE_DATE'    => 'required',
            'JENIS_ASURANSI_ID'       => 'required'
        ], [
            'SHARE_EFFECTIVE_DATE'    => 'Effective Date is Required',
            'JENIS_ASURANSI_ID'       => 'Jenis Asuransi is Required'
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        // Cek jika share nya kosong
        $bankInsurance = is_countable($request->bank_insurance);
        $totalShare = 0;
        if ($bankInsurance) {
            for ($i = 0; $i < sizeof($request->bank_insurance); $i++) {
                $bankInsurance = $request->bank_insurance[$i];
                if (isset($bankInsurance['BANK_INSURANCE_SHARE'])) {
                    $totalShare += $bankInsurance['BANK_INSURANCE_SHARE'];
                }
            }
        }
        if ($totalShare === 0 || $totalShare > 100) {
            return new JsonResponse([
                'Total share is not 100% !',
                'share',
            ], 201, [
                'X-Inertia' => true
            ]);
        }

        $result = DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $createShareEffective = TShareEffectiveDate::where('SHARE_EFFECTIVE_DATE_ID', $request->SHARE_EFFECTIVE_DATE_ID)->update([
                "BANK_LIST_ID"                      => "1",
                "JENIS_ASURANSI_ID"                 => $request->JENIS_ASURANSI_ID,
                "SHARE_EFFECTIVE_DATE"              => $request->SHARE_EFFECTIVE_DATE,
                "SHARE_EFFECTIVE_CREATED"           => $date,
                "SHARE_EFFECTIVE_UPDATED_BY"        => $user_id,
                "SHARE_EFFECTIVE_UPDATED_DATE"      => $date
            ]);

            $bankInsurance = is_countable($request->bank_insurance);

            if ($bankInsurance) {
                for ($i = 0; $i < sizeof($request->bank_insurance); $i++) {
                    $bankInsurance = $request->bank_insurance[$i];

                    if (isset($bankInsurance['BANK_INSURANCE_SHARE'])) {
                        $updateShareEffective = TBankInsurance::where('BANK_INSURANCE_ID', $bankInsurance['BANK_INSURANCE_ID'])->update([
                            "BANK_LIST_ID"                        => "1",
                            "BANK_ADMIN_ID"                       => $user_id,
                            "INSURANCE_ID"                        => $bankInsurance['INSURANCE_ID'],
                            "BANK_INSURANCE_PIC"                  => isset($bankInsurance['BANK_INSURANCE_PIC']) ? $bankInsurance['BANK_INSURANCE_PIC'] : NULL,
                            "BANK_INSURANCE_EMAIL"                => isset($bankInsurance['BANK_INSURANCE_EMAIL']) ? $bankInsurance['BANK_INSURANCE_EMAIL'] : NULL,
                            "BANK_INSURANCE_MSISDN"               => isset($bankInsurance['BANK_INSURANCE_MSISDN']) ? $bankInsurance['BANK_INSURANCE_MSISDN'] : NULL,
                            "BANK_INSURANCE_ADDRESS"              => isset($bankInsurance['BANK_INSURANCE_ADDRESS']) ? $bankInsurance['BANK_INSURANCE_ADDRESS'] : NULL,
                            "BANK_INSURANCE_SHARE"                => isset($bankInsurance['BANK_INSURANCE_SHARE']) ? $bankInsurance['BANK_INSURANCE_SHARE'] : NULL,
                            "RATE_MANAGE_ID"                      => isset($bankInsurance['RATE_MANAGE_ID']) ? $bankInsurance['RATE_MANAGE_ID'] : NULL,
                            "BANK_INSURANCE_STATUS"               => "active",
                            "SHARE_EFFECTIVE_DATE_ID"             => $request->SHARE_EFFECTIVE_DATE_ID
                        ]);
                    }
                }
            }

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Updated (Share Effective Date)",
                    "module"      => "Share Effective Date",
                    "id"          => $request->SHARE_EFFECTIVE_DATE_ID
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'Share Effective Date Updated'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function deleteShareEffective(Request $request)
    {
        // Delete Effective date
        TShareEffectiveDate::where('SHARE_EFFECTIVE_DATE_ID', $request->idEffective)->delete();

        // delete Bank Insurance
        TBankInsurance::where('SHARE_EFFECTIVE_DATE_ID', $request->idEffective)->delete();

        $user = Auth::user();
        $user_id = $user->id;
        $date = now();

        UserLog::create([
            'created_by' => $user->id,
            'action'     => json_encode([
                "description" => "Deleted (Share Effective Date)",
                "module"      => "Share Effective Date",
                "id"          => $request->SHARE_EFFECTIVE_DATE_ID
            ]),
            'action_by'  => $user->user_login
        ]);

        return new JsonResponse([
            'Share Effective Date Deleted'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
