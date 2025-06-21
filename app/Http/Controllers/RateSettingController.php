<?php

namespace App\Http\Controllers;

use App\Exports\TemplateExport;
use App\Models\Document;
use App\Models\Insurance;
use App\Models\MRateInsurance;
use App\Models\RateDataSource;
use App\Models\RateSetting;
use App\Models\RateTemplate;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Exception;
use Illuminate\Support\Facades\DB;

class RateSettingController extends Controller
{
    public function index()
    {
        $dataInsurance = Insurance::get();
        // redirect
        return Inertia::render('RateSetting/RateSetting', [
            "dataInsurance"     => $dataInsurance
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

    public function addRateSetting(Request $request)
    {
        DB::transaction(function () use ($request) {
            $RATE_MANAGE_TYPE            = $request->RATE_MANAGE_TYPE['value'];
            $RATE_MANAGE_NAME            = $request->RATE_MANAGE_NAME;
            $documentRegular             = $request->file('RATE_MANAGE_TEMPLATE_DOCUMENT_ID');
            $insuranceList               = $request->INSURANCE_ID;
            $usingPayroll                = $request->USING_PAYROLL;

            // FOR REGULER
            if ($RATE_MANAGE_TYPE === 1 || $RATE_MANAGE_TYPE === "1") {
                $RateSetting = RateSetting::create([
                    "RATE_MANAGE_TYPE"            => $RATE_MANAGE_TYPE,
                    "RATE_MANAGE_NAME"            => $RATE_MANAGE_NAME,
                    "RATE_MANAGE_CREATED_BY"      => Auth::user()->id,
                    "RATE_MANAGE_CREATED_DATE"    => now(),
                    "USING_PAYROLL"               => $usingPayroll
                ]);

                for ($i = 0; $i < sizeof($insuranceList); $i++) {
                    MRateInsurance::create([
                        "RATE_MANAGE_ID"    => $RateSetting->RATE_MANAGE_ID,
                        "INSURANCE_ID"      => $insuranceList[$i]['value']
                    ]);
                }

                if ($documentRegular !== null) {
                    for ($i = 0; $i < sizeof($documentRegular); $i++) {

                        // Create Folder For Bank Document
                        $parentDir = ((floor(($RateSetting->RATE_MANAGE_ID) / 1000)) * 1000) . '/';
                        $RateSettingId = $RateSetting->RATE_MANAGE_ID . '/';
                        $typeDir = "";
                        $uploadPath = 'document/RATE/DOCUMENT_RATE/' . $parentDir . $RateSettingId . $typeDir;


                        // get Data Document
                        $documentOriginalName = $this->RemoveSpecialChar($documentRegular[$i]->getClientOriginalName());
                        $documentFileName = $RateSetting->RATE_MANAGE_ID . "-" . $this->RemoveSpecialChar($documentRegular[$i]->getClientOriginalName());
                        $documentDirName = $uploadPath;
                        $documentFileType = $documentRegular[$i]->getMimeType();
                        $documentFileSize = $documentRegular[$i]->getSize();

                        // create folder in directory laravel
                        Storage::makeDirectory($uploadPath, 0777, true, true);
                        Storage::disk('public')->putFileAs($uploadPath, $documentRegular[$i], $RateSetting->RATE_MANAGE_ID . "-" . $this->RemoveSpecialChar($documentRegular[$i]->getClientOriginalName()));

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
                            RateSetting::where('RATE_MANAGE_ID', $RateSetting->RATE_MANAGE_ID)
                                ->update([
                                    'RATE_MANAGE_FIX_DOCUMENT_ID'    => $document
                                ]);
                        }
                    }
                }

                // Created Log
                UserLog::create([
                    "created_by" => Auth::user()->id,
                    "action"     => json_encode([
                        "description" => "Created (Template Rate Setting).",
                        "module"      => "Rate Setting",
                        "id"          =>  $RateSetting->RATE_MANAGE_ID,
                    ]),
                    'action_by'  => Auth::user()->user_login
                ]);

                return new JsonResponse([
                    "New Template Rate Setting Success Created"
                ], 201, [
                    'X-Inertia' => true
                ]);
            }

            // FOR NON REGULER
            if ($RATE_MANAGE_TYPE === 2 || $RATE_MANAGE_TYPE === "2") {
                $RateSetting = RateSetting::create([
                    "RATE_MANAGE_TYPE"            => $RATE_MANAGE_TYPE,
                    "RATE_MANAGE_NAME"            => $RATE_MANAGE_NAME,
                    "RATE_MANAGE_CREATED_BY"      => Auth::user()->id,
                    "RATE_MANAGE_CREATED_DATE"    => now(),
                ]);

                for ($i = 0; $i < sizeof($insuranceList); $i++) {
                    MRateInsurance::create([
                        "RATE_MANAGE_ID"    => $RateSetting->RATE_MANAGE_ID,
                        "INSURANCE_ID"      => $insuranceList[$i]['value']
                    ]);
                }

                for ($i = 0; $i < sizeof($request->TEMPLATE_RATE_COLUMN_NAME); $i++) {
                    $rateColumn = $request->TEMPLATE_RATE_COLUMN_NAME;

                    // for slug
                    $rateColumnName = $rateColumn[$i]['TEMPLATE_RATE_NAME'];
                    $strSlug = "clmn-" . Str::slug($rateColumnName);
                    RateTemplate::create([
                        "RATE_MANAGE_ID"                       => $RateSetting->RATE_MANAGE_ID,
                        "TEMPLATE_RATE_COLUMN_NAME"            => $rateColumn[$i]['TEMPLATE_RATE_NAME'],
                        "TEMPLATE_RATE_COLUMN_SLUG"            => $strSlug,
                        "IS_RATE"                              => 0
                    ]);
                }

                for ($i = 0; $i < sizeof($request->TEMPLATE_RATE_COLUMN); $i++) {
                    $rateColumn = $request->TEMPLATE_RATE_COLUMN;
                    $rateColumnRateName = $rateColumn[$i]['RATE_COLUMN'];
                    $strSlugRate = "clmn-" . Str::slug($rateColumnRateName);

                    RateTemplate::create([
                        "RATE_MANAGE_ID"                         => $RateSetting->RATE_MANAGE_ID,
                        "TEMPLATE_RATE_COLUMN_NAME"              => $rateColumn[$i]['RATE_COLUMN'],
                        "TEMPLATE_RATE_COLUMN_SLUG"              => $strSlugRate,
                        "IS_RATE"                                => 1
                    ]);
                }

                // for store data source
                for ($i = 0; $i < sizeof($request->TEMPLATE_RATE_COLUMN_NAME); $i++) {
                    $rateColumn = $request->TEMPLATE_RATE_COLUMN_NAME;

                    if (isset($rateColumn[$i]['TEMPLATE_RATE_DATA'])) {
                        RateDataSource::create([
                            "RATE_MANAGE_ID"                       => $RateSetting->RATE_MANAGE_ID,
                            "RATE_DATA_SOURCE_NAME"                => $rateColumn[$i]['TEMPLATE_RATE_DATA'],
                        ]);
                    }
                }

                // for excel generate template
                // Menyimpan file Excel di folder 'exports'
                $idRateSetting = $RateSetting->RATE_MANAGE_ID;
                $parentDir = ((floor(($RateSetting->RATE_MANAGE_ID) / 1000)) * 1000) . '/';
                $RateSettingId = $RateSetting->RATE_MANAGE_ID . '/';
                $typeDir = "";
                $uploadPath = 'document/RATE/TEMPLATE/' . $typeDir;

                $fileName = $idRateSetting . '-Template_Rate_Non_Regular.xlsx';
                // Storage::makeDirectory($uploadPath, 0777, true, true);
                try {
                    $filePath = Excel::store(new TemplateExport($idRateSetting), $uploadPath . $fileName, 'public');
                } catch (Exception $e) {
                    // Tangani error ekspor jika terjadi masalah
                    return response()->json(['error' => 'Export failed: ' . $e->getMessage()]);
                }


                // Mendapatkan path lengkap file yang disimpan
                $filePath = public_path('/storage/' . $uploadPath . $fileName);

                // get Data Document
                $documentOriginalName = $this->RemoveSpecialChar($fileName);
                $documentFileName = $this->RemoveSpecialChar($fileName);
                $documentDirName = $uploadPath;
                $documentFileType = mime_content_type($filePath);
                $documentFileSize = filesize($filePath);

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
                    RateSetting::where('RATE_MANAGE_ID', $RateSetting->RATE_MANAGE_ID)
                        ->update([
                            'RATE_MANAGE_TEMPLATE_DOCUMENT_ID'    => $document
                        ]);
                }
                // Created Log
                UserLog::create([
                    "created_by" => Auth::user()->id,
                    "action"     => json_encode([
                        "description" => "Created (Template Rate Setting).",
                        "module"      => "Rate Setting",
                        "id"          =>  $RateSetting->RATE_MANAGE_ID,
                    ]),
                    'action_by'  => Auth::user()->user_login
                ]);
            }
        });

        return new JsonResponse([
            "New Template Rate Setting Success Created"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function downloadTemplate($id)
    {

        // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
        if ($id == 1 || $id == "1") {
            $filePath = public_path('/template/Template_Rate_Reguler_Using_Payroll.xlsx');

            $headers = [
                'filename' => "Template_Rate_Reguler_Using_Payroll.xlsx"
            ];

            if (file_exists($filePath)) {
                return response()->download($filePath, "Template_Rate_Reguler_Using_Payroll.xlsx", $headers);
            } else {
                abort(404, 'File not found');
            }
        } else {
            $filePath = public_path('/template/Template_Rate_Reguler_Using_Payroll.xlsx');

            $headers = [
                'filename' => "Template_Rate_Reguler.xlsx"
            ];

            if (file_exists($filePath)) {
                return response()->download($filePath, "Template_Rate_Reguler.xlsx", $headers);
            } else {
                abort(404, 'File not found');
            }
        }
    }

    public function downloadRate($idDocument)
    {
        $detailDocument = Document::find($idDocument);
        // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
        $filePath = public_path('/storage/' . $detailDocument->DOCUMENT_DIRNAME . $detailDocument->DOCUMENT_FILENAME);

        $headers = [
            'filename' => $detailDocument->DOCUMENT_FILENAME
        ];

        if (file_exists($filePath)) {
            return response()->download($filePath, $detailDocument->DOCUMENT_FILENAME, $headers);
        } else {
            abort(404, 'File not found');
        }
    }

    public function getRateSetting(Request $request)
    {
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'RATE_MANAGE_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Rate Setting
        $listRateSetting = RateSetting::when($search, function ($query, $search) {
            return $query->where('RATE_MANAGE_NAME', 'like', "%{$search}%");
        })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listRateSetting);
    }

    public function editRateSetting(Request $request)
    {
        $rateType           = $request->RATE_MANAGE_TYPE;
        $rateName           = $request->RATE_MANAGE_NAME;
        $documentRegular    = $request->file('RATE_MANAGE_TEMPLATE_DOCUMENT_ID');
        $documentNonRegular = $request->file('RATE_MANAGE_FIX_DOCUMENT_ID');
        $usingPayroll       = $request->USING_PAYROLL;

        if ($rateType === 1 || $rateType === "1") {
            RateSetting::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)->update([
                "RATE_MANAGE_TYPE"            => $rateType,
                "RATE_MANAGE_NAME"            => $rateName,
                "RATE_MANAGE_UPDATED_BY"      => Auth::user()->id,
                "RATE_MANAGE_UPDATED_DATE"    => now(),
                "USING_PAYROLL"               => $usingPayroll
            ]);

            // Delete Data M Rate Setting
            MRateInsurance::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)->delete();

            for ($i = 0; $i < sizeof($request->insurance_rate); $i++) {
                if (!isset($request->insurance_rate[$i]["INSURANCE_ID"])) {
                    MRateInsurance::create([
                        "RATE_MANAGE_ID"                   => $request->RATE_MANAGE_ID,
                        "INSURANCE_ID"                     => $request->insurance_rate[$i]['value']
                    ]);
                } else {
                    MRateInsurance::create([
                        "RATE_MANAGE_ID"                   => $request->RATE_MANAGE_ID,
                        "INSURANCE_ID"                     => $request->insurance_rate[$i]['INSURANCE_ID']
                    ]);
                }
            }

            if ($documentRegular !== null) {
                for ($i = 0; $i < sizeof($documentRegular); $i++) {

                    // Create Folder For Bank Document
                    $parentDir = ((floor(($request->RATE_MANAGE_ID) / 1000)) * 1000) . '/';
                    $RateSettingId = $request->RATE_MANAGE_ID . '/';
                    $typeDir = "";
                    $uploadPath = 'document/RATE/DOCUMENT_RATE/' . $parentDir . $RateSettingId . $typeDir;


                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($documentRegular[$i]->getClientOriginalName());
                    $documentFileName = $request->RATE_MANAGE_ID . "-" . $this->RemoveSpecialChar($documentRegular[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $documentRegular[$i]->getMimeType();
                    $documentFileSize = $documentRegular[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $documentRegular[$i], $request->RATE_MANAGE_ID . "-" . $this->RemoveSpecialChar($documentRegular[$i]->getClientOriginalName()));

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
                        RateSetting::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)
                            ->update([
                                'RATE_MANAGE_FIX_DOCUMENT_ID'    => $document
                            ]);
                    }
                }
            }
        }

        if ($rateType === 2 || $rateType === "2") {

            if ($documentNonRegular !== null) {
                for ($i = 0; $i < sizeof($documentNonRegular); $i++) {

                    // Create Folder For Bank Document
                    $parentDir = ((floor(($request->RATE_MANAGE_ID) / 1000)) * 1000) . '/';
                    $RateSettingId = $request->RATE_MANAGE_ID . '/';
                    $typeDir = "";
                    $uploadPath = 'document/RATE/DOCUMENT_RATE/' . $parentDir . $RateSettingId . $typeDir;


                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($documentNonRegular[$i]->getClientOriginalName());
                    $documentFileName = $request->RATE_MANAGE_ID . "-" . $this->RemoveSpecialChar($documentNonRegular[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $documentNonRegular[$i]->getMimeType();
                    $documentFileSize = $documentNonRegular[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $documentNonRegular[$i], $request->RATE_MANAGE_ID . "-" . $this->RemoveSpecialChar($documentNonRegular[$i]->getClientOriginalName()));

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
                        RateSetting::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)
                            ->update([
                                'RATE_MANAGE_FIX_DOCUMENT_ID'    => $document
                            ]);
                    }
                }
            } else {
                RateSetting::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)->update([
                    "RATE_MANAGE_TYPE"            => $rateType,
                    "RATE_MANAGE_NAME"            => $rateName,
                    "RATE_MANAGE_UPDATED_BY"      => Auth::user()->id,
                    "RATE_MANAGE_UPDATED_DATE"    => now(),
                ]);


                MRateInsurance::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)->delete();

                for ($i = 0; $i < sizeof($request->insurance_rate); $i++) {
                    if (!isset($request->insurance_rate[$i]["INSURANCE_ID"])) {
                        MRateInsurance::create([
                            "RATE_MANAGE_ID"                   => $request->RATE_MANAGE_ID,
                            "INSURANCE_ID"                     => $request->insurance_rate[$i]['value']
                        ]);
                    } else {
                        MRateInsurance::create([
                            "RATE_MANAGE_ID"                   => $request->RATE_MANAGE_ID,
                            "INSURANCE_ID"                     => $request->insurance_rate[$i]['INSURANCE_ID']
                        ]);
                    }
                }


                // RateTemplate::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)->delete();
                RateTemplate::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)->delete();
                for ($i = 0; $i < sizeof($request->rate_template); $i++) {
                    $rateColumn = $request->rate_template;

                    // for slug
                    $rateColumnName = $rateColumn[$i]['TEMPLATE_RATE_COLUMN_NAME'];
                    $strSlug = "clmn-" . Str::slug($rateColumnName);

                    if ($rateColumn[$i]['IS_RATE'] === 0 || $rateColumn[$i]['IS_RATE'] === "0") {
                        RateTemplate::create([
                            "RATE_MANAGE_ID"                         => $request->RATE_MANAGE_ID,
                            "TEMPLATE_RATE_COLUMN_NAME"              => $rateColumn[$i]['TEMPLATE_RATE_COLUMN_NAME'],
                            "TEMPLATE_RATE_COLUMN_SLUG"              => $strSlug,
                            "IS_RATE"                                => $rateColumn[$i]['IS_RATE']
                        ]);
                    }
                }

                for ($i = 0; $i < sizeof($request->rate_template); $i++) {
                    $rateColumn = $request->rate_template;

                    // for slug
                    $rateColumnName = $rateColumn[$i]['TEMPLATE_RATE_COLUMN_NAME'];
                    $strSlug = "clmn-" . Str::slug($rateColumnName);
                    if ($rateColumn[$i]['IS_RATE'] === 1 || $rateColumn[$i]['IS_RATE'] === "1") {
                        RateTemplate::create([
                            "RATE_MANAGE_ID"                         => $request->RATE_MANAGE_ID,
                            "TEMPLATE_RATE_COLUMN_NAME"              => $rateColumn[$i]['TEMPLATE_RATE_COLUMN_NAME'],
                            "TEMPLATE_RATE_COLUMN_SLUG"              => $strSlug,
                            "IS_RATE"                                => $rateColumn[$i]['IS_RATE']
                        ]);
                    }
                }


                // for store data source
                RateDataSource::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)->delete();
                for ($i = 0; $i < sizeof($request->rate_data_source); $i++) {
                    $rateColumn = $request->rate_data_source;
                    RateDataSource::create([
                        "RATE_MANAGE_ID"                       => $request->RATE_MANAGE_ID,
                        "RATE_DATA_SOURCE_NAME"                => $rateColumn[$i]['RATE_DATA_SOURCE_NAME'],
                    ]);
                }

                // for excel generate template
                // Menyimpan file Excel di folder 'exports'
                $idRateSetting = $request->RATE_MANAGE_ID;
                $parentDir = ((floor(($request->RATE_MANAGE_ID) / 1000)) * 1000) . '/';
                $RateSettingId = $request->RATE_MANAGE_ID . '/';
                $typeDir = "";
                $uploadPath = 'document/RATE/TEMPLATE/' . $typeDir;

                $fileName = $idRateSetting . '-Template_Rate_Non_Regular.xlsx';
                // Storage::makeDirectory($uploadPath, 0777, true, true);
                try {
                    $filePath = Excel::store(new TemplateExport($idRateSetting), $uploadPath . $fileName, 'public');
                } catch (Exception $e) {
                    // Tangani error ekspor jika terjadi masalah
                    return response()->json(['error' => 'Export failed: ' . $e->getMessage()]);
                }


                // Mendapatkan path lengkap file yang disimpan
                $filePath = public_path('/storage/' . $uploadPath . $fileName);

                // get Data Document
                $documentOriginalName = $this->RemoveSpecialChar($fileName);
                $documentFileName = $this->RemoveSpecialChar($fileName);
                $documentDirName = $uploadPath;
                $documentFileType = mime_content_type($filePath);
                $documentFileSize = filesize($filePath);

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
                    RateSetting::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)
                        ->update([
                            'RATE_MANAGE_TEMPLATE_DOCUMENT_ID'    => $document
                        ]);
                }

                if ($documentNonRegular !== null) {
                    for ($i = 0; $i < sizeof($documentNonRegular); $i++) {

                        // Create Folder For Bank Document
                        $parentDir = ((floor(($request->RATE_MANAGE_ID) / 1000)) * 1000) . '/';
                        $RateSettingId = $request->RATE_MANAGE_ID . '/';
                        $typeDir = "";
                        $uploadPath = 'document/RATE/DOCUMENT_RATE/' . $parentDir . $RateSettingId . $typeDir;


                        // get Data Document
                        $documentOriginalName = $this->RemoveSpecialChar($documentNonRegular[$i]->getClientOriginalName());
                        $documentFileName = $request->RATE_MANAGE_ID . "-" . $this->RemoveSpecialChar($documentNonRegular[$i]->getClientOriginalName());
                        $documentDirName = $uploadPath;
                        $documentFileType = $documentNonRegular[$i]->getMimeType();
                        $documentFileSize = $documentNonRegular[$i]->getSize();

                        // create folder in directory laravel
                        Storage::makeDirectory($uploadPath, 0777, true, true);
                        Storage::disk('public')->putFileAs($uploadPath, $documentNonRegular[$i], $request->RATE_MANAGE_ID . "-" . $this->RemoveSpecialChar($documentNonRegular[$i]->getClientOriginalName()));

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
                            RateSetting::where('RATE_MANAGE_ID', $request->RATE_MANAGE_ID)
                                ->update([
                                    'RATE_MANAGE_FIX_DOCUMENT_ID'    => $document
                                ]);
                        }
                    }
                }
            }
        }

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Updated (Template Rate Setting).",
                "module"      => "Rate Setting",
                "id"          =>  $request->RATE_MANAGE_ID,
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            "Updated Rate Setting Success Created"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getMRateInsurance(Request $request)
    {
        $data = MRateInsurance::get();

        return response()->json($data);
    }
}
