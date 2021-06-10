import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: "",
  //   loadChildren: "./pages/page-not-found/page-not-found.module#PageNotFoundModule"
  // },
  {
    path: "",
    loadChildren: "./pages/auth/login/login.module#LoginModule"
  },
  {
    path: "login",
    loadChildren: "./pages/auth/login/login.module#LoginModule"
  },
  {
    path: "approvallist",
    loadChildren: "./pages/approval/approvallist/approvallist.module#ApprovallistModule"
  },
  {
    path: "approvalpage/:id",
    loadChildren: "./pages/approval/approvalpage/approvalpage.module#ApprovalpageModule"
  },
  {
    path: "approvalView/:id",
    loadChildren: "./pages/approval/approvalView/approvalView.module#ApprovalViewModule"
  },
  {
    path: 'phonedetails',
    loadChildren: './pages/phone-book-details/phone-book-details.module#PhoneBookDetailsModule'
  },
  {
    path: "changepassword",
    loadChildren: "./pages/auth/changepassword/changepassword.module#ChangepasswordModule"
  },

  {
    path: "landing-page",
    loadChildren: "./pages/landing-page/landing-page.module#LandingPageModule"
  },

  {
    path: "request-type",
    loadChildren: "./pages/request-type/request-type.module#RequestTypeModule"
  },
  {
    path: "amenity",
    loadChildren: "./pages/aminite/aminite.module#AminiteModule"
  },
  {
    path: "request-subtype",
    loadChildren: "./pages/request-subtype/request-subtype.module#RequestSubtypeModule"
  },
  {
    path: "request",
    loadChildren: "./pages/request/request.module#RequestModule"
  },
  {
    path: "sublocation",
    loadChildren: "./pages/sublocation/sublocation.module#SublocationModule"
  },
  {
    path: "external-link",
    loadChildren: "./pages/external-link/external-link.module#ExternalLinkModule"
  },
  {
    path: "flash-news",
    loadChildren: "./pages/flash-news/flash-news.module#FlashNewsModule"
  },
  {
    path: "dashboard",
    loadChildren: "./pages/dashboard/dashboard.module#DashboardModule",
  },
  {
    path: "request-configuration",
    loadChildren: "./pages/request-workflow/request-workflow.module#RequestWorkflowModule",

  },
  {
    path: "request-scrconfig",
    loadChildren: "./pages/request-scrconfig/request-scrconfig.module#RequestScrconfigModule"
  },
  {
    path: "roomconfig",
    loadChildren: "./pages/roomconfig/roomconfig.module#RoomconfigModule"
  },
  {
    path: "widgets",
    loadChildren: './pages/widgets/widgets.module#WidgetsModule'
  },
  {
    path: "help",
    loadChildren: './pages/help/help.module#HelpModule'
  },
  {
    path: "faq",
    loadChildren: './pages/faq/faq.module#FaqModule'
  },
  {
    path: "room-booking",
    loadChildren: './pages/room-booking/room-booking.module#RoomBookingModule'
  },
  {
    path: "userrole",
    loadChildren: './pages/user-role/user-role.module#UserRoleModule'
  },
  {
    path: "user",
    loadChildren: './pages/user/user.module#UserModule'
  },
  {
    path: "department",
    loadChildren: './pages/department/department.module#DepartmentModule'
  },
  {
    path: "location",
    loadChildren: './pages/location/location.module#LocationModule'
  },
  {
    path: "authentication",
    loadChildren: './pages/authentication/authentication.module#AuthenticationModule'
  },
  {
    path: "request-resolver",
    loadChildren: './pages/request-resolver/request-resolver.module#RequestResolverModule'
  },
  {
    path: "request-summary",
    loadChildren: './pages/request-summary/request-summary-view/request-summary-view.module#RequestSummaryViewModule'
  },
  {
    path: 'phone',
    loadChildren: './pages/phone-book/phone.module#PhoneModule'
  },
  {
    path: 'room-booking-configuration',
    loadChildren: './pages/room-booking-configuration/room-booking-configuration.module#RoomBookingConfigurationModule'
  },
  {
    path: 'dashboardrequest',
    loadChildren: './pages/request/request.module#RequestModule'
  },
  {
    path: 'user-entity-mapping',
    loadChildren: './pages/user-entity-mapping/user-entity-mapping.module#UserEntityMappingModule'
  },
  {
    path: 'user-map',
    loadChildren: './pages/user-map/user-map.module#UserMapModule'
  },
  {
    path: 'roombookapproval',
    loadChildren: './pages/roombookapproval/roombookapproval.module#RoombookapprovalModule'
  },
  {
    path: 'userprofile',
    loadChildren: './pages/user-profile/user-profile.module#UserProfileModule'
  },{
    path: 'contact-details',
    loadChildren: './pages/contact-details/contact-details.module#ContactDetailsModule'
  },{
    path: 'widgets-admin',
    loadChildren: './pages/widgets-admin/widgets-admin.module#WidgetsAdminModule'
  },{
    path: 'holiday-details',
    loadChildren: './pages/holiday-details/holiday-details.module#HolidayDetailsModule'
  },
  {
    path: "delegation",
    loadChildren: "./pages/delegation/delegation.module#DelegationModule"
  },
  {
    path: "entity",
    loadChildren: './pages/entity/entity.module#EntityModule'
  },
  {
    path: "weekend-master",
    loadChildren: './pages/weekend-master/weekend-master.module#WeekendMasterModule'
  },
  {
    path: "plan-master",
    loadChildren: './pages/plan-master/plan-master.module#PlanMasterModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
