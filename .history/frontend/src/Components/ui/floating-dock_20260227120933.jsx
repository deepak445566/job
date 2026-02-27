import { motion } from "framer-motion";

export default function FloatingDock({ items }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-6 py-3 
        bg-white/10 backdrop-blur-lg 
        border border-white/20
        rounded-2xl shadow-2xl">

        {items.map((item, index) => (
          <motion.a
            key={index}
            href={item.href}
            whileHover={{ scale: 1.4, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            {item.icon}
          </motion.a>
        ))}
      </div>
    </div>
  );
}