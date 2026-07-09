import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CHAT_DATA, ChatCategory, ChatSubOption, FALLBACK_OPTIONS } from './chat-data';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  timestamp?: string;
}

type TimelineItem =
  | { type: 'message'; message: ChatMessage }
  | { type: 'options'; options: ChatAction[] };

interface ChatAction {
  label: string;
  action: () => void;
}

interface MatchedSubOption {
  category: ChatCategory;
  option: ChatSubOption;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('chatMessages', { static: false }) private chatMessagesContainer?: ElementRef<HTMLElement>;
  protected isChatOpen = false;
  protected timeline: TimelineItem[] = [];
  protected activeCategory: ChatCategory | null = null;
  protected chatToggleLeft = this.getInitialToggleLeft();
  protected chatToggleTop = this.getInitialToggleTop();
  protected showIntro = false;
  protected introComplete = false;
  protected introFadeOut = false;

  private lastTimestampDateKey: string | null = null;
  private introCompleteTimerId?: number;
  private introFadeOutTimerId?: number;

  private readonly chatData = CHAT_DATA;
  private isDraggingToggle = false;
  private didDragToggle = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private dragStartX = 0;
  private dragStartY = 0;
  private suppressNextToggleClick = false;
  private hasInitializedConversation = false;

  openChat(): void {
    this.isChatOpen = true;

    if (!this.hasInitializedConversation) {
      this.showIntro = true;
      this.introComplete = false;
      this.introFadeOut = false;
      this.clearIntroTimers();

      this.introCompleteTimerId = window.setTimeout(() => {
        this.onIntroAnimationEnd();
      }, 3200);
    } else {
      this.showIntro = false;
      this.introComplete = true;
    }
  }

  closeChat(): void {
    this.isChatOpen = false;
    this.showIntro = false;
    this.introComplete = false;
    this.clearIntroTimers();
  }

  handleAction(action: ChatAction): void {
    action.action();
    this.scrollToBottom();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.chatMessagesContainer) {
      setTimeout(() => {
        const element = this.chatMessagesContainer?.nativeElement;
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
      }, 0);
    }
  }

  startToggleDrag(event: PointerEvent): void {
    event.preventDefault();
    this.isDraggingToggle = true;
    this.didDragToggle = false;
    this.dragOffsetX = event.clientX - this.chatToggleLeft;
    this.dragOffsetY = event.clientY - this.chatToggleTop;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
  }

  onToggleClick(event: MouseEvent): void {
    if (this.suppressNextToggleClick) {
      event.preventDefault();
      event.stopPropagation();
      this.suppressNextToggleClick = false;
      return;
    }

    this.openChat();
  }

  private clearIntroTimers(): void {
    if (this.introCompleteTimerId !== undefined) {
      window.clearTimeout(this.introCompleteTimerId);
      this.introCompleteTimerId = undefined;
    }

    if (this.introFadeOutTimerId !== undefined) {
      window.clearTimeout(this.introFadeOutTimerId);
      this.introFadeOutTimerId = undefined;
    }
  }

  protected onIntroAnimationEnd(): void {
    if (!this.introComplete) {
      this.introComplete = true;
      this.introFadeOut = true;

      if (this.timeline.length === 0) {
        this.resetConversation();
        this.hasInitializedConversation = true;
      }

      this.scrollToBottom();

      this.introFadeOutTimerId = window.setTimeout(() => {
        this.showIntro = false;
        this.introFadeOut = false;
      }, 600);
    }
  }

  sendTypedMessage(text: string): void {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    this.addUserMessage(trimmedText);

    const matchedCategory = this.findCategoryMatch(trimmedText);
    if (matchedCategory) {
      this.showSubOptions(matchedCategory);
      return;
    }

    const matchedSubOption = this.findSubOptionMatch(trimmedText);
    if (matchedSubOption) {
      this.handleSubOptionSelection(matchedSubOption.category, matchedSubOption.option);
      return;
    }

    this.addBotMessage('I can only answer from the local menu data. Try typing a topic like Orders, Billing, Product Help, or Support.');
    this.addBotMessage('choose from potions11111');
    this.addFallbackOptions();
  }

  private addFallbackOptions(): void {
    const fallbackOptions = FALLBACK_OPTIONS.map((fallback) => ({
      label: fallback.label,
      action: () => {
        this.addUserMessage(fallback.label);

        if (fallback.id === 'button-3') {
          this.addBotMessage('connecting to help desk');
          return;
        }

        if (fallback.url) {
          window.open(fallback.url, '_blank', 'noopener');
          return;
        }

        const category = this.chatData.find((item) => item.id === fallback.categoryId);
        if (category) {
          this.showSubOptions(category);
        }
      }
    }));

    this.addOptions(fallbackOptions);
  }

  private resetConversation(): void {
    this.activeCategory = null;
    const initialOptions = this.pickRandomItems(this.chatData, 3).map((category) => ({
      label: category.label,
      action: () => this.showSubOptions(category)
    }));

    this.timeline = [
      {
        type: 'message',
        message: {
          sender: 'bot',
          text: `Hi User,

I'm Bot and I'm here to help.

I'm always learning, but if I can't find the right answer, I will connect you to a Help Desk agent.

Select a topic or type a question to get started:`
        }
      },
      { type: 'options', options: initialOptions }
    ];
  }

  private showSubOptions(category: ChatCategory): void {
    this.activeCategory = category;
    this.addUserMessage(category.label);
    this.addBotMessage(category.prompt);

    this.addOptions(
      category.subOptions.map((subOption) => ({
        label: subOption.label,
        action: () => this.selectSubOption(category, subOption)
      }))
    );
  }

  private selectSubOption(category: ChatCategory, subOption: ChatSubOption): void {
    this.handleSubOptionSelection(category, subOption);
  }

  private findCategoryMatch(text: string): ChatCategory | null {
    const lowerText = text.toLowerCase();

    return this.chatData.find((category) => {
      const lowerLabel = category.label.toLowerCase();
      const lowerId = category.id.toLowerCase();
      return lowerText.includes(lowerLabel) || lowerText.includes(lowerId);
    }) ?? null;
  }

  private findSubOptionMatch(text: string): MatchedSubOption | null {
    const lowerText = text.toLowerCase();

    for (const category of this.chatData) {
      const subOption = this.findMatchingSubOption(category.subOptions, lowerText);
      if (subOption) {
        return { category, option: subOption };
      }
    }

    return null;
  }

  private findMatchingSubOption(options: ChatSubOption[], lowerText: string): ChatSubOption | null {
    for (const option of options) {
      if (lowerText.includes(option.label.toLowerCase())) {
        return option;
      }

      if (option.children) {
        const childMatch = this.findMatchingSubOption(option.children, lowerText);
        if (childMatch) {
          return childMatch;
        }
      }
    }

    return null;
  }

  private handleSubOptionSelection(category: ChatCategory, subOption: ChatSubOption): void {
    this.addUserMessage(subOption.label);

    if (Array.isArray(subOption.reply)) {
      subOption.reply.forEach((replyText) => this.addBotMessage(replyText));
    } else {
      this.addBotMessage(subOption.reply);
    }

    this.activeCategory = category;

    if (subOption.children && subOption.children.length > 0) {
      const nextOptions = subOption.children.map((childOption) => ({
        label: childOption.label,
        action: () => this.handleSubOptionSelection(category, childOption)
      }));

      this.addOptions(nextOptions);
      return;
    }

    //this.addOptions([{ label: 'Back to main options', action: () => this.resetConversation() }]);
  }

  private pickRandomItems<T>(items: readonly T[], count: number): T[] {
    const pool = [...items];

    for (let index = pool.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
    }

    return pool.slice(0, Math.min(count, pool.length));
  }

  @HostListener('window:pointermove', ['$event'])
  onWindowPointerMove(event: PointerEvent): void {
    if (!this.isDraggingToggle) {
      return;
    }

    const movedDistance = Math.max(
      Math.abs(event.clientX - this.dragStartX),
      Math.abs(event.clientY - this.dragStartY)
    );

    if (movedDistance > 4) {
      this.didDragToggle = true;
    }

    this.chatToggleLeft = this.clampTogglePosition(event.clientX - this.dragOffsetX, window.innerWidth - 66);
    this.chatToggleTop = this.clampTogglePosition(event.clientY - this.dragOffsetY, window.innerHeight - 66);
  }

  @HostListener('window:pointerup')
  onWindowPointerUp(): void {
    if (!this.isDraggingToggle) {
      return;
    }

    this.isDraggingToggle = false;
    this.suppressNextToggleClick = this.didDragToggle;
    this.didDragToggle = false;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.chatToggleLeft = this.clampTogglePosition(this.chatToggleLeft, window.innerWidth - 66);
    this.chatToggleTop = this.clampTogglePosition(this.chatToggleTop, window.innerHeight - 66);
  }

  private getInitialToggleLeft(): number {
    return typeof window === 'undefined' ? 20 : window.innerWidth - 86;
  }

  private getInitialToggleTop(): number {
    return typeof window === 'undefined' ? 20 : window.innerHeight - 86;
  }

  private addMessage(message: ChatMessage): void {
    this.timeline = [...this.timeline, { type: 'message', message }];
  }

  private addOptions(options: ChatAction[]): void {
    this.timeline = [...this.timeline, { type: 'options', options }];
  }

  private addUserMessage(text: string): void {
    const timestamp = this.shouldAddTimestamp() ? this.getCurrentTimestamp() : undefined;

    this.addMessage({ sender: 'user', text, timestamp });
  }

  private addBotMessage(text: string): void {
    this.addMessage({ sender: 'bot', text });
  }

  private shouldAddTimestamp(): boolean {
    const todayKey = this.getTodayKey();

    if (this.lastTimestampDateKey === todayKey) {
      return false;
    }

    this.lastTimestampDateKey = todayKey;
    return true;
  }

  private getTodayKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  private getCurrentTimestamp(): string {
    const now = new Date();
    const datePart = now.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
    const timePart = now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });

    return `${datePart} | ${timePart}`;
  }

  private clampTogglePosition(value: number, max: number): number {
    return Math.max(0, Math.min(value, Math.max(0, max)));
  }
}