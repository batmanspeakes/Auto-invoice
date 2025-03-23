import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Briefcase, Link, AtSign, Building, Package, Calendar, FileText, ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  pocName: z.string().min(2, { message: "POC name is required" }),
  profileLink: z.string().url({ message: "Please enter a valid URL" }),
  username: z.string().optional(),
  brandName: z.string().min(2, { message: "Brand name is required" }),
  productName: z.string().min(2, { message: "Product name is required" }),
  description: z.string().optional(),
  month: z.string().min(1, { message: "Month is required" }),
  year: z.string().min(4, { message: "Year is required" }),
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
    username: "",
    brandName: "",
    productName: "",
    description: "",
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
  },
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Extract username from profile link
  useEffect(() => {
    const profileLink = form.watch('profileLink');
    if (profileLink) {
      try {
        const url = new URL(profileLink);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          const username = pathParts[pathParts.length - 1];
          form.setValue('username', username);
        }
      } catch (e) {
        // Invalid URL, don't update username
      }
    }
  }, [form.watch('profileLink')]);

  const onSubmit = (data: CampaignFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onComplete(data);
      setIsSubmitting(false);
    }, 300);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

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
        <Briefcase className="w-6 h-6 text-purple-400" />
        Campaign Details
      </h2>
      <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6"></div>

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
                <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                  <FormLabel className="text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-400" />
                    POC Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter point of contact name"
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
              name="profileLink"
              render={({ field }) => (
                <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                  <FormLabel className="text-white flex items-center gap-2">
                    <Link className="w-4 h-4 text-purple-400" />
                    Profile Link
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/profile"
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30 shadow-sm focus:shadow-md transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                <FormLabel className="text-white flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-purple-400" />
                  Username (Auto-fetched)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username will appear here"
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30 shadow-sm focus:shadow-md transition-all duration-300"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white/70">
                  This is automatically extracted from your profile link.
                </FormDescription>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                  <FormLabel className="text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-400" />
                    Brand Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter brand name"
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
              name="productName"
              render={({ field }) => (
                <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                  <FormLabel className="text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-400" />
                    Product Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product name"
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30 shadow-sm focus:shadow-md transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                  <FormLabel className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    Month
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-white/20 bg-white/5 text-white focus:border-white/30 shadow-sm focus:shadow-md transition-all duration-300">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 text-white border-white/20">
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                  <FormLabel className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    Year
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-white/20 bg-white/5 text-white focus:border-white/30 shadow-sm focus:shadow-md transition-all duration-300">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 text-white border-white/20">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="transition-all duration-300 hover:translate-y-[-2px]">
                <FormLabel className="text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter campaign description"
                    className="min-h-[100px] border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-white/30 shadow-sm focus:shadow-md transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white/70">
                  Provide a brief description of the campaign and deliverables.
                </FormDescription>
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

export default CampaignDetailsSection;
