<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\RateSetting;
use App\Models\TMekanismeProdukAsuransi;
use App\Models\TParameterProduk;
use App\Models\TProdukAsuransi;
use App\Models\TUnderWriting;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProdukController extends Controller
{
    public function index()
    {
        // get combo underwriting
        $dataUnderwriting = TUnderWriting::get();
        $dataParameterProduk = TParameterProduk::where('PARAMETER_PRODUK_IS_CATEGORY', 0)->get();
        $dataParameterCategory = TParameterProduk::where('PARAMETER_PRODUK_IS_CATEGORY', 1)->get();
        $dataRateManageId = RateSetting::get();

        return Inertia::render('Produk/index', [
            "comboUnderwriting" => $dataUnderwriting,
            "dataParameterProduk" => $dataParameterProduk,
            "dataParameterCategory" => $dataParameterCategory,
            "arrRateManageId"   => $dataRateManageId
        ]);
    }

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
            $UNDERWRITING_ID                     = isset($request->UNDERWRITING_ID['value']) ? $request->UNDERWRITING_ID['value'] : NULL;
            $DATA_MEKANISME_PRODUK               = $request->DATA_MEKANISME_PRODUK;
            $fileUploadProduk                    = $request->file('UPLOAD_FILE_PRODUK');
            $RATE_MANAGE_ID                      = isset($request->RATE_MANAGE_ID['value']) ? $request->RATE_MANAGE_ID['value'] : NULL;

            // insert data into t_produk_asuransi
            $produkAsuransi = TProdukAsuransi::create([
                'PRODUK_ASURANSI_NAME'              => $PRODUK_ASURANSI_NAME,
                'UNDERWRITING_ID'                   => $UNDERWRITING_ID,
                "RATE_MANAGE_ID"                    => $RATE_MANAGE_ID,
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
                        'PARAMETER_PRODUK_ID'                           => $dataMekanisme['PARAMETER_PRODUK_ID']['value'],
                        'PARAMETER_CATEGORY_ID'                         => isset($dataMekanisme['PARAMETER_CATEGORY_ID']['value']) ? $dataMekanisme['PARAMETER_CATEGORY_ID']['value'] : NULL,
                        "MEKANISME_PRODUK_ASURANSI_CREATED_BY"          => $user_id,
                        "MEKANISME_PRODUK_ASURANSI_CREATED_DATE"        => $date
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

            // for upload document
            if (is_countable($fileUploadProduk)) {
                for ($i = 0; $i < count($fileUploadProduk); $i++) {

                    // Create Folder For Insurance Document
                    $parentDir = ((floor(($produkAsuransi->PRODUK_ASURANSI_ID) / 1000)) * 1000) . '/';
                    $insuranceID = $produkAsuransi->PRODUK_ASURANSI_ID . '/';
                    $typeDir = "";
                    $uploadPath = 'document/PRODUCT/DOCUMENT_PRODUCT/' . $parentDir . $insuranceID . $typeDir;


                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($fileUploadProduk[$i]->getClientOriginalName());
                    $documentFileName = $produkAsuransi->PRODUK_ASURANSI_ID . "-" . $this->RemoveSpecialChar($fileUploadProduk[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $fileUploadProduk[$i]->getMimeType();
                    $documentFileSize = $fileUploadProduk[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $fileUploadProduk[$i], $produkAsuransi->PRODUK_ASURANSI_ID . "-" . $this->RemoveSpecialChar($fileUploadProduk[$i]->getClientOriginalName()));

                    // masukan data file ke database
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                        'DOCUMENT_FILENAME'             => $documentFileName,
                        'DOCUMENT_DIRNAME'              => $documentDirName,
                        'DOCUMENT_FILETYPE'             => $documentFileType,
                        'DOCUMENT_FILESIZE'             => $documentFileSize,
                        'DOCUMENT_CREATED_BY'           => Auth::user()->id
                    ])->DOCUMENT_ID;

                    if ($document) {
                        TProdukAsuransi::where('PRODUK_ASURANSI_ID', $produkAsuransi->PRODUK_ASURANSI_ID)
                            ->update([
                                'PRODUK_ASURANSI_DOCUMENT_ID'    => $document
                            ]);
                    }
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
            $UNDERWRITING_ID                     = isset($request->UNDERWRITING_ID) ? $request->UNDERWRITING_ID : NULL;
            $fileUploadProduk                    = $request->file('UPLOAD_FILE_PRODUK');

            // insert data into t_produk_asuransi
            $produkAsuransi = TProdukAsuransi::where('PRODUK_ASURANSI_ID', $request->PRODUK_ASURANSI_ID)->update([
                'PRODUK_ASURANSI_NAME'              => $PRODUK_ASURANSI_NAME,
                'UNDERWRITING_ID'                   => $UNDERWRITING_ID,
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
                        'PARAMETER_PRODUK_ID'                           => $dataMekanisme['PARAMETER_PRODUK_ID'],
                        'PARAMETER_CATEGORY_ID'                         => isset($dataMekanisme['PARAMETER_CATEGORY_ID']) ? $dataMekanisme['PARAMETER_CATEGORY_ID'] : NULL,
                        "MEKANISME_PRODUK_ASURANSI_CREATED_BY"          => $user_id,
                        "MEKANISME_PRODUK_ASURANSI_CREATED_DATE"        => $date
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

            if (is_countable($fileUploadProduk)) {
                for ($i = 0; $i < sizeof($fileUploadProduk); $i++) {

                    // Create Folder For Insurance Document
                    $parentDir = ((floor(($request->PRODUK_ASURANSI_ID) / 1000)) * 1000) . '/';
                    $insuranceID = $request->PRODUK_ASURANSI_ID . '/';
                    $typeDir = "";
                    $uploadPath = 'document/PRODUCT/DOCUMENT_PRODUCT/' . $parentDir . $insuranceID . $typeDir;


                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($fileUploadProduk[$i]->getClientOriginalName());
                    $documentFileName = $request->PRODUK_ASURANSI_ID . "-" . $this->RemoveSpecialChar($fileUploadProduk[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $fileUploadProduk[$i]->getMimeType();
                    $documentFileSize = $fileUploadProduk[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $fileUploadProduk[$i], $request->PRODUK_ASURANSI_ID . "-" . $this->RemoveSpecialChar($fileUploadProduk[$i]->getClientOriginalName()));

                    // masukan data file ke database
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                        'DOCUMENT_FILENAME'             => $documentFileName,
                        'DOCUMENT_DIRNAME'              => $documentDirName,
                        'DOCUMENT_FILETYPE'             => $documentFileType,
                        'DOCUMENT_FILESIZE'             => $documentFileSize,
                        'DOCUMENT_CREATED_BY'           => Auth::user()->id
                    ])->DOCUMENT_ID;

                    if ($document) {
                        TProdukAsuransi::where('PRODUK_ASURANSI_ID', $request->PRODUK_ASURANSI_ID)
                            ->update([
                                'PRODUK_ASURANSI_DOCUMENT_ID'    => $document
                            ]);
                    }
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
