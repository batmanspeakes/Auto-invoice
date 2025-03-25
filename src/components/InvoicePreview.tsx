import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import companyLogo from "../ASSETS/Company logo.jpg";

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
          "w-full max-w-[210mm] mx-auto p-8 bg-white shadow-xl border border-gray-200 print:p-6 print:shadow-none print:border-0 print:m-0 print:max-w-none print:w-full generating-pdf:rounded-none",
          className,
        )}
      >
        <style type="text/css" media="print">{`
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            -webkit-filter: opacity(1) !important;
          }
        `}</style>

        <style>{`
          .generating-pdf {
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .invoice-header {
            position: relative;
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid #e5e7eb;
          }
          .invoice-header::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #000000;
          }
          .section-header {
            background: #000000;
            color: white;
            padding: 0.5rem 1rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
          .details-box {
            background: #f8fafc;
            padding: 0.75rem;
            border-radius: 4px;
            margin-bottom: 0.75rem;
          }
          .table-header {
            background: #000000;
            color: white;
          }
          .table-row {
            border-bottom: 1px solid #e5e7eb;
          }
          .table-row:last-child {
            border-bottom: none;
          }
          .total-box {
            background: #000000;
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 4px;
            margin-top: 0.75rem;
          }
          .footer {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 2px solid #e5e7eb;
            position: relative;
          }
          .footer::after {
            content: '';
            position: absolute;
            top: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #000000;
          }
        `}</style>

        {/* Header Section */}
        <div className="invoice-header flex justify-between items-start">
          <div className="flex-1">
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-14 w-auto object-contain mb-3"
            />
            <div className="space-y-0.5">
              <h2 className="font-semibold text-gray-800">Influencer Details</h2>
              <p className="text-sm text-gray-600">Name: {influencer.fullName}</p>
              <p className="text-sm text-gray-600">Address: {influencer.address}</p>
              <p className="text-sm text-gray-600">Contact: {influencer.contactNumber}</p>
              {bank.panNumber && (
                <p className="text-sm text-gray-600">PAN: {bank.panNumber}</p>
              )}
              {financial.isGstApplicable && financial.gstNumber && (
                <p className="text-sm text-gray-600">GST: {financial.gstNumber}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
            <p className="text-sm text-gray-600">Invoice No: {financial.invoiceNumber || "INV-001"}</p>
            <p className="text-sm text-gray-600">Date: {format(currentDate, "dd/MM/yyyy")}</p>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-6">
          <div className="section-header">Bill To:</div>
          <div className="details-box">
            <p className="font-semibold text-gray-800">PIANOSA PRIVATE LIMITED</p>
            <p className="text-sm text-gray-600 mt-1">SSS Enclave, S1 & S2, 3rd Floor, Varthur Main Road</p>
            <p className="text-sm text-gray-600">Spice Garden, Silver Spring Layout</p>
            <p className="text-sm text-gray-600">Marathahalli, Bangalore - 560037</p>
            <p className="text-sm text-gray-600">Landmark: Above Tenet Diagnostic Centre</p>
            <p className="text-sm text-gray-600 mt-1">GST: 29AAQCA9308J1Z2</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mb-6">
          <div className="section-header">Description</div>
          <div className="details-box mb-4">
            <p className="text-sm text-gray-800">
              {campaign.brandName} {campaign.productName} collaboration {campaign.month} {campaign.year}
            </p>
          </div>

          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-2 px-4">Item</th>
                <th className="text-right py-2 px-4 w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row">
                <td className="py-2 px-4">Professional Fee</td>
                <td className="py-2 px-4 text-right">₹{financial.commercials?.toFixed(2) || "0.00"}</td>
              </tr>
              {financial.reimbursement > 0 && (
                <tr className="table-row">
                  <td className="py-2 px-4">Reimbursement</td>
                  <td className="py-2 px-4 text-right">₹{financial.reimbursement?.toFixed(2)}</td>
                </tr>
              )}
              {financial.isGstApplicable && (
                <tr className="table-row">
                  <td className="py-2 px-4">GST ({financial.gstPercentage || 18}%)</td>
                  <td className="py-2 px-4 text-right">
                    ₹{((financial.commercials * (financial.gstPercentage || 18)) / 100).toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="total-box text-right">
            <span className="text-lg font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Account Details */}
        <div className="mb-6">
          <div className="section-header">Account Details</div>
          <div className="details-box grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Bank Name: {bank.bankName}</p>
              <p className="text-sm text-gray-600">Account Holder: {bank.accountHolderName}</p>
              <p className="text-sm text-gray-600">Account Number: {bank.accountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">IFSC Code: {bank.ifscCode}</p>
              <p className="text-sm text-gray-600">Branch: {bank.branchName}</p>
              {bank.panNumber && <p className="text-sm text-gray-600">PAN: {bank.panNumber}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="text-center mb-3">
            <p className="text-sm text-gray-500">This is a computer generated invoice and does not require signature.</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-black">Thank You for Your Business!</p>
          </div>
        </div>
      </motion.div>
    );
  },
);

export default InvoicePreview;
