import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentSectionComponent } from './commitment-section.component';

describe('CommitmentSectionComponent', () => {
  let component: CommitmentSectionComponent;
  let fixture: ComponentFixture<CommitmentSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitmentSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitmentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
