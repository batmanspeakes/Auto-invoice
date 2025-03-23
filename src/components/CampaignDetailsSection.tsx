import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  pocName: z.string().min(2, { message: "POC name is required" }),
  profileLink: z.string().url({ message: "Please enter a valid URL" }),
  brandName: z.string().min(2, { message: "Brand name is required" }),
  productName: z.string().min(2, { message: "Product name is required" }),
  description: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof formSchema>;

interface CampaignDetailsSectionProps {
  onComplete?: (data: CampaignFormValues) => void;
  defaultValues?: Partial<CampaignFormValues>;
  className?: string;
}

const CampaignDetailsSection: React.FC<CampaignDetailsSectionProps> = ({
  onComplete = () => {},
  defaultValues = {
    pocName: "",
    profileLink: "",
    brandName: "",
    productName: "",
    description: "",
  },
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: CampaignFormValues) => {
    onComplete(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-[700px] rounded-xl bg-white/10 p-6 backdrop-blur-md backdrop-filter transition-all ${className} ${isHovered ? "shadow-lg" : "shadow-md"}`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Campaign Details
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          id="campaign-form"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="pocName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">POC Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter point of contact name"
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Profile Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/profile"
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Brand Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter brand name"
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product name"
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter campaign description"
                    className="min-h-[100px] border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white/70">
                  Provide a brief description of the campaign and deliverables.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </motion.div>
  );
};

export default CampaignDetailsSection;
