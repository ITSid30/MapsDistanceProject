import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsBarComponent } from './maps-bar.component';

describe('MapsBarComponent', () => {
  let component: MapsBarComponent;
  let fixture: ComponentFixture<MapsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapsBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
