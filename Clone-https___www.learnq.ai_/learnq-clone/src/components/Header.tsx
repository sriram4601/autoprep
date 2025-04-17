"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="py-4 border-b border-gray-100 bg-white z-50 sticky top-0">
      <div className="learnq-container flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            LearnQ<span className="text-sm">.ai</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <div className="relative group">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-primary">
              <span>For Students</span>
            </button>
          </div>

          <Link href="/institutes/digital-sat" className="text-gray-600 hover:text-primary">
            For Tutors/Institutes
          </Link>

          <Link href="/pricing" className="text-gray-600 hover:text-primary">
            Pricing
          </Link>

          <Link href="https://blogs.learnq.ai/" className="text-gray-600 hover:text-primary">
            Blog
          </Link>

          <Link href="https://discord.gg/5p3GwGEa2M" className="text-gray-600 hover:text-primary">
            Community
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="https://app.learnq.ai/">
              Login
            </Link>
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/90" asChild>
            <Link href="https://calendly.com/learnq-ai/product-demo">
              Schedule a Call
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col mt-6 space-y-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  For Students
                </Link>
                <Link
                  href="/institutes/digital-sat"
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  For Tutors/Institutes
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="https://blogs.learnq.ai/"
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="https://discord.gg/5p3GwGEa2M"
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Community
                </Link>
                <div className="pt-4 space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="https://app.learnq.ai/">
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full bg-primary text-white hover:bg-primary/90" asChild>
                    <Link href="https://calendly.com/learnq-ai/product-demo">
                      Schedule a Call
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
