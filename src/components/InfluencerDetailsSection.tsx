import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { User, MapPin, Phone, ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  address: z.string().min(5, { message: "Complete address is required" }),
  contactNumber: z.string().min(10, { message: "Valid contact number is required" }),
});

type InfluencerFormValues = z.infer<typeof formSchema>;

interface InfluencerDetailsSectionProps {
  onComplete?: (data: InfluencerFormValues) => void;
  defaultValues?: Partial<InfluencerFormValues>;
  className?: string;
}

const InfluencerDetailsSection: React.FC<InfluencerDetailsSectionProps> = ({
  onComplete = () => {},
  defaultValues = {
    fullName: "",
    address: "",
    contactNumber: "",
  },
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InfluencerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: InfluencerFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onComplete(data);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-[700px] rounded-xl p-6 transition-all ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="mb-6 text-2xl font-semibold text-white flex items-center gap-2">
        <User className="w-6 h-6 text-purple-400" />
        Influencer Details
      </h2>
      <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6"></div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          id="influencer-form"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                <FormLabel className="text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  Full Name (Same as Bank Account Name)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30 shadow-sm focus:shadow-md transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                <FormLabel className="text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your complete address"
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30 shadow-sm focus:shadow-md transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                <FormLabel className="text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-400" />
                  Contact Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your contact number"
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30 shadow-sm focus:shadow-md transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default InfluencerDetailsSection; 