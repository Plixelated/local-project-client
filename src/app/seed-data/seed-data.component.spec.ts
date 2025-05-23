import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedDataComponent } from './seed-data.component';

describe('SeedDataComponent', () => {
  let component: SeedDataComponent;
  let fixture: ComponentFixture<SeedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeedDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
