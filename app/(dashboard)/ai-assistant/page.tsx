'use client';

import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";

export default function AiAssistantPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="AI Assistant"
        description="Get help with asset management using our AI assistant."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 card-premium"
      >
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-foreground mb-2">AI Assistant</h3>
          <p className="text-muted-foreground">Coming soon</p>
        </div>
      </motion.div>
    </div>
  );
}
