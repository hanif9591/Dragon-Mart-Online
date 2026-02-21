"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Star,
  X,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Filter,
  ChevronDown,
  User,
  LogOut,
  Package,
  Settings,
  Upload,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

/**
 * Dragon Mart Online — demo storefront (front-end only)
 * ✅ Add products from Admin
 * ✅ Multiple pictures + multiple videos per product
 * ✅ Delete product
 * ✅ New categories: Auto Spare Parts, Toys and Games
 */

function DragonMartLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/10 grid place-items-center ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 14c2.8-5.6 7.2-8.4 12-9-1.2 2.6-1.8 4.9-1.8 7.2C16.2 17 12.3 20 8.3 20c-2 0-3.6-0.7-4.3-2.1-.5-1 .2-2.6 2-3.9Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M10.2 10.5c.8-1.4 2.1-2.7 3.8-3.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16.8 12.2c.8.4 1.4 1 1.8 1.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

const CATEGORIES = [
  "All",
  "Electronics",
  "Home",
  "Fashion",
  "Beauty",
  "Sports",
  "Books",
  "Auto Spare Parts",
  "Toys and Games",
];

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  prime: boolean;
  stock: number;
  img: string;
  images?: string[];
  videos?: string[];
  desc: string;
};

type Order = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: { productId: string; title: string; qty: number; price: number }[];
  userEmail: string;
};

const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Noise-Cancelling Wireless Headphones",
    category: "Electronics",
    price: 899,
    rating: 4.6,
    reviews: 18342,
    prime: true,
    stock: 14,
    img: "https://images.unsplash.com/photo-1518441902117-f0a9e9f8d1d4?auto=format&fit=crop&w=1200&q=60",
    images: [
      "https://images.unsplash.com/photo-1518441902117-f0a9e9f8d1d4?auto=format&fit=crop&w=1200&q=60",
    ],
    videos: [],
    desc:
      "Immersive sound, all-day comfort, and adaptive noise cancelling for work, travel, and everything in between.",
  },
  {
    id: "p2",
    title: "Smart LED Strip Lights (5m)",
    category: "Home",
    price: 109,
    rating: 4.4,
    reviews: 9251,
    prime: true,
    stock: 67,
    img: "https://images.unsplash.com/photo-1559245010-6564f5d4f8c5?auto=format&fit=crop&w=1200&q=60",
    images: [
      "https://images.unsplash.com/photo-1559245010-6564f5d4f8c5?auto=format&fit=crop&w=1200&q=60",
    ],
    videos: [],
    desc:
      "Sync colors to your mood. Voice control, scenes, and easy setup for bedrooms, desks, and gaming rooms.",
  },
  {
    id: "p3",
    title: "Stainless Steel Water Bottle (1L)",
    category: "Sports",
    price: 69,
    rating: 4.8,
    reviews: 40210,
    prime: false,
    stock: 120,
    img: "https://images.unsplash.com/photo-1526401485004-2fda9f6d3d38?auto=format&fit=crop&w=1200&q=60",
    images: [
      "https://images.unsplash.com/photo-1526401485004-2fda9f6d3d38?auto=format&fit=crop&w=1200&q=60",
    ],
    videos: [],
    desc:
      "Double-wall insulation keeps drinks cold for up to 24h. Leak-proof cap and durable powder coat.",
  },
];

function formatMoneyAED(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "AED" });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const idx = i + 1;
    const filled = idx <= full || (idx === full + 1 && half);
    return (
      <Star
        key={i}
        className={`h-4 w-4 ${filled ? "" : "opacity-30"}`}
        fill={filled ? "currentColor" : "none"}
      />
    );
  });
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

function useSession() {
  const [session, setSession] = useState<any>(() => {
    try {
      const raw = localStorage.getItem("dmo_session");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("dmo_session", JSON.stringify(session));
    } catch {}
  }, [session]);

  return { session, setSession };
}

function TopNav({
  query,
  setQuery,
  category,
  setCategory,
  cartCount,
  onOpenCart,
  page,
  setPage,
  session,
  onOpenAuth,
  onLogout,
}: {
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  page: string;
  setPage: (v: string) => void;
  session: any;
  onOpenAuth: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="sticky top-0 z-40">
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <button onClick={() => setPage("home")} className="flex items-center gap-2">
            <DragonMartLogo />
            <div className="leading-tight text-left">
              <div className="font-black tracking-tight">Dragon Mart Online</div>
              <div className="text-xs text-white/70">Deliver to UAE</div>
            </div>
          </button>

          <div className="flex-1 flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="rounded-2xl bg-white/15 hover:bg-white/20 text-white">
                  <span className="text-sm">{category}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {CATEGORIES.map((c) => (
                  <DropdownMenuItem
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setPage("home");
                    }}
                    className={c === category ? "font-semibold" : ""}
                  >
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative w-full">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage("home");
                }}
                placeholder="Search products, brands and more"
                className="pl-9 rounded-2xl bg-white text-black"
              />
            </div>
          </div>

          <Button onClick={onOpenCart} variant="secondary" className="relative rounded-2xl bg-white/15 hover:bg-white/20 text-white">
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-white text-zinc-900 text-xs grid place-items-center font-bold">
                {cartCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="rounded-2xl bg-white/15 hover:bg-white/20 text-white">
                <User className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">{session ? session.name : "Account"}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {!session ? (
                <DropdownMenuItem onClick={onOpenAuth}>
                  <User className="h-4 w-4 mr-2" /> Login / Signup
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={() => setPage("orders")}
                    className={page === "orders" ? "font-semibold" : ""}
                  >
                    <Package className="h-4 w-4 mr-2" /> Orders
                  </DropdownMenuItem>
                  {session.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => setPage("admin")}
                      className={page === "admin" ? "font-semibold" : ""}
                    >
                      <Settings className="h-4 w-4 mr-2" /> Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-red-800 text-white/90 border-b border-red-700">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage("home");
              }}
              className={`whitespace-nowrap text-sm px-3 py-1 rounded-2xl transition ${
                c === category ? "bg-white/15 text-white" : "hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1"><Truck className="h-4 w-4" /> Fast delivery</div>
            <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Secure payments</div>
            <div className="flex items-center gap-1"><RotateCcw className="h-4 w-4" /> Easy returns</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ onShop }: { onShop: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 to-orange-500 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_35%),radial-gradient(circle_at_70%_60%,white,transparent_35%)]" />
        <div className="relative p-6 md:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Deals updated daily
            </div>
            <h1 className="mt-4 text-2xl md:text-4xl font-black tracking-tight">
              Dragon Mart Online — shop smart, save big.
            </h1>
            <p className="mt-3 text-white/80">
              Amazon-style UI with search, filters, cart, login, orders, and admin upload.
            </p>
            <div className="mt-5 flex gap-2">
              <Button onClick={onShop} className="rounded-2xl bg-white text-zinc-900 hover:bg-white/90">
                Shop now
              </Button>
              <Button variant="secondary" className="rounded-2xl bg-white/15 hover:bg-white/20 text-white">
                View categories
              </Button>
            </div>
          </div>
          <div className="rounded-3xl bg-white/10 p-4">
            <div className="grid grid-cols-2 gap-3">
              {["Prime picks", "Top rated", "Home refresh", "New arrivals"].map((t) => (
                <div key={t} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold">
                  {t}
                  <div className="mt-2 text-xs font-normal text-white/70">Save up to 40%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ p, onQuickView, onAdd }: { p: Product; onQuickView: (p: Product) => void; onAdd: (p: Product) => void }) {
  return (
    <motion.div layout>
      <Card className="rounded-3xl overflow-hidden shadow-sm">
        <div className="relative">
          <img src={p.img} alt={p.title} className="h-44 w-full object-cover" loading="lazy" />
          <div className="absolute top-3 left-3 flex gap-2">
            {p.prime && <Badge className="rounded-full">Prime</Badge>}
            {p.stock <= 10 && (
              <Badge variant="destructive" className="rounded-full">Low stock</Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="text-sm font-semibold line-clamp-2">{p.title}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-lg font-black">{formatMoneyAED(p.price)}</div>
            <div className="text-xs text-muted-foreground">{p.category}</div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Stars value={p.rating} />
            <span className="text-xs text-muted-foreground">
              {p.rating.toFixed(1)} ({p.reviews.toLocaleString()})
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="rounded-2xl" onClick={() => onAdd(p)}>Add to cart</Button>
            <Button variant="secondary" className="rounded-2xl" onClick={() => onQuickView(p)}>View</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function sortLabel(sort: string) {
  if (sort === "price_asc") return "Low → High";
  if (sort === "price_desc") return "High → Low";
  if (sort === "rating_desc") return "Rating";
  return "Featured";
}

function FiltersBar({
  sort,
  setSort,
  onlyPrime,
  setOnlyPrime,
  priceMax,
  setPriceMax,
}: {
  sort: string;
  setSort: (v: string) => void;
  onlyPrime: boolean;
  setOnlyPrime: React.Dispatch<React.SetStateAction<boolean>>;
  priceMax: number;
  setPriceMax: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 mt-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Filter className="h-4 w-4 opacity-70" />
          <span className="font-semibold">Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant={onlyPrime ? "default" : "secondary"} className="rounded-2xl" onClick={() => setOnlyPrime((v) => !v)}>
            Prime
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="rounded-2xl">
                Sort: {sortLabel(sort)} <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {[
                { id: "featured", label: "Featured" },
                { id: "price_asc", label: "Price: Low to High" },
                { id: "price_desc", label: "Price: High to Low" },
                { id: "rating_desc", label: "Rating" },
              ].map((o) => (
                <DropdownMenuItem key={o.id} onClick={() => setSort(o.id)} className={o.id === sort ? "font-semibold" : ""}>
                  {o.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2">
            <span className="text-sm font-semibold">Max:</span>
            <input
              type="range"
              min={20}
              max={1500}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
            />
            <span className="text-sm font-black">{formatMoneyAED(priceMax)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSheet({
  open,
  setOpen,
  items,
  onInc,
  onDec,
  onRemove,
  total,
  onCheckout,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  items: { product: Product; qty: number }[];
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  total: number;
  onCheckout: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Your Cart</span>
            <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
              Your cart is empty. Add a few items to see them here.
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 rounded-2xl border p-3">
                <img src={product.img} alt={product.title} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold line-clamp-2">{product.title}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-sm font-black">{formatMoneyAED(product.price)}</div>
                    <Button variant="ghost" className="h-8 rounded-2xl" onClick={() => onRemove(product.id)}>
                      Remove
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="secondary" size="icon" className="rounded-2xl" onClick={() => onDec(product.id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="min-w-10 text-center font-semibold">{qty}</div>
                    <Button variant="secondary" size="icon" className="rounded-2xl" onClick={() => onInc(product.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 rounded-2xl border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Subtotal</div>
            <div className="text-lg font-black">{formatMoneyAED(total)}</div>
          </div>
          <div className="mt-3">
            <Button className="w-full rounded-2xl" disabled={items.length === 0} onClick={onCheckout}>
              Checkout (Stripe)
            </Button>
            <div className="mt-2 text-xs text-muted-foreground">Demo mode—connect Stripe backend to charge.</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function toYouTubeEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function ProductDialog({
  open,
  setOpen,
  product,
  onAdd,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  product: Product | null;
  onAdd: (p: Product) => void;
}) {
  const gallery = product?.images?.length ? product.images : product ? [product.img] : [];
  const videos = product?.videos?.length ? product.videos : [];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
  }, [product?.id]);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">{product.title}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="rounded-3xl overflow-hidden border">
              <img
                src={gallery[Math.min(activeIdx, Math.max(gallery.length - 1, 0))]}
                alt={product.title}
                className="h-72 w-full object-cover"
              />
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {gallery.slice(0, 10).map((u, i) => (
                  <button
                    key={`${u}_${i}`}
                    onClick={() => setActiveIdx(i)}
                    className={`rounded-2xl overflow-hidden border ${i === activeIdx ? "ring-2 ring-orange-400" : ""}`}
                    title={`Image ${i + 1}`}
                  >
                    <img src={u} alt={`thumb ${i + 1}`} className="h-14 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {videos.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="text-sm font-semibold">Product videos</div>
                {videos.map((v, idx) => {
                  const embed = toYouTubeEmbed(v);
                  if (embed) {
                    return (
                      <iframe
                        key={`${v}_${idx}`}
                        className="w-full aspect-video rounded-2xl border"
                        src={embed}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={`video_${idx}`}
                      />
                    );
                  }
                  return (
                    <video key={`${v}_${idx}`} className="w-full rounded-2xl border" controls>
                      <source src={v} />
                    </video>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Stars value={product.rating} />
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} • {product.reviews.toLocaleString()} reviews
              </span>
            </div>

            <div className="mt-3 text-2xl font-black">{formatMoneyAED(product.price)}</div>

            <div className="mt-3 flex gap-2 flex-wrap">
              {product.prime && <Badge className="rounded-full">Prime</Badge>}
              <Badge variant="secondary" className="rounded-full">{product.category}</Badge>
              <Badge variant={product.stock > 10 ? "secondary" : "destructive"} className="rounded-full">
                {product.stock > 10 ? "In stock" : "Limited"}
              </Badge>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.desc}</p>

            <div className="mt-5 grid gap-2">
              <Button className="rounded-2xl" onClick={() => onAdd(product)}>
                Add to cart
              </Button>
              <Button variant="secondary" className="rounded-2xl">
                Buy now
              </Button>
              <div className="mt-2 text-xs text-muted-foreground">Delivery estimate: 2–4 days (demo)</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AuthDialog({ open, setOpen, setSession }: { open: boolean; setOpen: (v: boolean) => void; setSession: (s: any) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("Hanif");
  const [email, setEmail] = useState("hanif@example.com");
  const [password, setPassword] = useState("password");
  const [asAdmin, setAsAdmin] = useState(false);

  function submit() {
    setSession({ id: "demo_user", name: name || "User", email, role: asAdmin ? "admin" : "customer" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">{mode === "login" ? "Login" : "Create account"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {mode === "signup" && (
            <div>
              <div className="text-sm font-semibold">Full name</div>
              <Input className="rounded-2xl" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}

          <div>
            <div className="text-sm font-semibold">Email</div>
            <Input className="rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <div className="text-sm font-semibold">Password</div>
            <Input type="password" className="rounded-2xl" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={asAdmin} onChange={(e) => setAsAdmin(e.target.checked)} />
            Login as admin (demo)
          </label>

          <Button className="w-full rounded-2xl" onClick={submit}>
            {mode === "login" ? "Login" : "Sign up"}
          </Button>

          <div className="text-xs text-muted-foreground">Demo only (no real password). Tick “Login as admin” to access Admin page.</div>

          <div className="flex justify-between text-sm">
            <button className="underline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Create an account" : "I already have an account"}
            </button>
            <button className="underline" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OrdersPage({ orders }: { orders: Order[] }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
      <div className="text-2xl font-black">Orders</div>
      <div className="mt-5 grid gap-4">
        {orders.length === 0 ? (
          <Card className="rounded-3xl">
            <CardContent className="p-5 text-sm text-muted-foreground">
              No orders yet. Complete a checkout to see your order history.
            </CardContent>
          </Card>
        ) : (
          orders.map((o) => (
            <Card key={o.id} className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{o.id}</span>
                  <Badge className="rounded-full">{o.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="text-sm text-muted-foreground">Placed: {new Date(o.createdAt).toLocaleString()}</div>
                <div className="mt-2 font-black text-lg">{formatMoneyAED(o.total)}</div>
                <div className="mt-3 grid gap-2">
                  {o.items.map((it) => (
                    <div key={it.productId} className="flex items-center justify-between text-sm">
                      <div className="line-clamp-1">{it.title}</div>
                      <div className="text-muted-foreground">x{it.qty}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function AdminPage({
  products,
  onCreateProduct,
  onDeleteProduct,
}: {
  products: Product[];
  onCreateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState<number>(99);
  const [stock, setStock] = useState<number>(10);
  const [prime, setPrime] = useState(true);

  const [imgUrl, setImgUrl] = useState(
    "https://images.unsplash.com/photo-1518441902117-f0a9e9f8d1d4?auto=format&fit=crop&w=1200&q=60"
  );

  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [desc, setDesc] = useState("New product description...");

  function addImageField() {
    setExtraImages((xs) => [...xs, ""]);
  }
  function updateImageField(i: number, v: string) {
    setExtraImages((xs) => xs.map((x, idx) => (idx === i ? v : x)));
  }
  function removeImageField(i: number) {
    setExtraImages((xs) => xs.filter((_, idx) => idx !== i));
  }

  function addVideoField() {
    setVideos((xs) => [...xs, ""]);
  }
  function updateVideoField(i: number, v: string) {
    setVideos((xs) => xs.map((x, idx) => (idx === i ? v : x)));
  }
  function removeVideoField(i: number) {
    setVideos((xs) => xs.filter((_, idx) => idx !== i));
  }

  function submit() {
    if (!title.trim()) return;

    const cleanedImages = [imgUrl, ...extraImages].map((s) => (s || "").trim()).filter(Boolean);
    const cleanedVideos = videos.map((s) => (s || "").trim()).filter(Boolean);

    onCreateProduct({
      id: `p_${Math.random().toString(16).slice(2)}`,
      title,
      category,
      price: Number(price),
      rating: 4.4,
      reviews: 0,
      prime,
      stock: Number(stock),
      img: imgUrl,
      images: cleanedImages,
      videos: cleanedVideos,
      desc,
    });

    setTitle("");
    setExtraImages([]);
    setVideos([]);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Admin</div>
          <div className="text-2xl font-black">Product Upload</div>
        </div>
        <Badge variant="secondary" className="rounded-full">Demo admin</Badge>
      </div>

      <div className="mt-5 grid lg:grid-cols-2 gap-4">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Add new product</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            <div>
              <div className="text-sm font-semibold">Title</div>
              <Input className="rounded-2xl" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-semibold">Category</div>
                <select
                  className="mt-1 w-full rounded-2xl border bg-background px-3 py-2 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-sm font-semibold">Price (AED)</div>
                <Input type="number" className="rounded-2xl" value={price as any} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-semibold">Stock</div>
                <Input type="number" className="rounded-2xl" value={stock as any} onChange={(e) => setStock(Number(e.target.value))} />
              </div>
              <label className="flex items-center gap-2 text-sm pt-7">
                <input type="checkbox" checked={prime} onChange={(e) => setPrime(e.target.checked)} />
                Prime
              </label>
            </div>

            <div>
              <div className="text-sm font-semibold">Main Image URL</div>
              <Input className="rounded-2xl" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">More Pictures (multiple)</div>
                <Button type="button" variant="secondary" className="rounded-2xl" onClick={addImageField}>+ Add Picture</Button>
              </div>
              {extraImages.length === 0 ? (
                <div className="text-xs text-muted-foreground">No extra pictures yet.</div>
              ) : (
                <div className="space-y-2">
                  {extraImages.map((val, i) => (
                    <div key={`img_${i}`} className="flex gap-2">
                      <Input placeholder="https://...jpg" value={val} onChange={(e) => updateImageField(i, e.target.value)} className="rounded-2xl" />
                      <Button type="button" variant="ghost" className="rounded-2xl" onClick={() => removeImageField(i)}>Remove</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Videos (YouTube or .mp4)</div>
                <Button type="button" variant="secondary" className="rounded-2xl" onClick={addVideoField}>+ Add Video</Button>
              </div>
              {videos.length === 0 ? (
                <div className="text-xs text-muted-foreground">No videos yet.</div>
              ) : (
                <div className="space-y-2">
                  {videos.map((val, i) => (
                    <div key={`vid_${i}`} className="flex gap-2">
                      <Input placeholder="https://youtube.com/watch?v=... or https://...mp4" value={val} onChange={(e) => updateVideoField(i, e.target.value)} className="rounded-2xl" />
                      <Button type="button" variant="ghost" className="rounded-2xl" onClick={() => removeVideoField(i)}>Remove</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold">Description</div>
              <textarea
                className="mt-1 w-full rounded-2xl border bg-background px-3 py-2 text-sm min-h-24"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <Button className="rounded-2xl" onClick={submit}>Create product</Button>
            <div className="text-xs text-muted-foreground">Demo only. Real version: upload to storage + save to DB.</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Catalog preview</CardTitle></CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-sm text-muted-foreground">Total products: {products.length}</div>
            <div className="mt-3 grid gap-3">
              {products.slice(0, 8).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-2xl border p-3">
                  <button onClick={() => onDeleteProduct(p.id)} className="text-red-600 text-xs font-semibold mr-1">Delete</button>
                  <img src={p.img} alt={p.title} className="h-12 w-12 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold line-clamp-1">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.category} • {formatMoneyAED(p.price)}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {(p.images?.length || 0)} photos • {(p.videos?.length || 0)} videos
                    </div>
                  </div>
                  {p.prime && <Badge className="rounded-full">Prime</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DragonMartOnline() {
  const { session, setSession } = useSession();

  const [page, setPage] = useState<"home" | "orders" | "admin">("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"featured" | "price_asc" | "price_desc" | "rating_desc">("featured");
  const [onlyPrime, setOnlyPrime] = useState(false);
  const [priceMax, setPriceMax] = useState(1500);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem("dmo_products");
      return raw ? JSON.parse(raw) : DEMO_PRODUCTS;
    } catch {
      return DEMO_PRODUCTS;
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem("dmo_cart");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem("dmo_orders");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [quickOpen, setQuickOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("dmo_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);
  useEffect(() => {
    try { localStorage.setItem("dmo_orders", JSON.stringify(orders)); } catch {}
  }, [orders]);
  useEffect(() => {
    try { localStorage.setItem("dmo_products", JSON.stringify(products)); } catch {}
  }, [products]);

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  const cartItems = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p] as const));
    return Object.entries(cart)
      .map(([id, qty]) => ({ product: map.get(id)!, qty }))
      .filter((x) => x.product);
  }, [cart, products]);

  const subtotal = useMemo(() => cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0), [cartItems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (onlyPrime && !p.prime) return false;
      if (p.price > priceMax) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });

    if (sort === "price_asc") list = list.slice().sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = list.slice().sort((a, b) => b.price - a.price);
    if (sort === "rating_desc") list = list.slice().sort((a, b) => b.rating - a.rating);

    if (sort === "featured") {
      list = list
        .map((p) => ({ p, s: p.rating * 10 + clamp(p.stock, 0, 50) / 10 }))
        .sort((a, b) => b.s - a.s)
        .map((x) => x.p);
    }

    return list;
  }, [query, category, sort, onlyPrime, priceMax, products]);

  function addToCart(p: Product) {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
    setCartOpen(true);
  }

  function inc(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }

  function dec(id: string) {
    setCart((c) => {
      const next = { ...c };
      const v = (next[id] || 0) - 1;
      if (v <= 0) delete next[id];
      else next[id] = v;
      return next;
    });
  }

  function remove(id: string) {
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  }

  function quickView(p: Product) {
    setActiveProduct(p);
    setQuickOpen(true);
  }

  function logout() {
    setSession(null);
    setPage("home");
  }

  function createProduct(p: Product) {
    setProducts((prev) => [p, ...prev]);
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function checkoutStripeDemo() {
    if (!session) {
      setAuthOpen(true);
      return;
    }

    const order: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date().toISOString(),
      status: "Processing",
      total: subtotal,
      items: cartItems.map(({ product, qty }) => ({
        productId: product.id,
        title: product.title,
        qty,
        price: product.price,
      })),
      userEmail: session.email,
    };

    setOrders((o) => [order, ...o]);
    setCart({});
    setCartOpen(false);
    setPage("orders");
  }

  const guardAdmin = session?.role === "admin";

  return (
    <div className="min-h-screen bg-orange-50">
      <TopNav
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        page={page}
        setPage={setPage}
        session={session}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={logout}
      />

      {page === "home" && (
        <>
          <Hero onShop={() => window.scrollTo({ top: 520, behavior: "smooth" })} />

          <FiltersBar
            sort={sort}
            setSort={setSort}
            onlyPrime={onlyPrime}
            setOnlyPrime={setOnlyPrime}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
          />

          <div className="mx-auto max-w-6xl px-4 mt-6 pb-12">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm text-muted-foreground">Showing</div>
                <div className="text-xl font-black">
                  {filtered.length} result{filtered.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Tip: try search “lamp”, “book”, “prime”…</div>
            </div>

            <motion.div layout className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard p={p} onQuickView={quickView} onAdd={addToCart} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="mt-10 grid md:grid-cols-3 gap-4">
              {[{ icon: Truck, title: "Fast delivery", text: "Prime items arrive quicker. (Demo UI)" },
                { icon: ShieldCheck, title: "Secure checkout", text: "Connect Stripe for real payments." },
                { icon: RotateCcw, title: "Easy returns", text: "Add return policy pages & order tracking." },
              ].map((b) => (
                <Card key={b.title} className="rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <b.icon className="h-5 w-5" /> {b.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{b.text}</CardContent>
                </Card>
              ))}
            </div>

            <footer className="mt-12 text-center text-xs text-muted-foreground">
              Dragon Mart Online — starter template. Plug a backend (Supabase/Firebase/Node) to go live.
            </footer>
          </div>
        </>
      )}

      {page === "orders" && <OrdersPage orders={orders.filter((o) => !session || o.userEmail === session.email)} />}

      {page === "admin" &&
        (guardAdmin ? (
          <AdminPage products={products} onCreateProduct={createProduct} onDeleteProduct={deleteProduct} />
        ) : (
          <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="text-2xl font-black">Admin access required</div>
                <div className="mt-2 text-sm text-muted-foreground">Please login as an admin to upload products.</div>
                <div className="mt-4 flex gap-2">
                  <Button className="rounded-2xl" onClick={() => setAuthOpen(true)}>Login</Button>
                  <Button variant="secondary" className="rounded-2xl" onClick={() => setPage("home")}>Go home</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

      <CartSheet
        open={cartOpen}
        setOpen={setCartOpen}
        items={cartItems}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
        total={subtotal}
        onCheckout={checkoutStripeDemo}
      />

      <ProductDialog open={quickOpen} setOpen={setQuickOpen} product={activeProduct} onAdd={addToCart} />

      <AuthDialog open={authOpen} setOpen={setAuthOpen} setSession={setSession} />
    </div>
  );
}
