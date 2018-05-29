import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnsfiltersComponent } from './turnsfilters.component';

describe('TurnsfiltersComponent', () => {
  let component: TurnsfiltersComponent;
  let fixture: ComponentFixture<TurnsfiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnsfiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnsfiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
