import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const whatsappNumber = '919876543210'; // Replace with actual number
  const message = 'Hello DiploMate team! I need help with...';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-40 group"
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />

        {/* Button */}
        <div className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <MessageCircle className="h-7 w-7 text-white" fill="white" />
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-foreground text-background text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
            Need help? Chat with us!
          </div>
        </div>
      </div>
    </a>
  );
}
