import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdresseFormComponent } from './adresse-form.component';

describe('AdresseFormComponent', () => {
  let component: AdresseFormComponent;
  let fixture: ComponentFixture<AdresseFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdresseFormComponent]
    });
    fixture = TestBed.createComponent(AdresseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
