import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    accountHolderName: z
      .string()
      .min(2, { message: "Account holder name is required" }),
    accountNumber: z
      .string()
      .min(9, { message: "Account number must be at least 9 digits" }),
    confirmAccountNumber: z.string(),
    bankName: z.string().min(2, { message: "Bank name is required" }),
    ifscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code format" }),
    panNumber: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
        message: "Invalid PAN card format",
      }),
    branchName: z.string().min(2, { message: "Branch name is required" }),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: "Account numbers do not match",
    path: ["confirmAccountNumber"],
  });

type FormValues = z.infer<typeof formSchema>;

interface BankDetailsSectionProps {
  onComplete?: (data: FormValues) => void;
  onBack?: () => void;
  className?: string;
}

const BankDetailsSection = ({
  onComplete = () => {},
  onBack = () => {},
  className = "",
}: BankDetailsSectionProps) => {
  const [validationStatus, setValidationStatus] = useState<{
    accountNumber: "idle" | "valid" | "invalid";
    ifscCode: "idle" | "valid" | "invalid";
    panNumber: "idle" | "valid" | "invalid";
  }>({
    accountNumber: "idle",
    ifscCode: "idle",
    panNumber: "idle",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
      ifscCode: "",
      panNumber: "",
      branchName: "",
    },
  });

  const validateAccountNumber = (value: string) => {
    // Simple validation - could be enhanced with actual bank API validation
    const isValid = /^\d{9,18}$/.test(value);
    setValidationStatus((prev) => ({
      ...prev,
      accountNumber: isValid ? "valid" : "invalid",
    }));
    return isValid;
  };

  const validateIFSC = (value: string) => {
    // IFSC validation - 4 letters followed by 0 and 6 alphanumeric characters
    const isValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value);
    setValidationStatus((prev) => ({
      ...prev,
      ifscCode: isValid ? "valid" : "invalid",
    }));
    return isValid;
  };

  const validatePAN = (value: string) => {
    // PAN validation - 5 letters, 4 numbers, 1 letter
    const isValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
    setValidationStatus((prev) => ({
      ...prev,
      panNumber: isValid ? "valid" : "invalid",
    }));
    return isValid;
  };

  const onSubmit = (data: FormValues) => {
    onComplete(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-lg",
        "hover:shadow-xl transition-all duration-300",
        className,
      )}
    >
      <h2 className="text-2xl font-semibold mb-6 text-white">Bank Details</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Holder Name */}
            <FormField
              control={form.control}
              name="accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Account Holder Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter account holder name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank Name */}
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter bank name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Number */}
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Account Number</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter account number"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
                        onBlur={(e) => {
                          field.onBlur();
                          validateAccountNumber(e.target.value);
                        }}
                      />
                    </FormControl>
                    {validationStatus.accountNumber === "valid" && (
                      <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />
                    )}
                    {validationStatus.accountNumber === "invalid" && (
                      <AlertCircle className="absolute right-3 top-2.5 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Account Number */}
            <FormField
              control={form.control}
              name="confirmAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Confirm Account Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Confirm account number"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* IFSC Code */}
            <FormField
              control={form.control}
              name="ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">IFSC Code</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter IFSC code"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
                        onBlur={(e) => {
                          field.onBlur();
                          validateIFSC(e.target.value);
                        }}
                      />
                    </FormControl>
                    {validationStatus.ifscCode === "valid" && (
                      <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />
                    )}
                    {validationStatus.ifscCode === "invalid" && (
                      <AlertCircle className="absolute right-3 top-2.5 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Branch Name */}
            <FormField
              control={form.control}
              name="branchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Branch Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter branch name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PAN Card Number */}
            <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-white">PAN Card Number</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter PAN card number"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
                        onBlur={(e) => {
                          field.onBlur();
                          validatePAN(e.target.value);
                        }}
                      />
                    </FormControl>
                    {validationStatus.panNumber === "valid" && (
                      <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />
                    )}
                    {validationStatus.panNumber === "invalid" && (
                      <AlertCircle className="absolute right-3 top-2.5 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition-opacity"
            >
              Complete
            </button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default BankDetailsSection;
