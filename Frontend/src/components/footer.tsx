"use client";
import {
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandLinkedin,
} from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 pl-10 pr-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p>
              We are revolutionizing patient care through IoT and AI technology,
              offering continuous monitoring, personalized rehab routines, and
              real-time consultations.
            </p>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Features</h3>
            <ul>
              <li>
                <a href="#monitoring" className="hover:underline">
                  Real-Time Monitoring
                </a>
              </li>
              <li>
                <a href="#rehab" className="hover:underline">
                  AI-Based Rehab Routines
                </a>
              </li>
              <li>
                <a href="#ocr" className="hover:underline">
                  OCR-Powered Report Uploads
                </a>
              </li>
              <li>
                <a href="#video-call" className="hover:underline">
                  Video Consultations
                </a>
              </li>
              <li>
                <a href="#fall-detection" className="hover:underline">
                  Fall Detection Alerts
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul>
              <li>Email: support@healthcareiot.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Health St., Tech City</li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <IconBrandTwitter className="h-6 w-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <IconBrandFacebook className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <IconBrandLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p>&copy; 2024 Healthcare IoT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
