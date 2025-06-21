<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\RWork;
use App\Models\TTheInsured;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MasterNasabahController extends Controller
{
    public function index()
    {
        return Inertia::render('MasterNasabah/index', []);
    }

    public function getNasabah(Request $request)
    {
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'THE_INSURED_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));

        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listNasabah = TTheInsured::when($search, function ($query, $search) {
            if ($search) {
                return $query->where('THE_INSURED_NAME', 'like', "%{$search}%")
                    ->orWhere('THE_INSURED_ID_NUMBER', 'LIKE', '%' . $search . '%');
            }
        })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listNasabah);
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

    public function addNasabah(Request $request)
    {

        // For Validation
        $validateData = Validator::make($request->all(), [
            'THE_INSURED_NAME'                              => 'required',
            'THE_INSURED_ID_NUMBER'                         => 'required|unique:t_theinsured,THE_INSURED_ID_NUMBER',
            'THE_INSURED_DATE_OF_BIRTH'                     => 'required',
            'THE_INSURED_GENDER'                            => 'required',
        ], [
            'THE_INSURED_NAME.required'                     => 'Nama Nasabah is required!',
            'THE_INSURED_ID_NUMBER.required'                => 'NIK Nasabah is required!',
            'THE_INSURED_ID_NUMBER.unique'                  => 'NIK Nasabah must be unique!',
            'THE_INSURED_DATE_OF_BIRTH.required'            => 'Tanggal Lahir is required!',
            'THE_INSURED_GENDER.required'                   => 'Gender is required!',
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        // End For Validation

        // For Db Store
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $THE_INSURED_NAME           = $request->THE_INSURED_NAME;
            $THE_INSURED_ID_NUMBER      = $request->THE_INSURED_ID_NUMBER;
            $THE_INSURED_DATE_OF_BIRTH  = $request->THE_INSURED_DATE_OF_BIRTH;
            $THE_INSURED_GENDER         = $request->THE_INSURED_GENDER['value'];
            $THE_INSURED_WORK           = $request->THE_INSURED_WORK['value'];
            $THE_INSURED_WORK_PLACE     = $request->THE_INSURED_WORK_PLACE;
            $THE_INSURED_LAMA_BEKERJA   = $request->THE_INSURED_LAMA_BEKERJA;
            $THE_INSURED_JABATAN        = $request->THE_INSURED_JABATAN;
            $THE_INSURED_CIF            = $request->THE_INSURED_CIF;
            $DOCUMENT_KTP_ID            = $request->file('DOCUMENT_KTP_ID');

            $createDebitur = TTheInsured::create([
                "THE_INSURED_NAME"          => $THE_INSURED_NAME,
                "THE_INSURED_ID_NUMBER"     => $THE_INSURED_ID_NUMBER,
                "THE_INSURED_DATE_OF_BIRTH" => $THE_INSURED_DATE_OF_BIRTH,
                "THE_INSURED_GENDER"        => $THE_INSURED_GENDER,
                "THE_INSURED_WORK"          => $THE_INSURED_WORK,
                "THE_INSURED_WORK_PLACE"    => $THE_INSURED_WORK_PLACE,
                "THE_INSURED_LAMA_BEKERJA"  => $THE_INSURED_LAMA_BEKERJA,
                "THE_INSURED_JABATAN"       => $THE_INSURED_JABATAN,
                "THE_INSURED_CIF"           => $THE_INSURED_CIF,
                "THE_INSURED_CREATED_BY"    => $user_id,
                "THE_INSURED_CREATED_DATE"  => $date,
            ])->THE_INSURED_ID;

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (The Insured)",
                    "module"      => "Master Nasabah",
                    "id"          => $createDebitur
                ]),
                'action_by'  => $user->user_login
            ]);

            if ($DOCUMENT_KTP_ID != null) {

                for ($i = 0; $i < sizeof($DOCUMENT_KTP_ID); $i++) {
                    $arrDocument = $DOCUMENT_KTP_ID;

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

                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Created (Dokumen KTP)",
                            "module"      => "Master Nasabah",
                            "id"          => $document
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }
            }
        });
        // end Db Store
        return new JsonResponse([
            'Created Master Nasabah Success'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function downloadKTP($idDocument)
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

    public function editNasabah(Request $request)
    {
        // For Validation
        $validateData = Validator::make($request->all(), [
            'THE_INSURED_NAME'                              => 'required',
            'THE_INSURED_ID_NUMBER'         => [
                'required',
                Rule::unique('t_theinsured', 'THE_INSURED_ID_NUMBER')->ignore($request->THE_INSURED_ID, 'THE_INSURED_ID')
            ],
            'THE_INSURED_DATE_OF_BIRTH'                     => 'required',
            'THE_INSURED_GENDER'                            => 'required',
        ], [
            'THE_INSURED_NAME.required'                     => 'Nama Nasabah is required!',
            'THE_INSURED_ID_NUMBER.required'                => 'NIK Nasabah is required!',
            'THE_INSURED_ID_NUMBER.unique'                  => 'NIK Nasabah must be unique!',
            'THE_INSURED_DATE_OF_BIRTH.required'            => 'Tanggal Lahir is required!',
            'THE_INSURED_GENDER.required'                   => 'Gender is required!',
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        // End For Validation

        // For Db Store
        $result = DB::transaction(function () use ($request) {
            // Data Auth
            $user = Auth::user();
            $user_id = $user->id;
            $date = now();

            $THE_INSURED_NAME           = $request->THE_INSURED_NAME;
            $THE_INSURED_ID_NUMBER      = $request->THE_INSURED_ID_NUMBER;
            $THE_INSURED_DATE_OF_BIRTH  = $request->THE_INSURED_DATE_OF_BIRTH;
            $THE_INSURED_GENDER         = $request->THE_INSURED_GENDER;
            $THE_INSURED_WORK           = $request->THE_INSURED_WORK;
            $THE_INSURED_WORK_PLACE     = $request->THE_INSURED_WORK_PLACE;
            $THE_INSURED_LAMA_BEKERJA   = $request->THE_INSURED_LAMA_BEKERJA;
            $THE_INSURED_JABATAN        = $request->THE_INSURED_JABATAN;
            $THE_INSURED_CIF            = $request->THE_INSURED_CIF;
            $DOCUMENT_KTP_ID            = $request->file('DOCUMENT_KTP_ID');

            $updateDebitur = TTheInsured::where('THE_INSURED_ID', $request->THE_INSURED_ID)->update([
                "THE_INSURED_NAME"          => $THE_INSURED_NAME,
                "THE_INSURED_ID_NUMBER"     => $THE_INSURED_ID_NUMBER,
                "THE_INSURED_DATE_OF_BIRTH" => $THE_INSURED_DATE_OF_BIRTH,
                "THE_INSURED_GENDER"        => $THE_INSURED_GENDER,
                "THE_INSURED_WORK"          => $THE_INSURED_WORK,
                "THE_INSURED_WORK_PLACE"    => $THE_INSURED_WORK_PLACE,
                "THE_INSURED_LAMA_BEKERJA"  => $THE_INSURED_LAMA_BEKERJA,
                "THE_INSURED_JABATAN"       => $THE_INSURED_JABATAN,
                "THE_INSURED_CIF"           => $THE_INSURED_CIF,
                "THE_INSURED_CREATED_BY"    => $user_id,
                "THE_INSURED_CREATED_DATE"  => $date,
            ]);

            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (The Insured)",
                    "module"      => "Master Nasabah",
                    "id"          => $request->THE_INSURED_ID
                ]),
                'action_by'  => $user->user_login
            ]);

            if ($DOCUMENT_KTP_ID != null) {

                for ($i = 0; $i < sizeof($DOCUMENT_KTP_ID); $i++) {
                    $arrDocument = $DOCUMENT_KTP_ID;

                    // create folder the insured
                    $parentDir = ((floor(($request->THE_INSURED_ID) / 1000)) * 1000) . '/';
                    $RateSettingId = $request->THE_INSURED_ID . '/';
                    $typeDir = "";
                    $uploadPath = 'document/DEBITUR/KTP/' . $parentDir . $RateSettingId . $typeDir;

                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentFileName = $request->THE_INSURED_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $arrDocument[$i]->getMimeType();
                    $documentFileSize = $arrDocument[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $arrDocument[$i], $request->THE_INSURED_ID . "-" . $this->RemoveSpecialChar($arrDocument[$i]->getClientOriginalName()));

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
                        TTheInsured::where('THE_INSURED_ID', $request->THE_INSURED_ID)
                            ->update([
                                'DOCUMENT_KTP_ID'    => $document
                            ]);
                    }

                    UserLog::create([
                        'created_by' => $user->id,
                        'action'     => json_encode([
                            "description" => "Created (Dokumen KTP)",
                            "module"      => "Master Nasabah",
                            "id"          => $document
                        ]),
                        'action_by'  => $user->user_login
                    ]);
                }
            }
        });
        // end Db Store
        return new JsonResponse([
            'Update Master Nasabah Success'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getDataWork(Request $request)
    {
        $arrData = RWork::get();

        return response()->json($arrData);
    }
}
