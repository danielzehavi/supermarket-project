import { OrderComponent } from "./components/order-area/order/order.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "./components/layout-area/page-not-found/page-not-found.component";
import { ProductsListComponent } from "./components/products-area/products-list/products-list.component";
import { LoginComponent } from "./components/auth-area/login/login.component";
import { LogoutComponent } from "./components/auth-area/logout/logout.component";
import { RegisterComponent } from "./components/auth-area/register/register.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "products",
    component: ProductsListComponent,
    canActivate: [AuthGuard],
  },
  { path: "order", component: OrderComponent, canActivate: [AuthGuard] },
  { path: "", redirectTo: "products", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
