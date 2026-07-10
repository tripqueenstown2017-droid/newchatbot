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

    const firstTimelineItem = component['timeline'][0];
    if (firstTimelineItem.type !== 'message') {
      throw new Error('Expected the first timeline item to be a message');
    }

    const firstUserMessage = firstTimelineItem.message;
    expect(firstUserMessage.timestamp).toBeTruthy();
    expect(firstUserMessage.timestamp).toMatch(/[A-Za-z]{3}\s+\d{1,2}\s+\|\s+\d/);

    (component as any).addUserMessage('Billing');
    fixture.detectChanges();

    const secondTimelineItem = component['timeline'][1];
    if (secondTimelineItem.type !== 'message') {
      throw new Error('Expected the second timeline item to be a message');
    }

    const secondUserMessage = secondTimelineItem.message;
    expect(secondUserMessage.timestamp).toBeUndefined();
  });

  it('keeps chat history when the chat is closed and reopened', () => {
    component.openChat();
    (component as any).addUserMessage('Orders');

    component.closeChat();
    component.openChat();

    expect(component['timeline'].length).toBe(2);
  });

  it('includes a compact video embed for the By order ID option', () => {
    const category = component['chatData'].find((item: { id: string }) => item.id === 'orders') as any;
    const subOption = category?.subOptions?.[0]?.children?.find((child: { label: string }) => child.label === 'By order ID') as any;

    expect(category).toBeDefined();
    expect(subOption).toBeDefined();

    (component as any).handleSubOptionSelection(category, subOption);

    const botMessage = component['timeline'].find((item: any) => item.type === 'message' && item.message?.sender === 'bot') as
      | { type: 'message'; message: { sender: string; videoUrl?: unknown } }
      | undefined;

    expect(botMessage?.message?.videoUrl).toBeTruthy();
  });
});
