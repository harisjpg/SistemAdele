<?php

namespace App\Http\Controllers;

use App\Models\Insurance;
use App\Models\MRoleUser;
use App\Models\Role;
use App\Models\RUploadType;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserManagementController
extends Controller
{
    //index page USer Management
    public function index()
    {
        // get bank combo branch
        $bankId = NULL;
        $dataCombo = DB::select('call sp_combo_bankbranch(?)', [$bankId]);

        $dataInsurance = Insurance::get();
        $dataRUploadType = RUploadType::get();

        return Inertia::render('UserManagement/index', [
            'permission' => User::get(),
            'dataCombo'  => $dataCombo,
            'dataInsurance' => $dataInsurance,
            'dataRUploadType' => $dataRUploadType
        ]);
    }

    public function getUserData($request)
    {
        // dd($request);

        $page = $request->input('page', 1);
        // $page = $request->page;
        $perPage = $request->input('perPage', 25);
        // $perPage = $request->perPage;
        // dd($page, $perPage);

        $query = User::with('roles', 'type');
        // $query = User::query()->with('company');

        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newFilter = $request->input('newFilter', '');
        $newSearch = json_decode($request->newFilter, true);

        // dd($sortModel);
        if ($sortModel) {
            $sortModel = explode(';', $sortModel);
            foreach ($sortModel as $sortItem) {
                // dd($sortItem);
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection);
            }
        }

        if ($filterModel) {
            foreach ($filterModel as $colId => $filterValue) {
                if ($colId === 'name') {
                    $query->where('first_name', 'LIKE', '%' . $filterValue . '%')
                        ->orWhere('last_name', 'LIKE', '%' . $filterValue . '%');
                } else {
                    $query->where($colId, 'LIKE', '%' . $filterValue . '%');
                }
            }
        }
        // Jika ada filter 'newFilter' dan tidak kosong
        if ($newFilter !== "") {
            foreach ($newSearch as $search) {
                foreach ($search as $keyId => $searchValue) {
                    // Pencarian berdasarkan nama menu
                    if ($keyId === 'name') {
                        $query->where('name', 'LIKE', '%' . $searchValue . '%');
                    }
                }
            }
        }

        if (!$sortModel && !$filterModel) {
            $query->orderBy('id', 'desc');
        }
        // dd($query);
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getUserJson(Request $request)
    {
        // dd($request->id);
        $data = $this->getUserData($request);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        // Define validation rules
        $validateData = Validator::make($request->all(), [
            'user_login'                => 'required|unique:t_user,user_login',  // Validasi untuk user_login
            'role'                      => 'required',  // Validasi untuk role
            'branch_id'                 => 'required',  // Validasi untuk branch id
            'upload_type_id'            => 'required', // Validasi untuk Upload Type
            'insurance_id'              => 'required'

        ], [
            'user_login.required'                => 'User Login is required!',
            'user_login.unique'                  => 'User Login must be unique!',
            'role.required'                      => 'Role is required!',
            'branch_id.required'                 => 'Bank Branch is required!',
            'upload_type_id.required'            => 'Upload Type is required!',
            'insurance_id.required'              => 'Insurance is required!',

        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        $name = $request->name;
        if ($name === null || $name === '') {
            $name = $request->user_login;
        }
        $User = User::create([
            "role_id" => 0,
            "name" => $name,  // Tambahkan name di sini
            'employee_id' => $request->employee_id == 0 ? null : $request->employee_id,
            'company_division_id' => $request->company_division_id == 0 ? null : $request->company_division_id,
            'individual_relation_id' => $request->individual_relations_id == 0 ? null : $request->individual_relations_id,
            "user_login" => $request->user_login,
            "user_type_id" => $request->type,
            'jobpost_id' => $request->jobpost == 0 ? null : $request->jobpost,
            'company_id' => $request->company_id == 0 ? null : $request->company_id,
            "password" => bcrypt($request->password),
            "BANK_BRANCH_ID" => $request->branch_id == 0 ? null : $request->branch_id['value'],
            "BANK_LIST_ID" => "1",
            "INSURANCE_ID"  => $request->insurance_id == 0 ? null : $request->insurance_id['value'],
            "UPLOAD_TYPE_ID"  => $request->upload_type_id == 0 ? null : $request->upload_type_id['value'],
            "USER_PHONE"  => $request->phone_number == "" ? null : $request->phone_number,
            "USER_EMAIL"  => $request->email_user == "" ? null : $request->email_user,
            "USER_CREATED_BY" => Auth::user()->id,
            "USER_CREATED_DATE" => now()
        ]);

        // Insert roles
        if ($request->has('role')) {
            $roles = $request->input('role');
            if ($roles !== "0") {
                foreach ($roles as $roleId) {
                    DB::table('m_role_users')->insert([
                        'user_id' => $User->id,
                        'role_id' => $roleId
                    ]);
                }
            }
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (User).",
                "module"      => "User Management",
                // "id"          => $User->id,
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'New user added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getUserDataByMRole()
    {
        $users = User::with('roles')->get();
        return response()->json($users);
    }
    public function getUserDataById($id)
    {
        $users = User::with('roles', 'type', 'jobpost')->where('id', $id)->first();
        return response()->json($users);
    }

    public function dataById($id)
    {
        $users = Role::where('id', $id)->first();
        // Log::info($users);
        return response()->json($users);
    }

    // Update User
    public function update(Request $request, $id)
    {

        // Define validation rules
        $validateData = Validator::make($request->all(), [
            // 'user_login'                => 'required|unique:t_user,user_login',  // Validasi untuk user_login
            // 'role'                      => 'required',  // Validasi untuk role
            'branch_id'                 => 'required',  // Validasi untuk branch id
            'upload_type_id'            => 'required', // Validasi untuk Upload Type
            'insurance_id'              => 'required'

        ], [
            // 'user_login.required'                => 'User Login is required!',
            // 'user_login.unique'                  => 'User Login must be unique!',
            // 'role.required'                      => 'Role is required!',
            'branch_id.required'                 => 'Bank Branch is required!',
            'upload_type_id.required'            => 'Upload Type is required!',
            'insurance_id.required'              => 'Insurance is required!',

        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        $User = User::find($id);
        $typeInput = collect($request->input('type'))->first();

        $User->update([
            'individual_relation_id' => $request->individual_relation_id == 0 ? null : $request->individual_relation_id,
            "user_status" => $request->user_status,
            'company_division_id' => $request->company_division_id == 0 ? null : $request->company_division_id,
            "name" => $request->name,
            "email" => $request->email,
            "user_login" => $request->user_login,
            "employee_id" => $request->employee_id == 0 ? null : $request->employee_id,
            "user_type_id" => $typeInput,
            'jobpost_id' => $request->jobpost == 0 ? null : $request->jobpost,
            'company_id' => $request->company_id == 0 ? null : $request->company_id,
            'BANK_BRANCH_ID' => $request->branch_id == 0 ? null : $request->branch_id,
            'BANK_LIST_ID' => "1",
            'INSURANCE_ID' => $request->insurance_id == 0 ? null : $request->insurance_id,
            'UPLOAD_TYPE_ID' => $request->upload_type_id == 0 ? null : $request->upload_type_id,
            "USER_PHONE"  => $request->phone_number == "" ? null : $request->phone_number,
            "USER_EMAIL"  => $request->email_user == "" ? null : $request->email_user,
            "USER_UPDATED_BY" => Auth::user()->id,
            "USER_UPDATED_DATE" => null
        ]);

        // Hapus entri di m_role_users jika tipe bukan 2
        // if ($typeInput !== 2) {
        //     DB::table('m_role_users')->where('user_id', $id)->delete();
        // }

        // Insert Roles
        // if ($typeInput === 2 && $request->has('role')) {
        //     dd("masuk");
        $roles = $request->input('role');
        DB::table('m_role_users')->where('user_id', $id)->delete(); // Menghapus entri lama

        if ($roles !== null) {
            foreach ($roles as $key => $value) {
                DB::table('m_role_users')->insert([
                    'user_id' => $id,
                    'role_id' => isset($value['value']) ? $value['value'] : $value['id']
                ]);
            }
        }
        // foreach ($roles as $roleId) {
        //     DB::table('m_role_users')->insert([
        //         'user_id' => $id,
        //         'role_id' => $roleId
        //     ]);
        // }
        // }
        // // Hapus entri di m_role_users jika tipe bukan 2
        // if ($typeInput !== 2 || $typeInput !== "2") {
        //     DB::table('m_role_users')->where('user_id', $id)->delete();
        //     $roles = $request->input('newRole');
        //     // DB::table('m_role_users')->where('user_id', $id)->delete(); // Menghapus entri lama
        //     foreach ($roles as $roleId) {

        //         DB::table('m_role_users')->insert([
        //             'user_id' => $id,
        //             'role_id' => $roleId
        //         ]);
        //     }
        // }
        return new JsonResponse([
            'User has been updated.'
        ], 200, [
            'X-Inertia' => true
        ]);
    }


    public function resetPassword(Request $request, $id)
    {
        $User = User::find($id);
        $User->update([
            "password" => bcrypt($request->password),
            "USER_UPDATED_BY" => Auth::user()->id,
            "USER_UPDATED_DATE" => now()
        ]);
        return new JsonResponse([
            // 'Policy updated.'
            'Password has been reset.'
        ], 200, [
            'X-Inertia' => true
        ]);
    }

    public function getAllUser()
    {
        $users = User::all();
        return response()->json($users);
    }
}
