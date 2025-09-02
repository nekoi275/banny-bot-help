export {};
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        openInvoice(url: string),
        close()
      };
    };
  }
}