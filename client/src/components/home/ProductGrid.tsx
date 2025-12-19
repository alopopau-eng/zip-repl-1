import { ArrowLeft, Leaf, Zap, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion } from "framer-motion";
import type { Product } from "@shared/schema";

const products: (Product & { color: string; accent: string; gradientFrom: string; gradientTo: string })[] = [
  {
    id: 3,
    nameAr: "آيسي راش",
    nameEn: "Icy Rush",
    descriptionAr: "انتعاش النعناع البارد القوي",
    descriptionEn: "Powerful cold mint freshness",
    flavor: "نعناع",
    strength: "١٠ ملغ",
    strengthDots: 3,
    category: "نكهة من أرضنا",
    price: "15.00",
    imageUrl: "/blue_icy_rush_nicotine_pouch_tin.webp",
    inStock: 1,
    createdAt: new Date(),
    color: "bg-emerald-500/20 text-emerald-400",
    accent: "text-emerald-400",
    gradientFrom: "from-emerald-500/20",
    gradientTo: "to-transparent",
  },
  {
    id: 1,
    nameAr: "بيربل ميست",
    nameEn: "Purple Mist",
    descriptionAr: "نكهة التوت الغنية",
    descriptionEn: "Rich berry flavor",
    flavor: "توت مشكل",
    strength: "٦ ملغ",
    strengthDots: 2,
    category: "نكهات الفواكه",
    price: "15.00",
    imageUrl: "/purple_berry_nicotine_pouch_tin.webp",
    inStock: 1,
    createdAt: new Date(),
    color: "bg-purple-500/20 text-purple-400",
    accent: "text-purple-400",
    gradientFrom: "from-purple-500/20",
    gradientTo: "to-transparent",
  },
  {
    id: 5,
    nameAr: "سي سايد فروست",
    nameEn: "Seaside Frost",
    descriptionAr: "نسيم البحر البارد مع الحمضيات",
    descriptionEn: "Cool sea breeze with citrus",
    flavor: "حمضيات",
    strength: "١٠ ملغ",
    strengthDots: 3,
    category: "نكهة من أرضنا",
    price: "15.00",
    imageUrl: "/CC_FRURT.webp",
    inStock: 1,
    createdAt: new Date(),
    color: "bg-orange-500/20 text-orange-400",
    accent: "text-orange-400",
    gradientFrom: "from-orange-500/20",
    gradientTo: "to-transparent",
  },
];

export function ProductGrid() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة ${product.nameAr} إلى سلة التسوق`,
    });
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-background to-black/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.05),transparent_70%)]" />
      
      <div className="container px-4 mx-auto relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center md:text-right">
            <span className="text-primary text-sm font-bold tracking-widest uppercase mb-3 block">المنتجات المميزة</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-3 bg-gradient-to-l from-white to-white/70 bg-clip-text text-transparent">
              مجموعتنا الفاخرة
            </h2>
            <p className="text-muted-foreground text-lg max-w-md">
              اكتشف نكهات سعودية أصيلة مصنوعة بأعلى معايير الجودة
            </p>
          </div>
          <Link href="/products">
            <Button
              variant="outline"
              className="gap-2 rounded-full px-8 border-primary/50 text-primary hover:bg-primary hover:text-black transition-all"
            >
              عرض الكل <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-gradient-to-b from-card to-card/50 rounded-3xl border border-border/30 overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${product.gradientFrom} ${product.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${product.color} backdrop-blur-sm border border-white/10`}>
                  {product.strength}
                </span>
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-white">4.9</span>
                </div>
              </div>

              <div className="aspect-square flex items-center justify-center p-8 relative">
                <motion.img
                  src={product.imageUrl}
                  alt={product.nameAr}
                  className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              <div className="p-6 pt-2 text-right relative z-10">
                <p className={`text-sm font-semibold mb-1 ${product.accent}`}>
                  {product.flavor}
                </p>
                <h3 className="text-2xl font-bold font-heading mb-1 text-white">
                  {product.nameAr}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{product.descriptionAr}</p>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-primary">15.00</span>
                    <span className="text-xs text-muted-foreground">ريال سعودي</span>
                  </div>
                  <Button
                    className="rounded-full px-6 gap-2 bg-primary hover:bg-primary/90 text-black font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                    onClick={() => handleAddToCart(product)}
                    data-testid={`button-add-cart-${product.id}`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    أضف
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: <Leaf className="w-7 h-7" />,
      title: "خالي من التبغ",
      description: "نيكوتين نقي ١٠٠٪ خالي من التبغ لتجربة أنظف وأفضل.",
      color: "from-green-500/20 to-green-500/5",
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "جودة عالية",
      description: "مكونات صيدلانية مصنعة وفقاً لأعلى المعايير العالمية.",
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "مفعول فوري",
      description: "مصممة لإطلاق النيكوتين بشكل فوري ومستمر لتجربة مثالية.",
      color: "from-yellow-500/20 to-yellow-500/5",
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="container px-4 mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary text-sm font-bold tracking-widest uppercase mb-3 block">لماذا DZRT؟</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">
            الجودة التي تستحقها
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-b ${feature.color} border border-white/5 backdrop-blur-sm hover:border-primary/30 transition-all`}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-heading mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
