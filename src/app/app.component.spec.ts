/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('adds a timestamp after the first user interaction only once per day', () => {
    component.openChat();
    fixture.detectChanges();

    (component as any).addUserMessage('Orders');
    fixture.detectChanges();

    const firstUserMessage = component['messages'][1];
    expect(firstUserMessage.timestamp).toBeTruthy();
    expect(firstUserMessage.timestamp).toMatch(/[A-Za-z]{3}\s+\d{1,2}\s+\|\s+\d/);

    (component as any).addUserMessage('Billing');
    fixture.detectChanges();

    const secondUserMessage = component['messages'][2];
    expect(secondUserMessage.timestamp).toBeUndefined();
  });

  it('keeps chat history when the chat is closed and reopened', () => {
    component.openChat();
    (component as any).addUserMessage('Orders');

    component.closeChat();
    component.openChat();

    expect(component['messages'].length).toBe(2);
  });
});
