import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingIMGComponent } from './loading-img.component';

describe('LoadingIMGComponent', () => {
  let component: LoadingIMGComponent;
  let fixture: ComponentFixture<LoadingIMGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingIMGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingIMGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
