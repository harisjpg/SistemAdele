<?php

namespace App\Http\Controllers;

use App\Models\TMekanismeProdukAsuransi;
use App\Models\TProdukAsuransi;
use App\Models\TUnderWriting;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index()
    {
        // get combo underwriting
        $dataUnderwriting = TUnderWriting::get();

        return Inertia::render('Produk/index', [
            "comboUnderwriting" => $dataUnderwriting
        ]);
    }

    public function getProdukAsuransi(Request $request)
    {
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'PRODUK_ASURANSI_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));

        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listProdukAsuransi = TProdukAsuransi::with('data_mekanisme_produk')->when($search, function ($query, $search) {
            if ($search) {
                return $query->where('PRODUK_ASURANSI_NAME', 'like', "%{$search}%");
                // ->orWhere('THE_INSURED_ID_NUMBER', 'LIKE', '%' . $search . '%');
            }
        })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listProdukAsuransi);
    }

    public function addProduk(Request $request)
    {
        // // For Validation
        // $validateData = Validator::make($request->all(), [
        //     'THE_INSURED_NAME'                              => 'required',
        //     'THE_INSURED_ID_NUMBER'                         => 'required|unique:t_theinsured,THE_INSURED_ID_NUMBER',
        //     'THE_INSURED_DATE_OF_BIRTH'                     => 'required',
        //     'THE_INSURED_GENDER'                            => 'required',
        // ], [
        //     'THE_INSURED_NAME.required'                     => 'Nama Nasabah is required!',
        //     'THE_INSURED_ID_NUMBER.required'                => 'NIK Nasabah is required!',
        //     'THE_INSURED_ID_NUMBER.unique'                  => 'NIK Nasabah must be unique!',
        //     'THE_INSURED_DATE_OF_BIRTH.required'            => 'Tanggal Lahir is required!',
        //     'THE_INSURED_GENDER.required'                   => 'Gender is required!',
        // ]);

        // if ($validateData->fails()) {
        //     return new JsonResponse([
        //         $validateData->errors()->all()
        //     ], 422, [
        //         'X-Inertia' => true
        //     ]);
        // }
        // // End For Validation
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $PRODUK_ASURANSI_NAME                = $request->PRODUK_ASURANSI_NAME;
            $UNDERWRITING_ID                     = $request->UNDERWRITING_ID['value'];
            $DATA_MEKANISME_PRODUK               = $request->DATA_MEKANISME_PRODUK;

            // insert data into t_produk_asuransi
            $produkAsuransi = TProdukAsuransi::create([
                'PRODUK_ASURANSI_NAME'              => $PRODUK_ASURANSI_NAME,
                'UNDERWRITING_ID'                   => $UNDERWRITING_ID,
                'PRODUK_ASURANSI_CREATED_BY'        => $user_id,
                'PRODUK_ASURANSI_CREATED_DATE'      => $date,
            ]);

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Produk Asuransi)",
                    "module"      => "Produk Asuransi",
                    "id"          => $produkAsuransi->PRODUK_ASURANSI_ID
                ]),
                'action_by'  => $user->user_login
            ]);

            if ($produkAsuransi) {
                for ($i = 0; $i < count($DATA_MEKANISME_PRODUK); $i++) {
                    $PRODUK_ASURANSI_ID = $produkAsuransi->PRODUK_ASURANSI_ID;
                    $dataMekanisme = $DATA_MEKANISME_PRODUK[$i];

                    // insert data into t_produk_asuransi_mekanisme
                    $dataMekanismeAsuransi = TMekanismeProdukAsuransi::create([
                        'PRODUK_ASURANSI_ID'                            => $PRODUK_ASURANSI_ID,
                        'MEKANISME_PRODUK_ASURANSI_JAMINAN'             => $dataMekanisme['JAMINAN_ASURANSI'],
                        'MEKANISME_PRODUK_ASURANSI_GANTI_RUGI'          => $dataMekanisme['MAX_GANTI_RUGI'],
                        'MEKANISME_PRODUK_ASURANSI_FOR_GANTI_RUGI'      => $dataMekanisme['MAX_GANTI_RUGI_CHOOSE']['value'],
                        'MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI'    => $dataMekanisme['LIMIT_GANTI_RUGI'],
                        'MEKANISME_PRODUK_ASURANSI_KAPASITAS'           => $dataMekanisme['KAPASITAS'],
                        "MEKANISME_PRODUK_ASURANSI_CREATED_BY"          => $user_id,
                        "MEKANISME_PRODUK_ASURANSI_CREATED_DATE"        => $date,
                    ]);

                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Created (Mekanisme Produk Asuransi)",
                            "module"      => "Produk Asuransi",
                            "id"          => $dataMekanismeAsuransi->MEKANISME_PRODUK_ASURANSI_ID
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }
            }
        });

        return new JsonResponse([
            'Produk Asuransi Successfully Created',
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function editProduk(Request $request)
    {
        // // For Validation
        // $validateData = Validator::make($request->all(), [
        //     'THE_INSURED_NAME'                              => 'required',
        //     'THE_INSURED_ID_NUMBER'                         => 'required|unique:t_theinsured,THE_INSURED_ID_NUMBER',
        //     'THE_INSURED_DATE_OF_BIRTH'                     => 'required',
        //     'THE_INSURED_GENDER'                            => 'required',
        // ], [
        //     'THE_INSURED_NAME.required'                     => 'Nama Nasabah is required!',
        //     'THE_INSURED_ID_NUMBER.required'                => 'NIK Nasabah is required!',
        //     'THE_INSURED_ID_NUMBER.unique'                  => 'NIK Nasabah must be unique!',
        //     'THE_INSURED_DATE_OF_BIRTH.required'            => 'Tanggal Lahir is required!',
        //     'THE_INSURED_GENDER.required'                   => 'Gender is required!',
        // ]);

        // if ($validateData->fails()) {
        //     return new JsonResponse([
        //         $validateData->errors()->all()
        //     ], 422, [
        //         'X-Inertia' => true
        //     ]);
        // }
        // // End For Validation
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $PRODUK_ASURANSI_NAME                = $request->PRODUK_ASURANSI_NAME;
            $DATA_MEKANISME_PRODUK               = $request->DATA_MEKANISME_PRODUK;

            // insert data into t_produk_asuransi
            $produkAsuransi = TProdukAsuransi::where('PRODUK_ASURANSI_ID', $request->PRODUK_ASURANSI_ID)->update([
                'PRODUK_ASURANSI_NAME'              => $PRODUK_ASURANSI_NAME,
                'PRODUK_ASURANSI_CREATED_BY'        => $user_id,
                'PRODUK_ASURANSI_CREATED_DATE'      => $date,
            ]);

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Updated (Produk Asuransi)",
                    "module"      => "Produk Asuransi",
                    "id"          => $request->PRODUK_ASURANSI_ID
                ]),
                'action_by'  => $user->user_login
            ]);

            if ($produkAsuransi) {
                // delete existing mekanisme produk asuransi
                TMekanismeProdukAsuransi::where('PRODUK_ASURANSI_ID', $request->PRODUK_ASURANSI_ID)
                    ->delete();
                // insert new mekanisme produk asuransi
                for ($i = 0; $i < count($DATA_MEKANISME_PRODUK); $i++) {
                    $PRODUK_ASURANSI_ID = $request->PRODUK_ASURANSI_ID;
                    $dataMekanisme = $DATA_MEKANISME_PRODUK[$i];



                    // insert data into t_produk_asuransi_mekanisme
                    $dataMekanismeAsuransi = TMekanismeProdukAsuransi::create([
                        'PRODUK_ASURANSI_ID'                            => $PRODUK_ASURANSI_ID,
                        'MEKANISME_PRODUK_ASURANSI_JAMINAN'             => $dataMekanisme['MEKANISME_PRODUK_ASURANSI_JAMINAN'],
                        'MEKANISME_PRODUK_ASURANSI_GANTI_RUGI'          => $dataMekanisme['MEKANISME_PRODUK_ASURANSI_GANTI_RUGI'],
                        'MEKANISME_PRODUK_ASURANSI_FOR_GANTI_RUGI'      => $dataMekanisme['MEKANISME_PRODUK_ASURANSI_FOR_GANTI_RUGI'],
                        'MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI'    => $dataMekanisme['MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI'],
                        'MEKANISME_PRODUK_ASURANSI_KAPASITAS'           => $dataMekanisme['MEKANISME_PRODUK_ASURANSI_KAPASITAS'],
                        "MEKANISME_PRODUK_ASURANSI_CREATED_BY"          => $user_id,
                        "MEKANISME_PRODUK_ASURANSI_CREATED_DATE"        => $date,
                    ]);

                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Update (Mekanisme Produk Asuransi)",
                            "module"      => "Produk Asuransi",
                            "id"          => $dataMekanismeAsuransi->MEKANISME_PRODUK_ASURANSI_ID
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }
            }
        });

        return new JsonResponse([
            'Produk Asuransi Successfully Updated',
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
