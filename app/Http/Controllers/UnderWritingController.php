<?php

namespace App\Http\Controllers;

use App\Models\TUnderWriting;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UnderWritingController extends Controller
{
    public function index()
    {
        return Inertia::render('MasterUnderWriting/index', []);
    }

    public function getUnderWriting(Request $request)
    {
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'UNDERWRITING_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));

        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listUnderWriting = TUnderWriting::when($search, function ($query, $search) {
            if ($search) {
                return $query->where('UNDERWRITING_NAME', 'like', "%{$search}%");
                // ->orWhere('THE_INSURED_ID_NUMBER', 'LIKE', '%' . $search . '%');
            }
        })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listUnderWriting);
    }

    public function addUnderWriting(Request $request)
    {
        // For Validation
        $validateData = Validator::make($request->all(), [
            'UNDERWRITING_NAME'                                => 'required',
        ], [
            'UNDERWRITING_NAME.required'                       => 'Nama Under Writing is required!',
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        // End For Validation

        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $UNDERWRITING_NAME           = $request->UNDERWRITING_NAME;

            $createUnderWriting = TUnderWriting::create([
                "UNDERWRITING_NAME"          => $UNDERWRITING_NAME,
                "UNDERWRITING_CREATED_BY"    => $user_id,
                "UNDERWRITING_CREATED_DATE"  => $date,
            ])->THE_INSURED_ID;

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Under Writing)",
                    "module"      => "Master Under Writing",
                    "id"          => $createUnderWriting
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'Created Master Under Writing Success'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function editUnderWriting(Request $request)
    {
        // For Validation
        $validateData = Validator::make($request->all(), [
            'UNDERWRITING_NAME'                                => 'required',
        ], [
            'UNDERWRITING_NAME.required'                       => 'Nama Under Writing is required!',
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        // End For Validation

        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $UNDERWRITING_NAME           = $request->UNDERWRITING_NAME;

            $createUnderWriting = TUnderWriting::where('UNDERWRITING_ID', $request->UNDERWRITING_ID)->update([
                "UNDERWRITING_NAME"          => $UNDERWRITING_NAME,
                "UNDERWRITING_CREATED_BY"    => $user_id,
                "UNDERWRITING_CREATED_DATE"  => $date,
            ]);

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Under Writing)",
                    "module"      => "Master Under Writing",
                    "id"          => $request->UNDERWRITING_ID
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'Update Master Under Writing Success'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
