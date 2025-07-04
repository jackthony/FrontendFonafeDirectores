import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceabilitySystemComponent } from './traceability-system.component';

describe('TraceabilitySystemComponent', () => {
  let component: TraceabilitySystemComponent;
  let fixture: ComponentFixture<TraceabilitySystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraceabilitySystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TraceabilitySystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
