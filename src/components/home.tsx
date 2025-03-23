import React from "react";
import { motion } from "framer-motion";
import InvoiceForm from "./InvoiceForm";
import RotatingText from "./RotatingText";

const Home: React.FC = () => {
  // Texts to be displayed in the rotating component
  const rotatingTexts = [
    "Create professional invoices in seconds",
    "Get paid faster for your creative work",
    "Streamlined process for influencers",
    "Simple. Fast. Reliable."
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 to-blue-900 flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          THE PIANOSA PROJECT
        </h1>
        
        <div className="text-xl md:text-2xl font-medium h-10 mb-6 flex justify-center overflow-hidden">
          <RotatingText 
            texts={rotatingTexts}
            splitBy="words"
            staggerDuration={0.03}
            rotationInterval={3500}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300 
            }}
            initial={{ y: "100%", opacity: 0, rotate: 5 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: "-100%", opacity: 0, rotate: -5 }}
            mainClassName="text-yellow-300 font-semibold"
            elementLevelClassName="origin-bottom"
          />
        </div>
        
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Submit your campaign details and get paid faster with our streamlined
          invoice process
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <InvoiceForm />
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 text-center text-white/60 text-sm"
      >
        <p>
          © {new Date().getFullYear()} Influencer Invoice Portal. All rights
          reserved.
        </p>
        <p className="mt-1">Secure payment processing for content creators</p>
      </motion.footer>
    </div>
  );
};

export default Home;
