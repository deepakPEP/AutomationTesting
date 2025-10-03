export enum PaymentOption {
  CREDIT_CARD= 'credit',
  CASH= 'cash',
  CHEQUE = 'cheque',
  DEMAND_DRAFT = 'demandDraft',
  PAYPAL = 'paypal',
  MONEY_GRAM = 'moneyGram',
  WESTERN_UNION = 'westernUnion',
  OTHERS = 'others'
}
export function mapPaymentOption(value: string): PaymentOption | undefined {
  // Try to match the value to a valid PaymentOption enum
  switch(value.toLowerCase()) {
    case 'credit':
      return PaymentOption.CREDIT_CARD;
    case 'cash':
      return PaymentOption.CASH;
    case 'cheque':
      return PaymentOption.CHEQUE;
    case 'demanddraft':
      return PaymentOption.DEMAND_DRAFT;
    case 'paypal':
      return PaymentOption.PAYPAL;
    case 'moneygram':
      return PaymentOption.MONEY_GRAM;
    case 'westernunion':
      return PaymentOption.WESTERN_UNION;
    case 'others':
      return PaymentOption.OTHERS;
    default:
      return undefined; // Return undefined if not a valid value
  }
}