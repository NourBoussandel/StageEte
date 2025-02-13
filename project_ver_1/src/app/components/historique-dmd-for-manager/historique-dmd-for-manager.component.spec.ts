import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDmdForManagerComponent } from './historique-dmd-for-manager.component';

describe('HistoriqueDmdForManagerComponent', () => {
  let component: HistoriqueDmdForManagerComponent;
  let fixture: ComponentFixture<HistoriqueDmdForManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueDmdForManagerComponent]
    });
    fixture = TestBed.createComponent(HistoriqueDmdForManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
