import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferralCodeComponent } from './add-referral-code.component';

describe('AddReferralCodeComponent', () => {
  let component: AddReferralCodeComponent;
  let fixture: ComponentFixture<AddReferralCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReferralCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReferralCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
