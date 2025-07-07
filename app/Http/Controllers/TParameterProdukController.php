<?php

namespace App\Http\Controllers;

use App\Models\TParameterProduk;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TParameterProdukController extends Controller
{
    public function index()
    {
        return Inertia::render('ParematerProduk/index', []);
    }

    public function addParameterProduk(Request $request)
    {

        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $PARAMETER_PRODUK_NAME          = $request->PARAMETER_PRODUK_NAME;
            $PARAMETER_PRODUK_BOBOT         = $request->PARAMETER_PRODUK_BOBOT;
            $PARAMETER_PRODUK_PARENT        = $request->PARAMETER_PRODUK_PARENT;
            $PARAMETER_PRODUK_IS_CATEGORY   = $request->PARAMETER_PRODUK_IS_CATEGORY === "1" ? $request->PARAMETER_PRODUK_IS_CATEGORY : 0;

            // proses tambah ke database t_paramater_produk
            $createParameterProduk = TParameterProduk::create([
                "PARAMETER_PRODUK_NAME"             => $PARAMETER_PRODUK_NAME,
                "PARAMETER_PRODUK_IS_CATEGORY"      => $PARAMETER_PRODUK_IS_CATEGORY,
                "PARAMETER_PRODUK_BOBOT"            => $PARAMETER_PRODUK_BOBOT !== "" || $PARAMETER_PRODUK_BOBOT !== null ? $PARAMETER_PRODUK_BOBOT : NULL,
                "PARAMETER_PRODUK_PARENT"           => $PARAMETER_PRODUK_PARENT !== "" || $PARAMETER_PRODUK_PARENT !== null ? $PARAMETER_PRODUK_PARENT : NULL,
                "PARAMETER_PRODUK_CREATED_BY"       => $user_id,
                "PARAMETER_PRODUK_CREATED_DATE"     => $date
            ]);

            // create mapping insurance
            $name = NULL;
            DB::select('call sp_set_mapping_parameter_produk(?)', [$name]);

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created Parameter Produk",
                    "module"      => "Parameter Produk",
                    "id"          => $createParameterProduk->PARAMETER_PRODUK_ID
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        $category = "";
        if ($request->PARAMETER_PRODUK_IS_CATEGORY === "1") {
            $category = 'Pembuatan Category Parameter Produk Berhasil';
        } else {
            $category = 'Pembuatan Parameter Produk Berhasil';
        }

        return new JsonResponse([
            $category
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getDataParameterProduk(Request $request)
    {
        $arrData = TParameterProduk::whereNull('PARAMETER_PRODUK_PARENT')->get();


        return response()->json($arrData);
    }

    public function editParameterProduk(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $PARAMETER_PRODUK_NAME          = $request->PARAMETER_PRODUK_NAME;
            $PARAMETER_PRODUK_BOBOT         = $request->PARAMETER_PRODUK_BOBOT;
            $PARAMETER_PRODUK_PARENT        = $request->PARAMETER_PRODUK_PARENT;
            $PARAMETER_PRODUK_IS_CATEGORY   = $request->PARAMETER_PRODUK_IS_CATEGORY === "1" ? $request->PARAMETER_PRODUK_IS_CATEGORY : 0;

            // proses tambah ke database t_paramater_produk
            $createParameterProduk = TParameterProduk::where('PARAMETER_PRODUK_ID', $request->PARAMETER_PRODUK_ID)->update([
                "PARAMETER_PRODUK_NAME"             => $PARAMETER_PRODUK_NAME,
                "PARAMETER_PRODUK_IS_CATEGORY"      => $PARAMETER_PRODUK_IS_CATEGORY,
                "PARAMETER_PRODUK_BOBOT"            => $PARAMETER_PRODUK_BOBOT !== "" || $PARAMETER_PRODUK_BOBOT !== null ? $PARAMETER_PRODUK_BOBOT : NULL,
                "PARAMETER_PRODUK_PARENT"           => $PARAMETER_PRODUK_PARENT !== "" || $PARAMETER_PRODUK_PARENT !== null ? $PARAMETER_PRODUK_PARENT : NULL,
                "PARAMETER_PRODUK_UPDATED_BY"       => $user_id,
                "PARAMETER_PRODUK_UPDATED_DATE"     => $date
            ]);

            // create mapping insurance
            $name = NULL;
            DB::select('call sp_set_mapping_parameter_produk(?)', [$name]);

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Updated Parameter Produk",
                    "module"      => "Parameter Produk",
                    "id"          => $request->PARAMETER_PRODUK_ID
                ]),
                'action_by'  => $user->user_login
            ]);
        });


        return new JsonResponse([
            'Perubahan Parameter Produk Berhasil'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
