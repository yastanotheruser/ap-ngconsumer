import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositivosComponent } from './positivos.component';

describe('PositivosComponent', () => {
  let component: PositivosComponent;
  let fixture: ComponentFixture<PositivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PositivosComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
