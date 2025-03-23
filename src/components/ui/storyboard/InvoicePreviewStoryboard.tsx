import React from "react";
import InvoicePreview from "../../InvoicePreview";

const sampleFormData = {
  influencer: {
    fullName: "John Doe",
    address: "123 Main Street, Apartment 4B, New York, NY 10001",
    contactNumber: "+1 (555) 123-4567",
  },
  campaign: {
    pocName: "John Doe",
    profileLink: "https://instagram.com/johndoe",
    username: "johndoe",
    brandName: "TechGadgets Inc.",
    productName: "Smart Watch X1",
    description:
      "Promotional campaign for the new Smart Watch X1 featuring unboxing and review videos.",
    month: "January",
    year: "2023",
  },
  financial: {
    invoiceNumber: "INV-2023-001",
    commercials: 25000,
    reimbursement: 2500,
    isGstApplicable: true,
    gstNumber: "22AAAAA0000A1Z5",
    gstPercentage: 18,
  },
  bank: {
    accountHolderName: "John Doe",
    accountNumber: "1234567890",
    bankName: "HDFC Bank",
    branchName: "Koramangala Branch",
    ifscCode: "HDFC0001234",
    panNumber: "ABCDE1234F",
  },
};

const InvoicePreviewStoryboard = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <InvoicePreview formData={sampleFormData} totalAmount={32000} />
    </div>
  );
};

export default InvoicePreviewStoryboard;
