<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AvatarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileDownloadController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MemberCardController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\OrderCommentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderFileController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Provider\DashboardController as ProviderDashboardController;
use App\Http\Controllers\Provider\EarningsController;
use App\Http\Controllers\Provider\OrderController as ProviderOrderController;
use App\Http\Controllers\ServiceCatalogController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('home');
Route::get('/servis', [ServiceCatalogController::class, 'index'])->name('services.catalog');
Route::get('/terma', [PageController::class, 'terms'])->name('terms');
Route::get('/privasi', [PageController::class, 'privacy'])->name('privacy');

Route::get('/attendance/{event}', [AttendanceController::class, 'scan'])
    ->middleware(['signed', 'throttle:10,1'])
    ->name('attendance.scan');

Route::get('/semak-ahli/{membershipId}', [MemberCardController::class, 'verify'])
    ->middleware('throttle:30,1')
    ->name('members.verify');

Route::middleware(['auth', 'verified', 'active'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::post('/membership/apply', [MembershipController::class, 'apply'])->name('membership.apply');
    Route::get('/kad-ahli', [MemberCardController::class, 'show'])->name('member.card');

    Route::resource('orders', OrderController::class)->only(['index', 'create', 'store', 'show']);
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('orders/{order}/files', [OrderFileController::class, 'store'])->name('orders.files.store');
    Route::post('orders/{order}/comments', [OrderCommentController::class, 'store'])->name('orders.comments.store');
    Route::get('files/{path}', FileDownloadController::class)->name('files.download');
});

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'active', 'role:superadmin'])->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/membership/approve', [AdminUserController::class, 'approveMembership'])->name('users.membership.approve');
    Route::post('/users/{user}/membership/reject', [AdminUserController::class, 'rejectMembership'])->name('users.membership.reject');
    Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.role.update');
    Route::post('/users/{user}/toggle-active', [AdminUserController::class, 'toggleActive'])->name('users.toggle-active');

    Route::resource('services', AdminServiceController::class)->except(['show']);

    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/assign', [AdminOrderController::class, 'assign'])->name('orders.assign');
    Route::post('/orders/{order}/confirm', [AdminOrderController::class, 'confirm'])->name('orders.confirm');
    Route::post('/orders/{order}/cancel', [AdminOrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('/orders/{order}/payments', [AdminOrderController::class, 'recordPayment'])->name('orders.payments.store');
    Route::post('/orders/{order}/payouts', [AdminOrderController::class, 'recordPayout'])->name('orders.payouts.store');

    Route::resource('events', EventController::class)->except(['show']);
    Route::get('/events/{event}/qr', [EventController::class, 'qrDisplay'])->name('events.qr');
    Route::get('/events/{event}/attendances', [EventController::class, 'attendances'])->name('events.attendances');
    Route::get('/events/{event}/attendances/export', [EventController::class, 'exportAttendances'])->name('events.attendances.export');

    Route::get('/skills', [SkillController::class, 'index'])->name('skills.index');
    Route::post('/skills', [SkillController::class, 'store'])->name('skills.store');
    Route::delete('/skills/{skill}', [SkillController::class, 'destroy'])->name('skills.destroy');

    Route::get('/log-aktiviti', [ActivityLogController::class, 'index'])->name('activity.index');
});

Route::prefix('provider')->name('provider.')->middleware(['auth', 'verified', 'active', 'role:superadmin,provider'])->group(function () {
    Route::get('/', ProviderDashboardController::class)->name('dashboard');
    Route::get('/orders', [ProviderOrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/{order}/complete', [ProviderOrderController::class, 'complete'])->name('orders.complete');
    Route::get('/earnings', [EarningsController::class, 'index'])->name('earnings.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/avatar', [AvatarController::class, 'update'])->name('avatar.update');
    Route::delete('/profile/avatar', [AvatarController::class, 'destroy'])->name('avatar.destroy');
});

Route::get('/avatar/{user}', [AvatarController::class, 'show'])
    ->middleware('throttle:60,1')
    ->name('avatar.show');

require __DIR__.'/auth.php';
