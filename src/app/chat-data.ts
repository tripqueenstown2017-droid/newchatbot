export interface ChatSubOption {
  label: string;
  reply: string;
  children?: ChatSubOption[];
}

export interface ChatCategory {
  id: string;
  label: string;
  prompt: string;
  subOptions: ChatSubOption[];
}

export const CHAT_DATA: ChatCategory[] = [
  {
    id: 'orders',
    label: 'Orders',
    prompt: 'Choose an order topic:',
    subOptions: [
      {
        label: 'Track an order',
        reply: 'Please choose how you want to track it:',
        children: [
          { label: 'By order ID', reply: 'Enter your order ID and I will check the latest delivery status.' },
          { label: 'By phone number', reply: 'Use the phone number linked to your order for a quick status check.' },
          { label: 'By email', reply: 'I can look it up using the email address used at checkout.' }
        ]
      },
      {
        label: 'Cancel an order',
        reply: 'Please choose a cancellation step:',
        children: [
          { label: 'Before dispatch', reply: 'If the order has not been dispatched yet, you can cancel it from your orders page.' },
          { label: 'After dispatch', reply: 'Once dispatched, cancellation may not be possible, but return options may be available.' },
          { label: 'Need help', reply: 'I can guide you to the cancellation policy and next steps.' }
        ]
      },
      {
        label: 'Return a product',
        reply: 'Please choose a return reason:',
        children: [
          { label: 'Damaged item', reply: 'Select damaged item to start the return request and upload a photo if needed.' },
          { label: 'Wrong item', reply: 'If you received the wrong product, I can help you file a return request.' },
          { label: 'Changed my mind', reply: 'Returns for a change of mind depend on the return window for this product.' }
        ]
      }
    ]
  },
  {
    id: 'billing',
    label: 'Billing',
    prompt: 'Choose a billing topic:',
    subOptions: [
      {
        label: 'View invoice',
        reply: 'Please choose which invoice action you need:',
        children: [
          { label: 'Current invoice', reply: 'Your current invoice is available in the billing section of your account.' },
          { label: 'Previous invoice', reply: 'I can help you find older invoices from your billing history.' },
          { label: 'Download PDF', reply: 'Use the download option to save the invoice as a PDF.' }
        ]
      },
      {
        label: 'Refund status',
        reply: 'Please choose a refund status check:',
        children: [
          { label: 'Pending refund', reply: 'Pending refunds usually appear within 3 to 5 business days after approval.' },
          { label: 'Processed refund', reply: 'Processed refunds are already sent back to your original payment method.' },
          { label: 'Need timeline', reply: 'Tell me the payment method and I will estimate the refund timeline.' }
        ]
      },
      {
        label: 'Update payment method',
        reply: 'Please choose the payment method you want to update:',
        children: [
          { label: 'Card', reply: 'You can replace or update your saved card in payment settings.' },
          { label: 'UPI', reply: 'You can add or change your UPI ID in the payment methods section.' },
          { label: 'Wallet', reply: 'Wallet updates are available from the payment settings screen.' }
        ]
      }
    ]
  },
  {
    id: 'product',
    label: 'Product Help',
    prompt: 'Choose a product topic:',
    subOptions: [
      {
        label: 'Product features',
        reply: 'Please choose a feature area:',
        children: [
          { label: 'Core features', reply: 'I can walk you through the core features and what they do.' },
          { label: 'Advanced features', reply: 'Advanced features are available depending on your plan or device.' },
          { label: 'What is new', reply: 'I can share the newest updates and improvements.' }
        ]
      },
      {
        label: 'Setup help',
        reply: 'Please choose your device type:',
        children: [
          { label: 'Mobile', reply: 'Setup on mobile is quick. Tell me Android or iPhone and I will guide you.' },
          { label: 'Desktop', reply: 'Desktop setup usually takes a few steps. I can walk you through it.' },
          { label: 'Tablet', reply: 'Tablet setup is similar to mobile. I can help you get started.' }
        ]
      },
      {
        label: 'Troubleshooting',
        reply: 'Please choose the issue type:',
        children: [
          { label: 'Login issue', reply: 'For login issues, check your credentials and password reset options first.' },
          { label: 'App crash', reply: 'If the app crashes, try reinstalling or clearing the cache.' },
          { label: 'Performance issue', reply: 'If things are slow, check network speed and device storage.' }
        ]
      }
    ]
  },
  {
    id: 'support',
    label: 'Support',
    prompt: 'Choose a support topic:',
    subOptions: [
      {
        label: 'Contact support',
        reply: 'Please choose how to reach support:',
        children: [
          { label: 'Live chat', reply: 'Live chat is available during support hours from the help center.' },
          { label: 'Email', reply: 'You can email support and include screenshots for faster help.' },
          { label: 'Phone', reply: 'Phone support is available for urgent issues in selected regions.' }
        ]
      },
      {
        label: 'Report a bug',
        reply: 'Please choose the bug details you want to share:',
        children: [
          { label: 'Screenshot', reply: 'Please attach a screenshot so the team can inspect the issue.' },
          { label: 'Steps to reproduce', reply: 'Share the steps you followed and I will capture them for the report.' },
          { label: 'Device info', reply: 'Device and browser details help us reproduce the bug faster.' }
        ]
      },
      {
        label: 'Feature request',
        reply: 'Please choose what kind of feature request you want to submit:',
        children: [
          { label: 'UI improvement', reply: 'I can log a request for a visual or layout improvement.' },
          { label: 'New workflow', reply: 'I can capture a request for a new workflow or automation.' },
          { label: 'Integrations', reply: 'I can record a request for a new integration or connector.' }
        ]
      }
    ]
  }
];