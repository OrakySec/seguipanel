"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ElementType;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  className,
  icon: Icon
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full min-w-[200px]", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-14 px-6 bg-surface border border-transparent rounded-2xl flex items-center justify-between gap-3 text-sm font-black transition-all outline-none",
          isOpen ? "ring-8 ring-primary/5 border-primary/20 bg-card" : "hover:bg-card hover:border-border",
          selectedOption ? "text-foreground" : "text-muted"
        )}
      >
        <div className="flex items-center gap-3 truncate font-black uppercase tracking-widest text-[11px]">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown 
            className={cn("w-4 h-4 text-muted transition-transform duration-300", isOpen && "rotate-180 text-primary")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[100] w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto custom-scrollbar"
          >
            <div className="p-2">
              {options.length > 0 ? options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-left transition-all group",
                      isSelected 
                        ? "bg-primary text-white shadow-brand" 
                        : "text-muted hover:bg-surface hover:text-foreground"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              }) : (
                <div className="px-5 py-8 text-center text-[10px] font-black uppercase tracking-widest text-muted opacity-40">
                  Nenhuma opção
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
