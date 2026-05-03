import Link from "next/link";
import { RudowTransportLogo } from "./RudowTransportLogo";

const phone = process.env.NEXT_PUBLIC_PHONE || "7708861016";
const phoneDisplay = "770-886-1016";

export function SiteFooter() {
  return (
    <footer className="bg-rt-gray">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block max-w-[280px] focus:outline-none focus-visible:ring-2 focus-visible:ring-rt-navy focus-visible:ring-offset-2">
              <RudowTransportLogo className="!h-10 md:!h-11" />
            </Link>
            <p className="mt-4 max-w-xs font-body text-sm text-rt-text-mid">
              Nationwide freight and fleet logistics built for reliability, scale, and precision.
            </p>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-rt-navy">
              Head Office
            </h3>
            <address className="mt-4 not-italic font-body text-sm leading-relaxed text-rt-text-mid">
              5382 Winder Hwy
              <br />
              Flowery Branch, GA 30517
              <br />
              <a className="hover:text-rt-navy" href={`tel:${phone}`}>
                {phoneDisplay}
              </a>
              <br />
              <a className="hover:text-rt-navy" href="https://rudowtransportation.net">
                rudowtransportation.net
              </a>
            </address>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-rt-navy">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2 font-body text-sm text-rt-text-mid">
              <li>
                <Link className="hover:text-rt-navy" href="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-rt-navy" href="/about">
                  Projects
                </Link>
              </li>
              <li>
                <Link className="hover:text-rt-navy" href="/about">
                  About us
                </Link>
              </li>
              <li>
                <Link className="hover:text-rt-navy" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-rt-navy">
              Follow us
            </h3>
            <ul className="mt-4 space-y-2 font-body text-sm text-rt-text-mid">
              <li>
                <a className="hover:text-rt-navy" href="https://facebook.com">
                  Facebook
                </a>
              </li>
              <li>
                <a className="hover:text-rt-navy" href="https://instagram.com">
                  Instagram
                </a>
              </li>
              <li>
                <a className="hover:text-rt-navy" href="https://linkedin.com">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-rt-gray-mid bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-rt-text-mid md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p className="font-body">
            <span className="hover:text-rt-navy">Terms &amp; Conditions</span>
            <span className="mx-2">|</span>
            <span className="hover:text-rt-navy">Privacy Policy</span>
            <span className="mx-2">|</span>
            <span className="hover:text-rt-navy">Accessibility Statement</span>
          </p>
          <p className="font-body">© 2025 Rudow Transportation. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
