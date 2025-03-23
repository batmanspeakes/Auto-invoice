import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "./ui/use-toast";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Eye, EyeOff, Download } from "lucide-react";
import html2pdf from "html2pdf.js";

import ProgressIndicator from "./ProgressIndicator";
import CampaignDetailsSection from "./CampaignDetailsSection";
import FinancialDetailsSection from "./FinancialDetailsSection";
import BankDetailsSection from "./BankDetailsSection";
import FormActions from "./FormActions";
import InvoicePreview from "./InvoicePreview";

interface InvoiceFormProps {
  onSubmit?: (formData: any) => void;
  className?: string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit = () => {},
  className = "",
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    campaign: {},
    financial: {},
    bank: {},
  });
  const [sectionValid, setSectionValid] = useState({
    campaign: false,
    financial: false,
    bank: false,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [campaignData, setCampaignData] = useState({});
  const [financialData, setFinancialData] = useState({});
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  // Update form data when section data changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      campaign: campaignData,
      financial: financialData,
    }));
  }, [campaignData, financialData]);

  // Handle section completion
  const handleCampaignComplete = (data: any) => {
    setCampaignData(data);
    setFormData((prev) => ({ ...prev, campaign: data }));
    setSectionValid((prev) => ({ ...prev, campaign: true }));
    // Don't automatically advance to next step
  };

  const handleFinancialComplete = (isComplete: boolean) => {
    setSectionValid((prev) => ({ ...prev, financial: isComplete }));
  };

  const handleFinancialDataChange = (data: any) => {
    setFinancialData(data);
  };

  const handleBankComplete = (data: any) => {
    setFormData((prev) => ({ ...prev, bank: data }));
    setSectionValid((prev) => ({ ...prev, bank: true }));
    handleSubmit();
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow navigation to steps that are valid or the current step
    if (
      step === currentStep ||
      step === 1 ||
      (step === 2 && sectionValid.campaign) ||
      (step === 3 && sectionValid.campaign && sectionValid.financial)
    ) {
      setCurrentStep(step);
    }
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleSubmit = () => {
    if (sectionValid.campaign && sectionValid.financial && sectionValid.bank) {
      const completeFormData = {
        ...formData,
        totalAmount,
        submittedAt: new Date().toISOString(),
      };

      onSubmit(completeFormData);

      toast({
        title: "Invoice Submitted Successfully",
        description: `Your invoice for ₹${totalAmount.toFixed(2)} has been submitted.`,
        variant: "default",
      });
    }
  };

  const handleDownloadPDF = () => {
    if (!invoicePreviewRef.current) return;

    const element = invoicePreviewRef.current;
    const filename = `Invoice_${formData.campaign.brandName || "Brand"}_${new Date().toISOString().split("T")[0]}.pdf`;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your invoice PDF...",
      variant: "default",
    });

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        toast({
          title: "PDF Downloaded",
          description: "Your invoice has been downloaded successfully.",
          variant: "default",
        });
      })
      .catch((error) => {
        console.error("PDF generation failed:", error);
        toast({
          title: "PDF Generation Failed",
          description:
            "There was an error generating your PDF. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "w-full max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-lg border border-white/10 shadow-xl",
        className,
      )}
      style={{ backgroundColor: "rgba(15, 23, 42, 0.3)" }}
    >
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Influencer Invoice Form
      </h1>

      <div className="flex justify-between items-center mb-6">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={3}
          onStepClick={handleStepClick}
        />

        {(sectionValid.campaign || sectionValid.financial) && (
          <Button
            onClick={togglePreview}
            className="ml-4 bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
            variant="outline"
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreview ? "Hide Preview" : "Generate Preview"}
          </Button>
        )}
      </div>

      {isPreview ? (
        <>
          <div ref={invoicePreviewRef}>
            <InvoicePreview formData={formData} totalAmount={totalAmount} />
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white flex items-center gap-2"
            >
              <Download size={16} />
              Download as PDF
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-8">
          {currentStep === 1 && (
            <CampaignDetailsSection
              onComplete={handleCampaignComplete}
              defaultValues={formData.campaign as any}
              className="mx-auto"
            />
          )}

          {currentStep === 2 && (
            <FinancialDetailsSection
              onComplete={handleFinancialComplete}
              onTotalChange={setTotalAmount}
              onDataChange={handleFinancialDataChange}
            />
          )}

          {currentStep === 3 && (
            <BankDetailsSection
              onComplete={handleBankComplete}
              onBack={handlePrevious}
              className="mx-auto"
            />
          )}

          <FormActions
            currentSection={currentStep - 1}
            totalSections={3}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isValid={
              (currentStep === 1 && sectionValid.campaign) ||
              (currentStep === 2 && sectionValid.financial) ||
              currentStep === 3
            }
            isLastSection={currentStep === 3}
          />
        </div>
      )}

      <div className="mt-6 text-center text-white/60 text-sm">
        <p>
          All information is securely processed and stored according to our
          privacy policy.
        </p>
      </div>
    </motion.div>
  );
};

export default InvoiceForm;
