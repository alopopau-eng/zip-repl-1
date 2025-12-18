"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cartContext"
import { useLocation } from "wouter"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingCart() {
  const { getItemCount } = useCart()
  const [location, setLocation] = useLocation()
  const itemCount = getItemCount()

  if (location === "/checkout" || itemCount === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLocation("/checkout")}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center gap-2 bg-[#00A859] hover:bg-[#008a4a] text-white rounded-full px-5 py-3 shadow-lg transition-colors"
        style={{ direction: "ltr" }}
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-bold">{itemCount}</span>
      </motion.button>
    </AnimatePresence>
  )
}
