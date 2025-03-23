import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import companyLogo from "../ASSETS/Company logo.jpg"; // Fixed import path to match the actual file path

interface InvoicePreviewProps {
  formData: {
    influencer: any;
    campaign: any;
    financial: any;
    bank: any;
  };
  totalAmount: number;
  className?: string;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ formData, totalAmount, className = "" }, ref) => {
    const { influencer = {}, campaign = {}, financial = {}, bank = {} } = formData;
    const currentDate = new Date();

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "w-full max-w-4xl mx-auto p-6 rounded-xl bg-white shadow-xl border border-gray-200 print:p-4 print:shadow-none print:border-0 print:m-0 print:max-w-none print:w-full",
          className,
        )}
      >
        <style type="text/css" media="print">{`
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-small-text {
            font-size: 10pt !important;
          }
          .print-compress {
            margin: 0 !important;
            padding: 0 !important;
          }
        `}</style>

        <div className="flex justify-between items-start mb-5 print:mb-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">INVOICE</h1>
            <p className="text-gray-500 mt-1 print:text-sm print:mt-0">
              #{financial.invoiceNumber || "INV-001"}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <img 
              src={companyLogo} 
              alt="The PIANOSA Project" 
              className="h-16 w-auto object-contain rounded-md shadow-sm print:h-14"
            />
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-1 px-3 text-sm rounded-lg inline-block mt-2 print:text-xs print:py-1 print:px-2 print:mt-1">
              INFLUENCER INVOICE
            </div>
            <p className="text-gray-500 mt-1 text-sm print:text-xs">
              Date: {format(currentDate, "dd MMM yyyy")}
            </p>
            {campaign.month && campaign.year && (
              <p className="text-gray-500 text-sm print:text-xs">
                For: {campaign.month} {campaign.year}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-5 print:gap-4 print:mb-3">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 print:text-sm">
              From
            </h2>
            <p className="font-medium text-gray-800 print:text-sm">
              {influencer.fullName || campaign.pocName || "Influencer Name"}
            </p>
            {influencer.address && (
              <p className="text-gray-600 text-sm print:text-xs">
                Address: {influencer.address}
              </p>
            )}
            {influencer.contactNumber && (
              <p className="text-gray-600 text-sm print:text-xs">
                Contact: {influencer.contactNumber}
              </p>
            )}
            <p className="text-gray-600 text-sm print:text-xs">
              Profile: {campaign.profileLink || "https://example.com/profile"}
            </p>
            {campaign.username && (
              <p className="text-gray-600 text-sm print:text-xs">
                Username: {campaign.username}
              </p>
            )}
            {bank.panNumber && (
              <p className="text-gray-600 text-sm print:text-xs">PAN: {bank.panNumber}</p>
            )}
            {financial.isGstApplicable && financial.gstNumber && (
              <p className="text-gray-600 text-sm print:text-xs">GST: {financial.gstNumber}</p>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 print:text-sm">
              Bill To
            </h2>
            <p className="font-medium text-gray-800 print:text-sm">
              PIANOSA PRIVATE LIMITED
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              SSS Enclave, S1 & S2, 3rd Floor, Varthur Main Road,
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              Spice Garden, Silver Spring Layout, Marathahalli,
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              Bangalore - 560037
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              Landmark: Above Tenet Diagnostic Centre
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              GST Number: 29AAQCA9308J1Z2
            </p>
          </div>
        </div>

        <div className="mb-5 print:mb-3">
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 mb-2 print:text-sm print:mb-1">
            Campaign Details
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-2 print:gap-2 print:mb-1">
            <div>
              <p className="text-gray-600 text-sm print:text-xs"><span className="font-medium">Brand:</span> {campaign.brandName || "-"}</p>
              <p className="text-gray-600 text-sm print:text-xs"><span className="font-medium">Product:</span> {campaign.productName || "-"}</p>
            </div>
            <div>
              {campaign.month && campaign.year && (
                <p className="text-gray-600 text-sm print:text-xs"><span className="font-medium">Period:</span> {campaign.month} {campaign.year}</p>
              )}
            </div>
          </div>
          {campaign.description && (
            <div className="mt-1">
              <p className="text-gray-600 text-sm print:text-xs"><span className="font-medium">Description:</span> {campaign.description}</p>
            </div>
          )}
        </div>

        <div className="mb-5 overflow-hidden rounded-lg border border-gray-200 print:mb-3">
          <h2 className="text-base font-semibold text-gray-700 py-2 px-3 bg-gray-50 print:text-sm print:py-1">
            Invoice Details
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-2 px-3 font-semibold text-gray-700 text-sm print:text-xs print:py-1">
                  Description
                </th>
                <th className="py-2 px-3 font-semibold text-gray-700 text-right text-sm print:text-xs print:py-1">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 px-3 text-gray-700 text-sm print:text-xs print:py-1">Commercials</td>
                <td className="py-2 px-3 text-gray-700 text-right text-sm print:text-xs print:py-1">
                  ₹{financial.commercials?.toFixed(2) || "0.00"}
                </td>
              </tr>
              {financial.reimbursement > 0 && (
                <tr>
                  <td className="py-2 px-3 text-gray-700 text-sm print:text-xs print:py-1">Reimbursement</td>
                  <td className="py-2 px-3 text-gray-700 text-right text-sm print:text-xs print:py-1">
                    ₹{financial.reimbursement?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              )}
              {financial.isGstApplicable && (
                <tr>
                  <td className="py-2 px-3 text-gray-700 text-sm print:text-xs print:py-1">
                    GST ({financial.gstPercentage || 18}%)
                  </td>
                  <td className="py-2 px-3 text-gray-700 text-right text-sm print:text-xs print:py-1">
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
                <td className="py-2 px-3 text-gray-800 text-sm print:text-xs print:py-1">Total</td>
                <td className="py-2 px-3 text-gray-800 text-right font-bold text-sm print:text-xs print:py-1">
                  ₹{totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-6 print:gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 print:text-sm">
              Payment Details
            </h2>
            <p className="text-gray-600 text-sm print:text-xs">
              Account Holder: {bank.accountHolderName || influencer.fullName || "Account Holder Name"}
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              Account Number: {bank.accountNumber || "XXXXXXXXXXXX"}
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              Bank Name: {bank.bankName || "Bank Name"}
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              Branch: {bank.branchName || "Branch Name"}
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              IFSC Code: {bank.ifscCode || "IFSC0000000"}
            </p>
          </div>

          <div className="space-y-1 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 print:text-sm">
                Terms & Conditions
              </h2>
              <p className="text-gray-600 text-xs mt-1 print:mt-0">
                1. Payment due within 30 days of invoice date.
              </p>
              <p className="text-gray-600 text-xs">
                2. Please include invoice number in payment reference.
              </p>
            </div>

            <div className="mt-auto pt-2 border-t border-gray-200 print:pt-1">
              <p className="text-right text-gray-500 text-xs italic">
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
