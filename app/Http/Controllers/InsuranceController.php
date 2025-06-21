<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Insurance;
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

class InsuranceController extends Controller
{
    public function index()
    {
        // get combo insurance parent
        $insurance_id = NULL;
        $data = DB::select('call sp_combo_insurance(?)', [$insurance_id]);
        // get combo underwriting
        $dataUnderwriting = TUnderWriting::get();
        // redirect
        return Inertia::render('InsuranceList/InsuranceList', [
            'comboInsurance' => $data,
            'comboUnderwriting' => $dataUnderwriting
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

    public function getInsuranceList(Request $request)
    { // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'INSURANCE_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Insurance List
        $listInsurance = Insurance::when($search, function ($query, $search) {
            return $query->where('INSURANCE_NAME', 'like', "%{$search}%")
                ->orWhere('JENIS_ASURANSI_NAME', 'like', "%{$search}%");
        })
            ->leftJoin('r_jenis_asuransi', 'r_jenis_asuransi.JENIS_ASURANSI_ID', '=', 't_insurance.INSURANCE_TYPE_ID')
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listInsurance);
    }

    public function addInsuranceList(Request $request)
    {
        $insuranceName        = $request->INSURANCE_NAME;
        $insuranceCode        = $request->INSURANCE_CODE;
        $insuranceSlug        = Str::slug($insuranceName);
        $insuranceLogo        = $request->file('INSURANCE_LOGO');

        $insuranceList = Insurance::create([
            "INSURANCE_NAME"            => $insuranceName,
            "INSURANCE_TYPE_ID"         => $request->INSURANCE_TYPE_ID['value'],
            "PRODUK_ASURANSI_ID"        => $request->PRODUK_ASURANSI_ID['value'],
            "INSURANCE_PARENT_ID"       => $request->INSURANCE_PARENT_ID === null ? NULL : $request->INSURANCE_PARENT_ID['value'],
            "UNDERWRITING_ID"           => $request->UNDERWRITING_ID['value'],
            "INSURANCE_CODE"            => $insuranceCode,
            "INSURANCE_SLUG"            => $insuranceSlug,
            "INSURANCE_CREATED_BY"      => Auth::user()->id,
            "INSURANCE_CREATED_DATE"    => now(),
            // "Insurance_LIST_LOGO"            =>
        ]);

        // create mapping insurance
        $name = NULL;
        DB::select('call sp_set_mapping_insurance(?)', [$name]);

        for ($i = 0; $i < sizeof($insuranceLogo); $i++) {

            // Create Folder For Insurance Document
            $parentDir = ((floor(($insuranceList->INSURANCE_ID) / 1000)) * 1000) . '/';
            $insuranceID = $insuranceList->INSURANCE_ID . '/';
            $typeDir = "";
            $uploadPath = 'document/INSURANCE/LOGO' . $parentDir . $insuranceID . $typeDir;


            // get Data Document
            $documentOriginalName = $this->RemoveSpecialChar($insuranceLogo[$i]->getClientOriginalName());
            $documentFileName = $insuranceList->INSURANCE_ID . "-" . $this->RemoveSpecialChar($insuranceLogo[$i]->getClientOriginalName());
            $documentDirName = $uploadPath;
            $documentFileType = $insuranceLogo[$i]->getMimeType();
            $documentFileSize = $insuranceLogo[$i]->getSize();

            // create folder in directory laravel
            Storage::makeDirectory($uploadPath, 0777, true, true);
            Storage::disk('public')->putFileAs($uploadPath, $insuranceLogo[$i], $insuranceList->INSURANCE_ID . "-" . $this->RemoveSpecialChar($insuranceLogo[$i]->getClientOriginalName()));

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
                Insurance::where('INSURANCE_ID', $insuranceList->INSURANCE_ID)
                    ->update([
                        'INSURANCE_LOGO'    => $document
                    ]);
            }
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Insurance List).",
                "module"      => "Insurance List",
                "id"          => $insuranceList->INSURANCE_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'New Insurance List Success Created '
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getComboParentInsurance()
    {
        $insurance_id = NULL;
        $data = DB::select('call sp_combo_insurance(?)', [$insurance_id]);
        return response()->json($data);
    }

    public function editInsuranceList(Request $request)
    {
        $insuranceName   = $request->INSURANCE_NAME;
        $insuranceCode   = $request->INSURANCE_CODE;
        $insuranceSlug   = Str::slug($insuranceName);
        $insuranceLogo   = $request->file('INSURANCE_LOGO');

        $insuranceList = Insurance::where('INSURANCE_ID', $request->INSURANCE_ID)
            ->update([
                "INSURANCE_NAME"            => $insuranceName,
                "INSURANCE_TYPE_ID"         => $request->INSURANCE_TYPE_ID,
                "PRODUK_ASURANSI_ID"        => $request->PRODUK_ASURANSI_ID,
                "INSURANCE_PARENT_ID"       => $request->INSURANCE_PARENT_ID === null ? NULL : $request->INSURANCE_PARENT_ID,
                "UNDERWRITING_ID"           => $request->UNDERWRITING_ID,
                "INSURANCE_CODE"            => $insuranceCode,
                "INSURANCE_SLUG"            => $insuranceSlug,
                "INSURANCE_UPDATED_BY"      => Auth::user()->id,
                "INSURANCE_UPDATED_DATE"    => now(),
            ]);

        // create mapping insurance
        $name = NULL;
        DB::select('call sp_set_mapping_insurance(?)', [$name]);

        // add Logo Insurance
        if ($insuranceLogo !== null) {
            for ($i = 0; $i < sizeof($insuranceLogo); $i++) {

                // Create Folder For Insurance Document
                $parentDir = ((floor(($request->INSURANCE_ID) / 1000)) * 1000) . '/';
                $insuranceID = $request->INSURANCE_ID . '/';
                $typeDir = "";
                $uploadPath = 'document/INSURANCE/LOGO' . $parentDir . $insuranceID . $typeDir;


                // get Data Document
                $documentOriginalName = $this->RemoveSpecialChar($insuranceLogo[$i]->getClientOriginalName());
                $documentFileName = $request->INSURANCE_ID . "-" . $this->RemoveSpecialChar($insuranceLogo[$i]->getClientOriginalName());
                $documentDirName = $uploadPath;
                $documentFileType = $insuranceLogo[$i]->getMimeType();
                $documentFileSize = $insuranceLogo[$i]->getSize();

                // create folder in directory laravel
                Storage::makeDirectory($uploadPath, 0777, true, true);
                Storage::disk('public')->putFileAs($uploadPath, $insuranceLogo[$i], $request->INSURANCE_ID . "-" . $this->RemoveSpecialChar($insuranceLogo[$i]->getClientOriginalName()));

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
                    Insurance::where('INSURANCE_ID', $request->INSURANCE_ID)
                        ->update([
                            'INSURANCE_LOGO'    => $document
                        ]);
                }
            }
        }


        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Updated (Insurance List).",
                "module"      => "Insurance List",
                "id"          => $request->INSURANCE_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'Insurance List Success Updated '
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getProdukAsuransi(Request $request)
    {
        $data = TProdukAsuransi::get();

        return response()->json($data);
    }
}
