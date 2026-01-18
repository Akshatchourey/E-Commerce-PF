"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Bell, User, LogOut, Heart} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchCartCount, fetchWishlistCount } from "@/lib/api"; // Import the helper
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const router = useRouter();

  const updateCart = async () => {
    const count = await fetchCartCount();
    setCartCount(count);
  };

  const updateWishlist = async () => {
    const count = await fetchWishlistCount();
    setWishlistCount(count);
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    setIsLoggedIn(!!token);
    if (token) {
      updateCart();
      updateWishlist();
    }

    const handleCartUpdate = () => updateCart();
    const handleWishlistUpdate = (event) => {
      // Optimistically update count based on event detail
      if (event.detail && event.detail.action) {
        setWishlistCount(prev => 
          event.detail.action === "add" ? prev + 1 : Math.max(0, prev - 1)
        );
      } else {
        // Fallback: fetch full count if detail is not provided
        updateWishlist();
      }
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      const access_token = localStorage.getItem("access_token");

      if (refresh_token && access_token) {
        await fetch("http://127.0.0.1:8000/api/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
          },
          body: JSON.stringify({ refresh: refresh_token }),
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
      setIsLoggedIn(false);
      setCartCount(0);
      setWishlistCount(0);
      router.push("/");
    }
  };

  return (
    <nav className="w-full border-b bg-[#FFF9EF] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          <div className="shrink-0 flex items-center cursor-pointer" onClick={() => router.push("/homepage")}>
            <Image
              src="/logo.png"
              alt="Crafted Roots - Handcrafted products showcasing quality and tradition"
              width={80}
              height={5}
              className="object-contain"
            />
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={"bg-[#FFF9EF]"}>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[min(90vw,500px)] gap-3 p-4 sm:grid-cols-1 md:grid-cols-2 md:gap-4 bg-[#FFF9EF]">
                    <ListItem title="Wall Hangings" href="/shoppage?category=Decor">
                      Handcrafted wall decor
                    </ListItem>
                    <ListItem title="Bags" href="/shoppage?category=Bags">
                      Jute and Leather bags
                    </ListItem>
                    <ListItem title="Accessories" href="/shoppage?category=Accessories">
                      Wallets and keychains
                    </ListItem>
                    <ListItem title="All Products" href="/shoppage">
                      Browse our full collection
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground bg-[#FFF9EF]">
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-[#FFF9EF] px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div
            className={`transition-all duration-300 ease-in-out mx-6 ${
              isSearchExpanded ? 'flex-1 max-w-2xl' : 'flex-1 max-w-md'
            }`}
          >
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-muted-foreground w-4 h-4 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search products..."
                className={`pl-10 h-10 transition-all duration-300 ${isSearchExpanded ? 'bg-white' : ''}`}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(false)}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link href="/cartsystem/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs pointer-events-none"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs pointer-events-none"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {isLoggedIn ? (
              <>
                <Link href="/profile">
                    <Button variant="ghost" size="icon" title="My Profile">
                        <User className="h-5 w-5" />
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Logout"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/sign-in/login">
                    <Button variant="ghost" size="sm" className="font-semibold">
                        Log In
                    </Button>
                </Link>
                <Link href="/sign-in/signup">
                    <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                        Sign Up
                    </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function ListItem({ href, title, children }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}