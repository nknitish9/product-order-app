import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductOrderComponent } from './components/product-order/product-order.component';
import { TextToSpeechService } from './services/text-to-speech.service';

@NgModule({
  declarations: [
    AppComponent,
    ProductOrderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [TextToSpeechService],
  bootstrap: [AppComponent]
})
export class AppModule { }