<?php

namespace App\Http\Controllers;

use App\Models\SettingPage;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingPageController extends Controller
{
    public function settingColor(Request $request)
    {
        $nameColorHeksa = $request->SETTING_PAGE_COLOR;

        // delete setting color
        SettingPage::truncate();

        $pageSetting = SettingPage::create([
            "SETTING_PAGE_COLOR"            => $nameColorHeksa,
            "SETTING_PAGE_CREATED_BY"       => Auth::user()->id,
            "SETTING_PAGE_CREATED_DATE"     => now()
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Page Setting Color).",
                "module"      => "Page Setting Color",
                "id"          => $pageSetting->id
            ]),
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            'New role added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
