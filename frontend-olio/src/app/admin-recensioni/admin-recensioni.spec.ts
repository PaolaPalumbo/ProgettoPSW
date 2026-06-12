import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecensioni } from './admin-recensioni';

describe('AdminRecensioni', () => {
  let component: AdminRecensioni;
  let fixture: ComponentFixture<AdminRecensioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecensioni],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRecensioni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
