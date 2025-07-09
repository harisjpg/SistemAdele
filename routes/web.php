<?php

use App\Http\Controllers\BankBranchController;
use App\Http\Controllers\BankListController;
use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\LaporanPengajuanController;
use App\Http\Controllers\laporanPenutupanController;
use App\Http\Controllers\MasterNasabahController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PengajuanController;
use App\Http\Controllers\PenutupanController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\ProsesPenawaranController;
use App\Http\Controllers\ProsesUnderwritingController;
use App\Http\Controllers\RateSettingController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TPermissionController;
use App\Http\Controllers\UserAdditionalController;
use App\Http\Controllers\RoleAccesMenuController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\RUserTypeController;
use App\Http\Controllers\SettingPageController;
use App\Http\Controllers\ShareEffectiveController;

use App\Http\Controllers\TOrganizationController;

use App\Http\Controllers\TParameterProdukController;
use App\Http\Controllers\UnderWritingController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\Utility;
use App\Models\Role;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\UserLog;
use App\Http\Middleware\Language;
use App\Models\TCompanyDivision;
use App\Models\TEmployee;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware('guest');

// TAMBAHKAN " ->middleware(Language:class) " di tiap route di class index saja
// Tidak perlu semua method ditambahkan middleware language, cukup di route yang memuat halaman pertama kali (biasanya class index)
// Di bawah/ route dashboard contoh penggunaannya.
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard')->middleware(Language::class);

Route::middleware('auth')->group(function () {
    // user additional
    Route::post('/user_additional/change_language', [UserAdditionalController::class, 'change_language'])->name('user_additional.change_language');

    //Menu
    Route::get('/setting/menu', [MenuController::class, 'index'])->name('setting/menu');
    Route::get('/getMenusJson', [MenuController::class, 'getMenusJson'])->name('getMenus.getMenusJson');
    Route::post('/getMenus', [MenuController::class, 'getMenusJson'])->name('getMenus.getMenusJson');
    Route::post('/setting/addMenu', [MenuController::class, 'store'])->name('addMenu.store');
    Route::post('/getMenuCombo', [MenuController::class, 'getMenuCombo'])->name('getMenuCombo.getMenuCombo');
    Route::post('/getMenuById', [MenuController::class, 'getMenuById'])->name('getMenuById.getMenuById');
    Route::post('/setting/editMenu', [MenuController::class, 'edit'])->name('editMenu.edit');
    Route::post('/setting/editMenu', [MenuController::class, 'edit'])->name('editMenu.edit');
    Route::post(('/setting/changeSeqMenu'), [MenuController::class, 'updateMenuSequence'])->name('changeMenu.changeMenu');
    Route::get('/showMenu', [MenuController::class, 'showMenu'])->name('showMenu.showMenu');
    Route::post('/changeMenuStatus', [MenuController::class, 'changeMenuStatus'])->name('changeMenuStatus.changeMenuStatus');

    // Permission
    Route::get('/setting/permission', [TPermissionController::class, 'index'])->name('setting/permission');
    Route::get('/getPermission', [TPermissionController::class, 'getPermissionJson'])->name('getPermission.getPermissionJson');
    Route::post('/getPermission', [TPermissionController::class, 'getPermissionJson'])->name('getPermission.getPermissionJson');
    Route::post('/setting/addPermission', [TPermissionController::class, 'store'])->name('addPermission.store');
    Route::post('/getPermissionById',  [TPermissionController::class, 'get_detail'])->name('getPermissionById.get_detail');
    Route::post('/setting/editPermission', [TPermissionController::class, 'edit'])->name('editPermission.store');

    // Role
    Route::get('/setting/role', [RoleController::class, 'index'])->name('setting/role');
    Route::get('/getRole', [RoleController::class, 'getRoleJson'])->name('getRole.getRoleJson');
    Route::post('/getRole', [RoleController::class, 'getRoleJson'])->name('getRole.getRoleJson');
    Route::post('/setting/addRole', [RoleController::class, 'store'])->name('addRole.store');
    Route::post('/getRoleById', [RoleController::class, 'getDetail'])->name('getRole.getRoleByidJson');

    // Role
    Route::get('/setting/role', [RoleController::class, 'index'])->name('setting/role');
    Route::post('/getRole', [RoleController::class, 'getRoleJson'])->name('getRole.getRoleJson');
    Route::post('/getAllRole', [RoleController::class, 'getRole'])->name('/getAllRole');
    Route::post('/getRoleById', [RoleController::class, 'getDetail'])->name('getRole.getRoleByidJson');
    Route::post('/setting/addRole', [RoleController::class, 'store'])->name('addRole.store');

    // access role menu
    Route::get('/getRoleAccessMenuByRoleId/{role_id}', [RoleAccesMenuController::class, 'getAccessMenuByRoleId'])->name('getRoleAccessMenuByRoleId.getMenuByRole');
    Route::post('/roleAccessMenu', [RoleAccesMenuController::class, 'store'])->name('roleAccessMenu.store');
    Route::post('/addAccessMenu/{role_id}', [RoleAccesMenuController::class, 'addAccessMenu'])->name('addAccessMenu.addAccessMenu');

    //role permission
    Route::get('/rolePermission/{role_id}', [RolePermissionController::class, 'getPermissionByRoleId'])->name('rolePermission.getPermissionByRoleId');
    Route::post('/rolePermission', [RolePermissionController::class, 'store'])->name('rolePermission.store');

    //settings/userManagement
    Route::post('/getUser', [UserManagementController::class, 'getUserJson'])->name('getUser.getUserJson');
    Route::get('/getUser', [UserManagementController::class, 'getUserJson'])->name('getUser');
    Route::get('/settings/user', [UserManagementController::class, 'index'])->name('settings/user');
    Route::post('/settings/addUser', [UserManagementController::class, 'store'])->name('settings/addUser.store');
    Route::get('/settings/getUserJson', [UserManagementController::class, 'getUserDataByMRole'])->name('settings/getUserJson.getUserJson');
    Route::post('/settings/getUserId/{id}', [UserManagementController::class, 'getUserDataById'])->name('settings/getUserId.getUserId');
    Route::post('/settings/UserId/{id}', [UserManagementController::class, 'dataById'])->name('settings/UserId.getUserId');
    Route::post('/settings/userEdit/{id}', [UserManagementController::class, 'update'])->name('settings/userEdit.update');
    Route::patch('/settings/userResetPassword/{id}', [UserManagementController::class, 'resetPassword'])->name('settings/userResetPassword.resetPassword');
    Route::get('/user', [UserManagementController::class, 'getAllUser'])->name('user.getAllUser');

    //setting/usertype
    Route::get('/settings/type', [RUserTypeController::class, 'index'])->name('type');
    // Route::get('/getType', [RUserTypeController::class, 'getTypeJson'])->name('getType');
    Route::post('/getType', [RUserTypeController::class, 'getTypeJson'])->name('getType.getTypeJson');


    // bank List
    Route::get('/setting/bankList', [BankListController::class, 'index'])->name('setting/bankList');
    Route::get('/getBankList', [BankListController::class, 'getBankList'])->name('getBankList');
    Route::post('/addBankList', [BankListController::class, 'addBankList'])->name('addBankList');
    Route::post('/editBankList/{id}', [BankListController::class, 'editBankList'])->name('editBankList');

    // setting Color
    Route::post('/settingColor', [SettingPageController::class, 'settingColor'])->name('settingColor');

    // bank branch
    Route::get('/bankBranchList', [BankBranchController::class, 'index'])->name('bankBranchList');
    Route::get('/getBankBranchList', [BankBranchController::class, 'getBankBranchList'])->name('getBankBranchList');
    Route::post('/getComboParentBranch', [BankBranchController::class, 'getComboParentBranch'])->name('getComboParentBranch');
    Route::post('/getKanwil', [BankBranchController::class, 'getKanwil'])->name('getKanwil');
    Route::post('/addBankBranch', [BankBranchController::class, 'addBankBranch'])->name('addBankBranch');
    Route::post('/editBankBranch/{id}', [BankBranchController::class, 'editBankBranch'])->name('editBankBranch');

    // Rate Manage
    Route::get('/setting/rateSetting', [RateSettingController::class, 'index'])->name('setting/rateSetting');
    Route::post('/addRateSetting', [RateSettingController::class, 'addRateSetting'])->name('addRateSetting');
    Route::get('/downloadTemplate/{id}', [RateSettingController::class, 'downloadTemplate'])->name('downloadTemplate');
    Route::get('/downloadRate/{id}', [RateSettingController::class, 'downloadRate'])->name('downloadRate');
    Route::get('/getRateSetting', [RateSettingController::class, 'getRateSetting'])->name('getRateSetting');
    Route::post('/editRateSetting/{id}', [RateSettingController::class, 'editRateSetting'])->name('editRateSetting');
    Route::post('/getMRateInsurance', [RateSettingController::class, 'getMRateInsurance'])->name('getMRateInsurance');

    // Insurance
    Route::get('/insuranceList', [InsuranceController::class, 'index'])->name('insuranceList');
    Route::post('/addInsuranceList', [InsuranceController::class, 'addInsuranceList'])->name('addInsuranceList');
    Route::post('/addInsuranceBundling', [InsuranceController::class, 'addInsuranceBundling'])->name('addInsuranceBundling');
    Route::get('/getInsuranceList', [InsuranceController::class, 'getInsuranceList'])->name('getInsuranceList');
    Route::post('/getProdukAsuransi', [InsuranceController::class, 'getProdukAsuransi'])->name('getProdukAsuransi');
    Route::post('/editInsuranceList/{id}', [InsuranceController::class, 'editInsuranceList'])->name('editInsuranceList');
    Route::post('/getInsuranceTypeProduct', [InsuranceController::class, 'getInsuranceType'])->name('getInsuranceTypeProduct');
    Route::post('/getInsuranceTypeBundling', [InsuranceController::class, 'getInsuranceTypeBundling'])->name('getInsuranceTypeBundling');
    Route::get('/getInsuranceBundling', [InsuranceController::class, 'getInsuranceBundling'])->name('getInsuranceBundling');
    Route::post('/saveBundlingInsurance', [InsuranceController::class, 'saveBundlingInsurance'])->name('saveBundlingInsurance');




    // Share Configuration
    Route::get('/share', [ShareEffectiveController::class, 'index'])->name('share');
    Route::post('/getInsuranceType', [ShareEffectiveController::class, 'getInsuranceType'])->name('getInsuranceType');
    Route::post('/getInsuranceList', [ShareEffectiveController::class, 'getInsuranceList'])->name('getInsuranceList');
    Route::post('/addCreateShareEffective', [ShareEffectiveController::class, 'saveConfigurationShare'])->name('addCreateShareEffective.saveConfigurationShare');
    Route::get('/getShareEffective', [ShareEffectiveController::class, 'getShareEffective'])->name('getShareEffective');
    Route::get('/getShareEffectiveKredit', [ShareEffectiveController::class, 'getShareEffectiveKredit'])->name('getShareEffectiveKredit');
    Route::get('/upcomingShareEffective', [ShareEffectiveController::class, 'upcomingShareEffective'])->name('upcomingShareEffective');
    Route::get('/listOfPreviousShare', [ShareEffectiveController::class, 'listOfPreviousShare'])->name('listOfPreviousShare');
    Route::post('/editShareEffective/{id}', [ShareEffectiveController::class, 'editShareEffective'])->name('editShareEffective');
    Route::post('/deleteShareEffective', [ShareEffectiveController::class, 'deleteShareEffective'])->name('deleteShareEffective');
    Route::post('/getCurrentEffectiveDate', [ShareEffectiveController::class, 'getCurrentEffectiveDate'])->name('getCurrentEffectiveDate');
    Route::post('/getCurrentEffectiveDateKredit', [ShareEffectiveController::class, 'getCurrentEffectiveDateKredit'])->name('getCurrentEffectiveDateKredit');

    // Pengajuan
    Route::get('/pengajuanDebitur', [PengajuanController::class, 'index'])->name('pengajuanDebitur');
    Route::get('/getOffer', [PengajuanController::class, 'getOffer'])->name('getOffer');
    Route::post('/getFindTheInsured', [PengajuanController::class, 'getFindTheInsured'])->name('getFindTheInsured');
    Route::post('/getProdukSubProduk', [PengajuanController::class, 'getProdukSubProduk'])->name('getProdukSubProduk');
    Route::post('/getBranchCodeName', [PengajuanController::class, 'getBranchCodeName'])->name('getBranchCodeName');
    Route::post('/addPengajuanDebitur', [PengajuanController::class, 'addPengajuanDebitur'])->name('addPengajuanDebitur.addPengajuanDebitur');
    Route::post('/getReviewPengajuanDebitur', [PengajuanController::class, 'getReviewPengajuanDebitur'])->name('getReviewPengajuanDebitur');
    Route::post('/editDocument', [PengajuanController::class, 'editDocument'])->name('editDocument.editDocument');
    Route::get('/getOfferDetail/{id}', [PengajuanController::class, 'getOfferDetail'])->name('getOfferDetail');
    Route::post('/getJenisDocumentTypeAll', [PengajuanController::class, 'getJenisDocumentTypeAll'])->name('getJenisDocumentTypeAll');
    Route::post('/uploadDocument', [PengajuanController::class, 'uploadDocument'])->name('uploadDocument.uploadDocument');
    Route::post('/addCatatan', [PengajuanController::class, 'addCatatan'])->name('addCatatan.addCatatan');
    Route::post('/terimaPengajuan', [PengajuanController::class, 'terimaPengajuan'])->name('terimaPengajuan.terimaPengajuan');
    Route::post('/addCatatanKonfirmasi', [PengajuanController::class, 'addCatatanKonfirmasi'])->name('addCatatanKonfirmasi.addCatatanKonfirmasi');
    Route::post('/addCatatanAjukanKeBroker', [PengajuanController::class, 'addCatatanAjukanKeBroker'])->name('addCatatanAjukanKeBroker.addCatatanAjukanKeBroker');
    Route::post('/ajukanKeAsuransi', [PengajuanController::class, 'ajukanKeAsuransi'])->name('ajukanKeAsuransi.ajukanKeAsuransi');
    Route::get('/getHistoryPengajuan/{id}', [PengajuanController::class, 'getHistoryPengajuan'])->name('getHistoryPengajuan');
    Route::post('/editDataPengajuan', [PengajuanController::class, 'editDataPengajuan'])->name('editDataPengajuan.editDataPengajuan');
    Route::post('/insuranceApprovePengajuan', [PengajuanController::class, 'insuranceApprovePengajuan'])->name('insuranceApprovePengajuan.insuranceApprovePengajuan');
    Route::post('/uploadPendingDocument', [PengajuanController::class, 'uploadPendingDocument'])->name('uploadPendingDocument.uploadPendingDocument');
    Route::post('/uploadTolakDocument', [PengajuanController::class, 'uploadTolakDocument'])->name('uploadTolakDocument.uploadTolakDocument');
    Route::post('/batalPengajuan', [PengajuanController::class, 'batalPengajuan'])->name('batalPengajuan.batalPengajuan');
    Route::post('/getAllTotal', [PengajuanController::class, 'getAllTotal'])->name('getAllTotal.getAllTotal');
    Route::post('/getDetailDataEditPremi', [PengajuanController::class, 'getDetailDataEditPremi'])->name('getDetailDataEditPremi.getDetailDataEditPremi');
    Route::post('/saveEditPremi', [PengajuanController::class, 'saveEditPremi'])->name('saveEditPremi.saveEditPremi');
    Route::post('/getSumberPembayaran', [PengajuanController::class, 'getSumberPembayaran'])->name('getSumberPembayaran');
    Route::post('/calculatePremi', [PengajuanController::class, 'calculatePremi'])->name('calculatePremi');
    Route::post('/forInsuranceReview', [PengajuanController::class, 'forInsuranceReview'])->name('forInsuranceReview.forInsuranceReview');
    Route::post('/selectInsurance', [PengajuanController::class, 'selectInsurance'])->name('selectInsurance.selectInsurance');
    Route::post('/getFilterInsurance', [PengajuanController::class, 'getFilterInsurance'])->name('getFilterInsurance.getFilterInsurance');







    // Penutupan
    Route::get('/penutupan', [PenutupanController::class, 'index'])->name('penutupan');
    Route::get('/getBusinessList', [PenutupanController::class, 'getBusinessList'])->name('getBusinessList');
    Route::get('/downloadCoverNote/{id}', [PenutupanController::class, 'downloadCoverNote'])->name('downloadCoverNote');
    Route::post('/getDetailBusinessList', [PenutupanController::class, 'getDetailBusinessList'])->name('getDetailBusinessList.getDetailBusinessList');

    // Laporan Pengajuan
    Route::get('/laporan/laporanPengajuan', [LaporanPengajuanController::class, 'index'])->name('laporan/laporanPengajuan');
    Route::get('/getDataLaporanPengajuan', [LaporanPengajuanController::class, 'getDataLaporanPengajuan'])->name('getDataLaporanPengajuan');
    Route::post('/getGenerateExcel', [LaporanPengajuanController::class, 'getGenerateExcel'])->name('getGenerateExcel.getGenerateExcel');

    // Laporan Penutupan
    Route::get('/laporan/laporanPenutupan', [laporanPenutupanController::class, 'index'])->name('laporan/laporanPenutupan');
    Route::get('/getDataLaporanPenutupan', [laporanPenutupanController::class, 'getDataLaporanPenutupan'])->name('getDataLaporanPenutupan');
    Route::post('/getGenerateExcelPenutupan', [laporanPenutupanController::class, 'getGenerateExcelPenutupan'])->name('getGenerateExcelPenutupan.getGenerateExcelPenutupan');


    // Master Nasabah
    Route::get('/nasabah', [MasterNasabahController::class, 'index'])->name('nasabah');
    Route::get('/getNasabah', [MasterNasabahController::class, 'getNasabah'])->name('getNasabah');
    Route::post('/addNasabah', [MasterNasabahController::class, 'addNasabah'])->name('addNasabah');
    Route::get('/downloadKTP/{id}', [MasterNasabahController::class, 'downloadKTP'])->name('downloadKTP');
    Route::post('/editNasabah/{id}', [MasterNasabahController::class, 'editNasabah'])->name('editNasabah');
    Route::post('/getDataWork', [MasterNasabahController::class, 'getDataWork'])->name('getDataWork');


    // Under Writing
    Route::get('/underWriting', [UnderWritingController::class, 'index'])->name('underWriting');
    Route::get('/getUnderWriting', [UnderWritingController::class, 'getUnderWriting'])->name('getUnderWriting');
    Route::post('/addUnderWriting', [UnderWritingController::class, 'addUnderWriting'])->name('addUnderWriting');
    Route::post('/editUnderWriting/{id}', [UnderWritingController::class, 'editUnderWriting'])->name('editUnderWriting');


    // Produk
    Route::get('/produkAsuransi', [ProdukController::class, 'index'])->name('produkAsuransi');
    Route::get('/getProdukAsuransi', [ProdukController::class, 'getProdukAsuransi'])->name('getProdukAsuransi');
    Route::post('/addProduk', [ProdukController::class, 'addProduk'])->name('addProduk');
    Route::post('/editProduk/{id}', [ProdukController::class, 'editProduk'])->name('editProduk');

    // Organization
    Route::get('/broker', [TOrganizationController::class, 'index'])->name('broker');
    Route::get('/getOrganisasi', [TOrganizationController::class, 'getOrganisasi'])->name('getOrganisasi');

    // Proses Penawaran
    Route::get('/prosesPenawaran', [ProsesPenawaranController::class, 'index'])->name('prosesPenawaran');
    Route::get('/getOfferPenawaran', [ProsesPenawaranController::class, 'getOfferPenawaran'])->name('getOfferPenawaran');


    // Proses Underwriting
    Route::get('/prosesUnderwriting', [ProsesUnderwritingController::class, 'index'])->name('prosesUnderwriting');
    Route::get('/getOfferUnderwriting', [ProsesUnderwritingController::class, 'getOfferUnderwriting'])->name('getOfferUnderwriting');
    Route::post('/getDetailProsesUnderwriting', [ProsesUnderwritingController::class, 'getDetailProsesUnderwriting'])->name('getDetailProsesUnderwriting');
    Route::post('/getDetailProsesPenawaran', [ProsesPenawaranController::class, 'getDetailProsesPenawaran'])->name('getDetailProsesPenawaran');

    // Paremter Produk
    Route::get('/parameterProduk', [TParameterProdukController::class, 'index'])->name('parameterProduk');
    Route::post('/addParameterProduk', [TParameterProdukController::class, 'addParameterProduk'])->name('addParameterProduk');
    Route::post('/getDataParameterProduk', [TParameterProdukController::class, 'getDataParameterProduk'])->name('getDataParameterProduk');
    Route::post('/editParameterProduk', [TParameterProdukController::class, 'editParameterProduk'])->name('editParameterProduk');
























    // for Utility
    // Route::post('/getInsuranceType', [Utility::class, 'getInsuranceType'])->name('getInsuranceType');
});

require __DIR__ . '/auth.php';
