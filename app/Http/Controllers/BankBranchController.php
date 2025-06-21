<?php

namespace App\Http\Controllers;

use App\Models\BankBranch;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class BankBranchController extends Controller
{
    public function index()
    {
        // redirect
        return Inertia::render('BankBranch/BankBranch');
    }

    public function getBankBranchList(Request $request)
    {
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'BANK_BRANCH_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listBankBranch = BankBranch::when($search, function ($query, $search) {
            return $query->where('BANK_BRANCH_NAME', 'like', "%{$search}%")
                ->orWhere('BANK_BRANCH_CODE', 'LIKE', '%' . $search . '%')
                ->orWhere('BANK_BRANCH_NAME_AO', 'LIKE', '%' . $search . '%');
        })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listBankBranch);
    }

    public function getComboParentBranch()
    {
        $bankId = NULL;
        $data = DB::select('call sp_combo_bankbranch(?)', [$bankId]);
        return response()->json($data);
    }

    public function addBankBranch(Request $request)
    {
        // For Validation
        $validateData = Validator::make($request->all(), [
            'BANK_BRANCH_PARENT_ID'                         => 'required',
            'BANK_BRANCH_NAME'                              => 'required',
            'BANK_BRANCH_NAME_AO'                           => 'required',
            'KANWIL_ID'                                     => 'required',
            'BANK_BRANCH_CODE'                              => 'required',
        ], [
            'BANK_BRANCH_PARENT_ID.required'                => 'Branch Parent is required!',
            'BANK_BRANCH_NAME.required'                     => 'Branch Name is required!',
            'BANK_BRANCH_NAME_AO.unique'                    => 'Branch Name AO is required!',
            'KANWIL_ID.required'                            => 'Kanwil is required!',
            'BANK_BRANCH_CODE.required'                     => 'Branch Code is required!',
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        // End For Validation

        // dd($request);
        $bankParent             = $request->BANK_BRANCH_PARENT_ID['value'];
        $bankBranchName         = $request->BANK_BRANCH_NAME;
        $bankBranchNameAo       = $request->BANK_BRANCH_NAME_AO;
        $bankBranchCode         = $request->BANK_BRANCH_CODE;
        $bankBranchAddress      = $request->BANK_BRANCH_ADDRESS;
        $bankBranchPhone        = $request->BANK_BRANCH_PHONENUMBER;
        $bankBranchKanwil       = $request->BANK_BRANCH_KANWIL['value'];

        $bankBranch = BankBranch::create([
            "BANK_BRANCH_PARENT_ID"         => $bankParent,
            "BANK_BRANCH_NAME"              => $bankBranchName,
            "BANK_BRANCH_NAME_AO"           => $bankBranchNameAo,
            "BANK_BRANCH_CODE"              => $bankBranchCode,
            "BANK_BRANCH_ADDRESS"           => $bankBranchAddress,
            "BANK_BRANCH_PHONENUMBER"       => $bankBranchPhone,
            "BANK_BRANCH_CREATED_BY"        => Auth::user()->id,
            "BANK_BRANCH_CREATED_DATE"      => now(),
            "KANWIL_ID"                     => $bankBranchKanwil,
            "BANK_LIST_ID"                  => 1
        ]);

        $name = NULL;
        DB::select('call sp_set_mapping_bankbranch(?)', [$name]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Bank Branch).",
                "module"      => "Bank Branch",
                "id"          => $bankBranch->BANK_BRANCH_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'New Bank Branch Success Created '
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getKanwil(Request $request)
    {
        $data = DB::table('t_kanwil')->get();
        return response()->json($data);
    }

    public function editBankBranch(Request $request)
    {
        $bankParent         = $request->BANK_BRANCH_PARENT_ID;
        $bankBranchName     = $request->BANK_BRANCH_NAME;
        $bankBranchNameAo   = $request->BANK_BRANCH_NAME_AO;
        $bankBranchCode     = $request->BANK_BRANCH_CODE;
        $bankBranchAddress  = $request->BANK_BRANCH_ADDRESS;
        $bankBranchPhone    = $request->BANK_BRANCH_PHONENUMBER;
        $bankBranchKanwil   = $request->KANWIL_ID;

        $bankBranch = BankBranch::where('BANK_BRANCH_ID', $request->BANK_BRANCH_ID)->update([
            "BANK_BRANCH_PARENT_ID"     => $bankParent,
            "BANK_BRANCH_NAME"          => $bankBranchName,
            "BANK_BRANCH_NAME_AO"       => $bankBranchNameAo,
            "BANK_BRANCH_CODE"          => $bankBranchCode,
            "BANK_BRANCH_ADDRESS"       => $bankBranchAddress,
            "BANK_BRANCH_PHONENUMBER"   => $bankBranchPhone,
            "BANK_BRANCH_UPDATED_BY"    => Auth::user()->id,
            "BANK_BRANCH_UPDATED_DATE"  => now(),
            "KANWIL_ID"                 => $bankBranchKanwil,
            "BANK_LIST_ID"              => 1
        ]);

        $name = NULL;
        DB::select('call sp_set_mapping_bankbranch(?)', [$name]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Updated (Bank Branch).",
                "module"      => "Bank Branch",
                "id"          => $request->BANK_BRANCH_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'Bank Branch Success Updated '
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
