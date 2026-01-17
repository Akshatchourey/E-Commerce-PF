"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  HelpCircle
} from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.message) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/contact/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      alert("Something went wrong");
      return;
    }

    alert("Thank you for contacting us! We will get back to you soon.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

  } catch (error) {
    console.error(error);
    alert("Server error. Please try again later.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <Navbar/>
      <div className="text-center pt-16 pb-12">
        <h1 className="text-5xl md:text-6xl font-serif mb-4 text-gray-900">Get In Touch</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto px-6">
          Have a question or feedback? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <Card className="p-8 shadow-lg border-0 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-semibold">Send Us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Mobile Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="wholesale">Wholesale/Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-[180px] resize-none w-full px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>

                <p className="text-xs text-center text-gray-500">
                  We typically respond within 24 hours
                </p>
              </form>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-lg border-0 bg-white">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Stay connected with us on social media for updates, new products, and special offers.
                </p>
                
                <div className="flex gap-3">
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-amber-100 hover:bg-amber-600 flex items-center justify-center transition-colors group"
                  >
                    <Facebook className="w-5 h-5 text-amber-600 group-hover:text-white" />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-amber-100 hover:bg-amber-600 flex items-center justify-center transition-colors group"
                  >
                    <Instagram className="w-5 h-5 text-amber-600 group-hover:text-white" />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-amber-100 hover:bg-amber-600 flex items-center justify-center transition-colors group"
                  >
                    <Twitter className="w-5 h-5 text-amber-600 group-hover:text-white" />
                  </a>
                </div>
              </Card>
              <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-amber-600 to-amber-700 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Need Quick Answers?</h3>
                </div>
                <p className="text-amber-100 text-sm mb-4">
                  Check out our FAQ section for instant answers to common questions.
                </p>
                <Link href="/faq">
                  <Button variant="outline" className="w-full bg-white text-amber-700 hover:bg-amber-50 border-0 font-semibold">
                    Visit FAQ
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg border-0 bg-white sticky top-6">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                    <a href="mailto:test@gmail.com" className="text-gray-600 text-sm hover:text-amber-600 transition-colors block">
                      test@gmail.com
                    </a>
                    <a href="mailto:test2@gmail.com" className="text-gray-600 text-sm hover:text-amber-600 transition-colors block">
                      test2@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                    <a href="tel:+919999999999" className="text-gray-600 text-sm hover:text-amber-600 transition-colors block">
                      +91 999999999
                    </a>
                    <p className="text-gray-600 text-sm mt-1">Mon-Fri: 9AM - 6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Visit Us</h4>
                    <p className="text-gray-600 text-sm">
                      Address<br />
                      Mumbai<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-600 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <Link href="/shipping" className="text-sm text-gray-600 hover:text-amber-600 transition-colors block">
                    → Shipping Information
                  </Link>
                  <Link href="/returns" className="text-sm text-gray-600 hover:text-amber-600 transition-colors block">
                    → Returns & Refunds
                  </Link>
                  <Link href="/faq" className="text-sm text-gray-600 hover:text-amber-600 transition-colors block">
                    → Frequently Asked Questions
                  </Link>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-amber-600 transition-colors block">
                    → Privacy Policy
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <Card className="mt-8 p-0 shadow-lg border-0 bg-white overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.71637344999999!3d19.08219835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1736989000000!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mumbai Location Map"
          ></iframe>
        </Card>
      </div>
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-3xl font-serif mb-3">Stay Updated</h3>
            <p className="text-amber-100 max-w-md mx-auto">
              Subscribe to our newsletter for exclusive offers and latest updates
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="your@email.com"
              />
              <Button className="bg-white text-amber-700 hover:bg-amber-50 px-8 font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-2xl font-serif mb-4">CRAFTEDROOTS</h4>
              <p className="text-gray-400 text-sm">
                Premium quality products for your home and lifestyle.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Shop</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2026 CraftedRoots. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}