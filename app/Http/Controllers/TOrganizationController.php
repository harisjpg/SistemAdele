<?php

namespace App\Http\Controllers;

use App\Models\TOrganization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TOrganizationController extends Controller
{
    public function index()
    {
        return Inertia::render('Organization/index', []);
    }

    public function getOrganisasi(Request $request)
    {
        // Ambil query parameters
        $perPage = $request->input('per_page', 10);
        $sortColumn = $request->input('sort_column', 'ORGANIZATION_ID');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = json_decode($request->input('search', ''));

        // $status = $request->input('filter', null);  // Tambahkan status filter
        // dd($status);
        // if ($status === 'null') {
        //     $status = null;
        // }
        // Mulai query Bank List
        $listOrganization = TOrganization::when($search, function ($query, $search) {
            if ($search) {
                return $query->where('ORGANIZATION_NAME', 'like', "%{$search}%");
            }
        })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        // Return hasil pencarian
        return response()->json($listOrganization);
    }
}
