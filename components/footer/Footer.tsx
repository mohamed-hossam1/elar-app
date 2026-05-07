import Image from "@/components/imageKit/ImageOptimization";
import Link from "next/link";
import Newsletter from "./Newsletter";

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Footer() {
  const footerLinks = [
    {
      title: "COMPANY",
      links: ["About", "Features", "Works", "Career"],
    },
    {
      title: "HELP",
      links: [
        "Customer Support",
        "Delivery Details",
        "Terms & Conditions",
        "Privacy Policy",
      ],
    },
    {
      title: "FAQ",
      links: ["Account", "Manage Deliveries", "Orders", "Payments"],
    },
  ];

  return (
    <footer className="w-full relative bg-hero-background pt-3 mt-40">
      <Newsletter />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-8 pb-12 border-b border-black/10">
          <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
            <Link
              href="/"
              className="text-3xl sm:text-4xl font-integral font-black tracking-widest"
            >
              ELAR
            </Link>
            <p className="text-black/60 font-satoshi text-sm sm:text-base leading-relaxed max-w-[250px]">
              Sophistication redefined. Experience a curated collection of premium fashion designed for the modern individual.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                aria-label="Follow us on Twitter"
              >
                <TwitterIcon className="w-5 h-5 fill-currentColor" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                aria-label="Follow us on Facebook"
              >
                <FacebookIcon className="w-5 h-5 fill-currentColor" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                aria-label="Follow us on Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                aria-label="Follow us on Github"
              >
                <GithubIcon className="w-5 h-5 fill-currentColor" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col gap-4 sm:gap-6">
                <h3 className="font-satoshi font-bold text-sm sm:text-base tracking-widest uppercase">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3 sm:gap-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-black/60 font-satoshi text-sm sm:text-base hover:text-black transition-all"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          <p className="text-black/60 font-satoshi text-sm text-center sm:text-left">
            ELAR © 2025, All Rights Reserved
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className=" px-2 py-1  flex items-center justify-center min-w-[50px] sm:min-w-[60px] h-[30px] sm:h-[35px]">
              <Image
                src="/vodafone-cash-logo.webp"
                alt="Vodafone Cash"
                width={40}
                height={25}
                className="object-contain"
              />
            </div>
            <div className=" px-2 py-1  flex items-center justify-center min-w-[50px] sm:min-w-[60px] h-[30px] sm:h-[35px]">
              <Image
                src="/instapay-logo.webp"
                alt="Instapay"
                width={40}
                height={25}
                className="object-contain"
              />
            </div>
            <div className=" px-3 py-1  flex items-center justify-center h-[30px] sm:h-[35px]">
              <span className="font-satoshi font-bold text-[10px] sm:text-[12px] whitespace-nowrap">
                CASH ON DELIVERY
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
