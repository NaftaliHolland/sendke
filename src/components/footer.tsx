import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_SHARE_URL =
  "https://wa.me/?text=" +
  encodeURIComponent(
    "Make a free payment poster for your till, paybill, or send money: https://send.ke"
  );

const Footer = () => {
  return (
    <div className="shrink-0 relative z-10">
      <div className="w-full py-3 md:py-2.5 bg-white/80 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
          <p className="font-medium text-gray-700 text-center sm:text-left">
            Know a business still showing their number on paper?
          </p>
          <a
            href={WHATSAPP_SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <FaWhatsapp className="w-4 h-4 mr-2" />
            Share on WhatsApp
          </a>
        </div>
      </div>
      <footer className="py-3 md:py-2 px-4">
        <p className="text-center text-sm text-gray-600">
          Made with ❤️ by{" "}
          <a
            href="https://davidamunga.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            David Amunga
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Footer;
