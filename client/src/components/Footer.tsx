import { BikeIcon, Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { footerData } from "../assets/assets";

const Footer = () => (
  <footer className="bg-app-green text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <BikeIcon className="text-white" size={24} />
            <span className="text-xl font-semibold">
              {footerData.brand.name}
            </span>
          </Link>
          <p className="text-sm text-white/70 mb-4">
            {footerData.brand.description}
          </p>
          <div className="flex gap-2">
            {footerData.brand.socials.map((social, index) => (
              <Link
                key={index}
                to={social.link}
                className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
              >
                <social.icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Dynamic Section */}
        {footerData.sections.map((section, i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            {section.links && (
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            {footerData.contact.map((contact, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/70">
                <contact.icon className="size-4 text-white" />
                {contact.text}
              </li>
            ))}
            </ul>
        </div>
      </div>
      {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-4 text-center text-sm text-white/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">{footerData.bottom.copyright}</p>
          <div className="flex gap-4">
            {footerData.bottom.links.map((link, i) => (
              <a key={i} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
              ))}
            </div>
        </div>
    </div>
  </footer>
);

export default Footer;
