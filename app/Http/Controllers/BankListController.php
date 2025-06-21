<?php

namespace App\Http\Controllers;

use App\Models\BankList;
use App\Models\Document;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BankListController extends Controller
{
    public function index()
    {
        // redirect
        return Inertia::render('BankList/BankList');
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

    public function getBankList(Request $request)
    {
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'BANK_LIST_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));
        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listBank = BankList::when($search, function ($query, $search) {
            if ($search->BANK_LIST_NAME != "") {
                return $query->where('BANK_LIST_NAME', 'like', "%{$search->BANK_LIST_NAME}%");
            }
        })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listBank);
    }

    public function addBankList(Request $request)
    {
        $bankName   = $request->BANK_LIST_NAME;
        $bankFee    = $request->BANK_LIST_FEE_BASE_BANK;
        $bankSlug   = Str::slug($bankName);
        $bankLogo   = $request->file('BANK_LIST_LOGO');

        $bankList = BankList::create([
            "BANK_LIST_NAME"            => $bankName,
            "BANK_LIST_FEE_BASE_BANK"   => $bankFee,
            "BANK_LIST_SLUG"            => $bankSlug,
            "BANK_LIST_CREATED_BY"      => Auth::user()->id,
            "BANK_LIST_CREATED_DATE"    => now(),
            // "BANK_LIST_LOGO"            =>
        ]);

        // add Logo BANK
        for ($i = 0; $i < sizeof($bankLogo); $i++) {

            // Create Folder For Bank Document
            $parentDir = ((floor(($bankList->BANK_LIST_ID) / 1000)) * 1000) . '/';
            $BankID = $bankList->BANK_LIST_ID . '/';
            $typeDir = "";
            $uploadPath = 'images/' . $parentDir . $BankID . $typeDir;


            // get Data Document
            $documentOriginalName = $this->RemoveSpecialChar($bankLogo[$i]->getClientOriginalName());
            $documentFileName = $bankList->BANK_LIST_ID . "-" . $this->RemoveSpecialChar($bankLogo[$i]->getClientOriginalName());
            $documentDirName = $uploadPath;
            $documentFileType = $bankLogo[$i]->getMimeType();
            $documentFileSize = $bankLogo[$i]->getSize();

            // create folder in directory laravel
            Storage::makeDirectory($uploadPath, 0777, true, true);
            Storage::disk('public')->putFileAs($uploadPath, $bankLogo[$i], $bankList->BANK_LIST_ID . "-" . $this->RemoveSpecialChar($bankLogo[$i]->getClientOriginalName()));

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
                BankList::where('BANK_LIST_ID', $bankList->BANK_LIST_ID)
                    ->update([
                        'BANK_LIST_DOCUMENT_ID'    => $document
                    ]);
            }
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Bank List).",
                "module"      => "Bank List",
                "id"          => $bankList->BANK_LIST_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'New Bank List Success Created '
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function editBankList(Request $request)
    {
        $bankName   = $request->BANK_LIST_NAME;
        $bankFee    = $request->BANK_LIST_FEE_BASE_BANK;
        $bankSlug   = Str::slug($bankName);
        $bankLogo   = $request->file('BANK_LIST_LOGO');

        $bankList = BankList::where('BANK_LIST_ID', $request->BANK_LIST_ID)
            ->update([
                "BANK_LIST_NAME"            => $bankName,
                "BANK_LIST_FEE_BASE_BANK"   => $bankFee,
                "BANK_LIST_SLUG"            => $bankSlug,
                "BANK_LIST_UPDATED_BY"      => Auth::user()->id,
                "BANK_LIST_UPDATED_DATE"    => now(),
            ]);

        // add Logo BANK
        if ($bankLogo !== null) {
            for ($i = 0; $i < sizeof($bankLogo); $i++) {

                // Create Folder For Bank Document
                $parentDir = ((floor(($request->BANK_LIST_ID) / 1000)) * 1000) . '/';
                $BankID = $request->BANK_LIST_ID . '/';
                $typeDir = "";
                $uploadPath = 'images/' . $parentDir . $BankID . $typeDir;


                // get Data Document
                $documentOriginalName = $this->RemoveSpecialChar($bankLogo[$i]->getClientOriginalName());
                $documentFileName = $request->BANK_LIST_ID . "-" . $this->RemoveSpecialChar($bankLogo[$i]->getClientOriginalName());
                $documentDirName = $uploadPath;
                $documentFileType = $bankLogo[$i]->getMimeType();
                $documentFileSize = $bankLogo[$i]->getSize();

                // create folder in directory laravel
                Storage::makeDirectory($uploadPath, 0777, true, true);
                Storage::disk('public')->putFileAs($uploadPath, $bankLogo[$i], $request->BANK_LIST_ID . "-" . $this->RemoveSpecialChar($bankLogo[$i]->getClientOriginalName()));

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
                    BankList::where('BANK_LIST_ID', $request->BANK_LIST_ID)
                        ->update([
                            'BANK_LIST_DOCUMENT_ID'    => $document
                        ]);
                }
            }
        }


        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Updated (Bank List).",
                "module"      => "Bank List",
                "id"          => $request->BANK_LIST_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'Bank List Success Updated '
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
