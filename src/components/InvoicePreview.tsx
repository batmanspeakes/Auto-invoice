import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "../lib/utils";

interface InvoicePreviewProps {
  formData: {
    campaign: any;
    financial: any;
    bank: any;
  };
  totalAmount: number;
  className?: string;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ formData, totalAmount, className = "" }, ref) => {
    const { campaign = {}, financial = {}, bank = {} } = formData;
    const currentDate = new Date();

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "w-full max-w-4xl mx-auto p-8 rounded-xl bg-white shadow-xl border border-gray-200",
          className,
        )}
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-500 mt-1">
              #{financial.invoiceNumber || "INV-001"}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 px-4 rounded-lg inline-block">
              INFLUENCER INVOICE
            </div>
            <p className="text-gray-500 mt-2">
              Date: {format(currentDate, "dd MMM yyyy")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">
              From
            </h2>
            <p className="font-medium text-gray-800">
              {campaign.pocName || "Influencer Name"}
            </p>
            <p className="text-gray-600">
              Profile: {campaign.profileLink || "https://example.com/profile"}
            </p>
            {bank.panNumber && (
              <p className="text-gray-600">PAN: {bank.panNumber}</p>
            )}
            {financial.isGstApplicable && financial.gstNumber && (
              <p className="text-gray-600">GST: {financial.gstNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">
              To
            </h2>
            <p className="font-medium text-gray-800">
              {campaign.brandName || "Brand Name"}
            </p>
            <p className="text-gray-600">
              {campaign.productName || "Product Name"}
            </p>
            <p className="text-gray-600 mt-2">
              {campaign.description ||
                "Campaign description would appear here."}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1 mb-4">
            Invoice Details
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 font-semibold text-gray-700">
                  Description
                </th>
                <th className="py-2 px-4 font-semibold text-gray-700 text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 text-gray-700">Commercials</td>
                <td className="py-3 px-4 text-gray-700 text-right">
                  ₹{financial.commercials?.toFixed(2) || "0.00"}
                </td>
              </tr>
              {financial.reimbursement > 0 && (
                <tr>
                  <td className="py-3 px-4 text-gray-700">Reimbursement</td>
                  <td className="py-3 px-4 text-gray-700 text-right">
                    ₹{financial.reimbursement?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              )}
              {financial.isGstApplicable && (
                <tr>
                  <td className="py-3 px-4 text-gray-700">
                    GST ({financial.gstPercentage || 18}%)
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-right">
                    ₹
                    {(
                      (financial.commercials *
                        (financial.gstPercentage || 18)) /
                      100
                    ).toFixed(2)}
                  </td>
                </tr>
              )}
              <tr className="bg-gray-50 font-medium">
                <td className="py-3 px-4 text-gray-800">Total</td>
                <td className="py-3 px-4 text-gray-800 text-right font-bold">
                  ₹{totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">
              Payment Details
            </h2>
            <p className="text-gray-600">
              Account Holder: {bank.accountHolderName || "Account Holder Name"}
            </p>
            <p className="text-gray-600">
              Account Number: {bank.accountNumber || "XXXXXXXXXXXX"}
            </p>
            <p className="text-gray-600">
              Bank Name: {bank.bankName || "Bank Name"}
            </p>
            <p className="text-gray-600">
              Branch: {bank.branchName || "Branch Name"}
            </p>
            <p className="text-gray-600">
              IFSC Code: {bank.ifscCode || "IFSC0000000"}
            </p>
          </div>

          <div className="space-y-2 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">
                Terms & Conditions
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                1. Payment due within 30 days of invoice date.
              </p>
              <p className="text-gray-600 text-sm">
                2. Please include invoice number in payment reference.
              </p>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200">
              <p className="text-right text-gray-500 text-sm italic">
                This is a computer-generated invoice and does not require a
                signature.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

export default InvoicePreview;
