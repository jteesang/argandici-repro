import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InfoBarComponent } from './shared/info-bar/info-bar.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent, RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent { }
