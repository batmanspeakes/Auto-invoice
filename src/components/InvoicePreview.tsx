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
          "w-full max-w-4xl mx-auto p-3 sm:p-6 rounded-xl bg-white shadow-xl border border-gray-200 print:p-4 print:shadow-none print:border-0 print:m-0 print:max-w-none print:w-full generating-pdf:rounded-none",
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
            -webkit-filter: opacity(1) !important;
          }
          .print-small-text {
            font-size: 10pt !important;
          }
          .print-compress {
            margin: 0 !important;
            padding: 0 !important;
          }
        `}</style>

        <style>{`
          .generating-pdf {
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
          }
          .generating-pdf * {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
          }
          .generating-pdf .header-container {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            width: 100% !important;
            margin-bottom: 1.5rem !important;
          }
          .generating-pdf .logo-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            text-align: right !important;
          }
          .generating-pdf .logo-image {
            height: 4rem !important;
            width: auto !important;
            object-fit: contain !important;
            margin-bottom: 0.5rem !important;
          }
          .generating-pdf table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: avoid !important;
          }
          .generating-pdf table th,
          .generating-pdf table td {
            padding: 0.25rem 0.5rem !important;
          }
          .generating-pdf .text-right {
            text-align: right !important;
          }
          .generating-pdf .pagebreak-avoid {
            page-break-inside: avoid !important;
          }
          .generating-pdf .text-gray-800 { color: #1f2937 !important; }
          .generating-pdf .text-gray-700 { color: #374151 !important; }
          .generating-pdf .text-gray-600 { color: #4b5563 !important; }
          .generating-pdf .text-gray-500 { color: #6b7280 !important; }
          .generating-pdf .bg-gradient-to-r {
            background: linear-gradient(to right, #9333ea, #3b82f6) !important;
            color: white !important;
          }
        `}</style>

        <div className="header-container pagebreak-avoid">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 print:text-2xl">INVOICE</h1>
            <p className="text-gray-500 mt-1 print:text-sm print:mt-0">
              #{financial.invoiceNumber || "INV-001"}
            </p>
          </div>
          <div className="logo-container">
            <img 
              src={companyLogo} 
              alt="The PIANOSA Project" 
              className="logo-image"
            />
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-1 px-3 text-xs sm:text-sm rounded-lg mt-2 print:text-xs print:py-1 print:px-2 print:mt-1">
              INFLUENCER INVOICE
            </div>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm print:text-xs">
              Date: {format(currentDate, "dd MMM yyyy")}
            </p>
            {campaign.month && campaign.year && (
              <p className="text-gray-500 text-xs sm:text-sm print:text-xs">
                For: {campaign.month} {campaign.year}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 mb-4 sm:mb-6 pagebreak-avoid">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 print:text-sm">
              From
            </h2>
            <p className="font-medium text-gray-800 text-sm sm:text-base print:text-sm">
              {influencer.fullName || campaign.pocName || "Influencer Name"}
            </p>
            {influencer.address && (
              <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
                Address: {influencer.address}
              </p>
            )}
            {influencer.contactNumber && (
              <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
                Contact: {influencer.contactNumber}
              </p>
            )}
            {bank.panNumber && (
              <p className="text-gray-600 text-xs sm:text-sm print:text-xs">PAN: {bank.panNumber}</p>
            )}
            {financial.isGstApplicable && financial.gstNumber && (
              <p className="text-gray-600 text-xs sm:text-sm print:text-xs">GST: {financial.gstNumber}</p>
            )}
          </div>

          <div className="mt-3 sm:mt-0 space-y-1">
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 print:text-sm">
              Bill To
            </h2>
            <p className="font-medium text-gray-800 text-sm sm:text-base print:text-sm">
              PIANOSA PRIVATE LIMITED
            </p>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              SSS Enclave, S1 & S2, 3rd Floor, Varthur Main Road,
            </p>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              Spice Garden, Silver Spring Layout, Marathahalli,
            </p>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              Bangalore - 560037
            </p>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              Landmark: Above Tenet Diagnostic Centre
            </p>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              GST Number: 29AAQCA9308J1Z2
            </p>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 pagebreak-avoid">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 mb-2 print:text-sm print:mb-1">
            Campaign Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 print:gap-2 print:mb-1">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm print:text-xs"><span className="font-medium">Brand:</span> {campaign.brandName || "-"}</p>
              <p className="text-gray-600 text-xs sm:text-sm print:text-xs"><span className="font-medium">Product:</span> {campaign.productName || "-"}</p>
            </div>
            <div>
              {campaign.month && campaign.year && (
                <p className="text-gray-600 text-xs sm:text-sm print:text-xs"><span className="font-medium">Period:</span> {campaign.month} {campaign.year}</p>
              )}
            </div>
          </div>
          {campaign.description && (
            <div className="mt-1">
              <p className="text-gray-600 text-xs sm:text-sm print:text-xs"><span className="font-medium">Description:</span> {campaign.description}</p>
            </div>
          )}
        </div>

        <div className="mb-4 sm:mb-6 pagebreak-avoid">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700 py-1 sm:py-2 px-2 sm:px-3 bg-gray-50 print:text-sm print:py-1">
            Invoice Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="py-1 sm:py-2 px-2 sm:px-3 font-semibold text-gray-700 text-xs sm:text-sm print:text-xs print:py-1">
                    Description
                  </th>
                  <th className="py-1 sm:py-2 px-2 sm:px-3 font-semibold text-gray-700 text-right text-xs sm:text-sm print:text-xs print:py-1">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm print:text-xs print:py-1">Commercials</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 text-gray-700 text-right text-xs sm:text-sm print:text-xs print:py-1">
                    ₹{financial.commercials?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                {financial.reimbursement > 0 && (
                  <tr>
                    <td className="py-1 sm:py-2 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm print:text-xs print:py-1">Reimbursement</td>
                    <td className="py-1 sm:py-2 px-2 sm:px-3 text-gray-700 text-right text-xs sm:text-sm print:text-xs print:py-1">
                      ₹{financial.reimbursement?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                )}
                {financial.isGstApplicable && (
                  <tr>
                    <td className="py-1 sm:py-2 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm print:text-xs print:py-1">
                      GST ({financial.gstPercentage || 18}%)
                    </td>
                    <td className="py-1 sm:py-2 px-2 sm:px-3 text-gray-700 text-right text-xs sm:text-sm print:text-xs print:py-1">
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
                  <td className="py-1 sm:py-2 px-2 sm:px-3 text-gray-800 text-xs sm:text-sm print:text-xs print:py-1">Total</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 text-gray-800 text-right font-bold text-xs sm:text-sm print:text-xs print:py-1">
                    ₹{totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pagebreak-avoid">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 print:text-sm">
              Payment Details
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              Account Holder: {bank.accountHolderName || influencer.fullName || "Account Holder Name"}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              Account Number: {bank.accountNumber || "XXXXXXXXXXXX"}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              Bank Name: {bank.bankName || "Bank Name"}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              Branch: {bank.branchName || "Branch Name"}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm print:text-xs">
              IFSC Code: {bank.ifscCode || "IFSC0000000"}
            </p>
          </div>

          <div className="space-y-1 flex flex-col justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-700 border-b border-gray-200 pb-1 print:text-sm">
                Terms & Conditions
              </h2>
              <p className="text-gray-600 text-xs mt-1 print:mt-0">
                1. Payment due within 30 days of invoice date.
              </p>
              <p className="text-gray-600 text-xs">
                2. Please include invoice number in payment reference.
              </p>
            </div>

            <div className="mt-4 sm:mt-auto pt-2 border-t border-gray-200 print:pt-1">
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
