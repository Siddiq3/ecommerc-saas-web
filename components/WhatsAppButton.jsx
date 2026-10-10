export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919705116606"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E] motion-reduce:transition-none lg:h-16 lg:w-16"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 lg:h-10 lg:w-10" aria-hidden="true">
        <path d="M20.52 3.48A11.87 11.87 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.96L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.69 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.42ZM12.06 21.8a9.88 9.88 0 0 1-5.04-1.38l-.36-.22-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.89 9.9-9.89a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.89-9.9 9.89Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.89-.8-1.49-1.78-1.66-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.62.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
