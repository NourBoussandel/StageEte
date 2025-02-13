import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisonRefusComponent } from './raison-refus.component';

describe('RaisonRefusComponent', () => {
  let component: RaisonRefusComponent;
  let fixture: ComponentFixture<RaisonRefusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RaisonRefusComponent]
    });
    fixture = TestBed.createComponent(RaisonRefusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
