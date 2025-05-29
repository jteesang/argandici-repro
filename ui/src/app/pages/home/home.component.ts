import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroBannerComponent } from '../../shared/hero-banner/hero-banner.component';
import { ValuesSectionComponent } from '../../shared/values-section/values-section.component';
import { ProcessSectionComponent } from '../../shared/process-section/process-section.component';
import { ProductsSectionComponent } from '../../shared/products-section/products-section.component';
import { CommitmentSectionComponent } from '../../shared/commitment-section/commitment-section.component';
import { NewsletterSectionComponent } from '../../shared/newsletter-section/newsletter-section.component';
// import { NavbarComponent } from '../../core/navbar/navbar.component';
// import { FooterComponent } from '../../core/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    // NavbarComponent,
    // FooterComponent,
    HeroBannerComponent,
    ValuesSectionComponent,
    ProcessSectionComponent,
    ProductsSectionComponent,
    CommitmentSectionComponent,
    NewsletterSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {

}
