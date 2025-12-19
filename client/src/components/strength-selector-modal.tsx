import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface StrengthSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (strength: string) => void;
  productName: string;
}

const strengths = [
  { value: "٣ ملغ", label: "3mg", arabicLabel: "خفيف", dots: 1 },
  { value: "٦ ملغ", label: "6mg", arabicLabel: "متوسط", dots: 2 },
  { value: "٧ ملغ", label: "7mg", arabicLabel: "قوي", dots: 2 },
  { value: "١٠ ملغ", label: "10mg", arabicLabel: "قوي جداً", dots: 3 },
];

export default function StrengthSelectorModal({
  open,
  onClose,
  onSelect,
  productName,
}: StrengthSelectorModalProps) {
  const [selectedStrength, setSelectedStrength] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedStrength) {
      onSelect(selectedStrength);
      setSelectedStrength(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            اختر قوة النيكوتين
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm mt-1">
            {productName}
          </p>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {strengths.map((strength) => (
            <motion.button
              key={strength.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStrength(strength.value)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedStrength === strength.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-2xl font-bold text-primary mb-1">
                {strength.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {strength.arabicLabel}
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`w-2 h-2 rounded-full ${
                      dot <= strength.dots ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </motion.button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={onClose}
          >
            إلغاء
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirm}
            disabled={!selectedStrength}
          >
            إضافة للسلة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
