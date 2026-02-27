import { motion } from "framer-motion";

export function FloatingDock({ items }) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
      {items.map((item, index) => (
        <motion.a
          key={index}
          href={item.href}
          whileHover={{ scale: 1.2 }}
          className="w-10 h-10 flex items-center justify-center"
        >
          {item.icon}
        </motion.a>
      ))}
    </div>
  );
}