import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HeroBannerComponent {
  slides = [
    {
      image: 'assets/images/asset_1.jpg',
      title: "L'authenticité de l'<span class='text-[#9F0502]'>huile d'argan</span>",
      text: "Découvrez la pureté et les bienfaits de notre huile d'argan familiale, du Maroc à la France.",
      button: { text: "Découvrir nos produits", link: "/products" }
    },
    {
      image: 'assets/images/asset_2.jpg',
      title: "Cosmétique ou Alimentaire: <span class='text-[#9F0502]'>la qualité avant tout</span>",
      text: "Nos gammes couvrent tous les usages: cuisine, beauté, bien-être… 100% artisanales.",
      button: { text: "Voir nos gammes", link: "/products" }
    },
    {
      image: 'assets/images/asset_3.jpg',
      title: "Engagement <span class='text-[#92A774]'>éthique & local</span>",
      text: "Soutien direct aux petits producteurs marocains, circuits courts, contrôle qualité.",
      button: { text: "Notre histoire", link: "/about" }
    }
  ];

  active = 0;
  timer: any;

  ngOnInit() {
    this.startAuto();
  }

  startAuto() {
    this.stopAuto();
    this.timer = setInterval(() => {
      this.next();
    }, 6000);
  }

  stopAuto() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  next() {
    this.active = (this.active + 1) % this.slides.length;
  }

  prev() {
    this.active = (this.active - 1 + this.slides.length) % this.slides.length;
  }

  goTo(idx: number) {
    this.active = idx;
    this.startAuto();
  }
}
