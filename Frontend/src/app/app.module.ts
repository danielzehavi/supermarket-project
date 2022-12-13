import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { LayoutComponent } from "./components/layout-area/layout/layout.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HeaderComponent } from "./components/layout-area/header/header.component";
import { FooterComponent } from "./components/layout-area/footer/footer.component";
import { PageNotFoundComponent } from "./components/layout-area/page-not-found/page-not-found.component";
import { LoginComponent } from "./components/auth-area/login/login.component";
import { RegisterComponent } from "./components/auth-area/register/register.component";
import { LogoutComponent } from "./components/auth-area/logout/logout.component";
import { ProductsListComponent } from "./components/products-area/products-list/products-list.component";
import { ProductCardComponent } from "./components/products-area/product-card/product-card.component";
import { CartComponent } from "./components/products-area/cart/cart.component";
import { OrderComponent } from "./components/order-area/order/order.component";
import { AddProductComponent } from "./components/products-area/add-product/add-product.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthMenuComponent } from "./components/auth-area/auth-menu/auth-menu.component";
import { AuthService } from "./services/auth.service";
import { InterceptorService } from "./services/interceptor.service";
import { ItemCardComponent } from "./components/order-area/item-card/item-card.component";
import { NgxPrintModule } from "ngx-print";
import { NgxBootstrapIconsModule } from "ngx-bootstrap-icons";
import {
  pencilSquare,
  plusCircle,
  questionLg,
  xCircle,
  boxArrowRight,
} from "ngx-bootstrap-icons";
import { FormlyModule } from "@ngx-formly/core";

const icons = {
  pencilSquare,
  plusCircle,
  questionLg,
  xCircle,
  boxArrowRight,
};

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ProductsListComponent,
    ProductCardComponent,
    CartComponent,
    OrderComponent,
    AddProductComponent,
    AuthMenuComponent,
    ItemCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule,
    NgbModule,
    FormlyModule.forRoot(),
    NgxBootstrapIconsModule.pick(icons),
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [LayoutComponent],
})
export class AppModule {}
