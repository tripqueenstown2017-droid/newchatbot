import { CHAT_DATA, ChatCategory, ChatSubOption, FALLBACK_OPTIONS } from './chat-data';

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
    this.addFallbackOptions();
  }
  
  private addFallbackOptions(): void {
    const fallbackOptions = FALLBACK_OPTIONS.map((fallback) => ({
      label: fallback.label,
      action: () => {
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


export interface FallbackOption {
  id: string;
  label: string;
  categoryId: string;
  url?: string;
}

export const FALLBACK_OPTIONS: FallbackOption[] = [
  { id: 'button-1', label: 'button-1', categoryId: 'orders', url: 'https://example.com/button-1' },
  { id: 'button-2', label: 'button-2', categoryId: 'billing', url: 'https://example.com/button-2' },
  { id: 'button-3', label: 'button-3', categoryId: 'product' }
];
  
