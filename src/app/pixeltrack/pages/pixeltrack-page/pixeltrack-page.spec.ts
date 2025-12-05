import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixeltrackPage } from './pixeltrack-page';

describe('PixeltrackPage', () => {
  let component: PixeltrackPage;
  let fixture: ComponentFixture<PixeltrackPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixeltrackPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixeltrackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
