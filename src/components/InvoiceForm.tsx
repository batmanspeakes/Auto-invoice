import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "./ui/use-toast";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Eye, EyeOff, Download, ArrowLeft, Save, FileText } from "lucide-react";
import html2pdf from "html2pdf.js";

import ProgressIndicator from "./ProgressIndicator";
import InfluencerDetailsSection from "./InfluencerDetailsSection";
import CampaignDetailsSection from "./CampaignDetailsSection";
import FinancialDetailsSection from "./FinancialDetailsSection";
import BankDetailsSection from "./BankDetailsSection";
import FormActions from "./FormActions";
import InvoicePreview from "./InvoicePreview";

interface InvoiceFormProps {
  onSubmit?: (formData: any) => void;
  className?: string;
}

interface InfluencerData {
  fullName: string;
  address: string;
  contactNumber: string;
}

interface CampaignData {
  brandName: string;
  productName: string;
  description: string;
  month: string;
  year: string;
}

interface FinancialData {
  invoiceNumber: string;
  commercials: number;
  reimbursement: number;
  isGstApplicable: boolean;
  gstNumber: string;
  gstPercentage: number;
}

interface BankData {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  panNumber: string;
  branchName: string;
}

interface FormData {
  influencer: InfluencerData;
  campaign: CampaignData;
  financial: FinancialData;
  bank: BankData;
}

const STORAGE_KEY = "invoice_form_data";

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit = () => {},
  className = "",
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    influencer: {
      fullName: "",
      address: "",
      contactNumber: "",
    },
    campaign: {
      brandName: "",
      productName: "",
      description: "",
      month: "",
      year: "",
    },
    financial: {
      invoiceNumber: "",
      commercials: 0,
      reimbursement: 0,
      isGstApplicable: false,
      gstNumber: "",
      gstPercentage: 18,
    },
    bank: {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      panNumber: "",
      branchName: "",
    },
  });
  const [previewData, setPreviewData] = useState<FormData>({
    influencer: {
      fullName: "",
      address: "",
      contactNumber: "",
    },
    campaign: {
      brandName: "",
      productName: "",
      description: "",
      month: "",
      year: "",
    },
    financial: {
      invoiceNumber: "",
      commercials: 0,
      reimbursement: 0,
      isGstApplicable: false,
      gstNumber: "",
      gstPercentage: 18,
    },
    bank: {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      panNumber: "",
      branchName: "",
    },
  });
  const [sectionValid, setSectionValid] = useState({
    influencer: false,
    campaign: false,
    financial: false,
    bank: false,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [influencerData, setInfluencerData] = useState({});
  const [campaignData, setCampaignData] = useState({});
  const [financialData, setFinancialData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Set form data and section validity
        const loadedFormData = parsedData.formData || {
          influencer: {
            fullName: "",
            address: "",
            contactNumber: "",
          },
          campaign: {
            brandName: "",
            productName: "",
            description: "",
            month: "",
            year: "",
          },
          financial: {
            invoiceNumber: "",
            commercials: 0,
            reimbursement: 0,
            isGstApplicable: false,
            gstNumber: "",
            gstPercentage: 18,
          },
          bank: {
            accountHolderName: "",
            accountNumber: "",
            bankName: "",
            ifscCode: "",
            panNumber: "",
            branchName: "",
          },
        };
        
        setFormData(loadedFormData);
        setPreviewData(loadedFormData);
        
        setSectionValid(parsedData.sectionValid || {
          influencer: false,
          campaign: false,
          financial: false,
          bank: false,
        });
        
        setTotalAmount(parsedData.totalAmount || 0);
        
        // Set individual section data
        setInfluencerData(loadedFormData.influencer || {});
        setCampaignData(loadedFormData.campaign || {});
        setFinancialData(loadedFormData.financial || {});
      } catch (e) {
        console.error("Error loading saved data:", e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      formData,
      sectionValid,
      totalAmount,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, sectionValid, totalAmount]);

  // Update form data when section data changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      influencer: influencerData as InfluencerData,
      campaign: campaignData as CampaignData,
      financial: financialData as FinancialData,
    }));
  }, [influencerData, campaignData, financialData]);

  // Handle section completion
  const handleInfluencerComplete = (data: InfluencerData) => {
    setInfluencerData(data);
    setFormData((prev) => ({ ...prev, influencer: data }));
    setPreviewData((prev) => ({ ...prev, influencer: data }));
    setSectionValid((prev) => ({ ...prev, influencer: true }));
    // Auto advance to next step
    setCurrentStep(2);
  };

  const handleCampaignComplete = (data: CampaignData) => {
    setCampaignData(data);
    setFormData((prev) => ({ ...prev, campaign: data }));
    setPreviewData((prev) => ({ ...prev, campaign: data }));
    setSectionValid((prev) => ({ ...prev, campaign: true }));
    // Auto advance to next step
    setCurrentStep(3);
  };

  const handleFinancialComplete = (isComplete: boolean) => {
    setSectionValid((prev) => ({ ...prev, financial: isComplete }));
    if (isComplete) {
      setPreviewData((prev) => ({ ...prev, financial: formData.financial }));
    }
  };

  const handleFinancialDataChange = (data: FinancialData) => {
    setFinancialData(data);
  };

  const handleBankComplete = (data: BankData) => {
    setFormData((prev) => ({ ...prev, bank: data }));
    setPreviewData((prev) => ({ ...prev, bank: data }));
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow navigation to steps that are valid or the current step
    if (
      step === currentStep ||
      step === 1 ||
      (step === 2 && sectionValid.influencer) ||
      (step === 3 && sectionValid.influencer && sectionValid.campaign) ||
      (step === 4 && sectionValid.influencer && sectionValid.campaign && sectionValid.financial)
    ) {
      setCurrentStep(step);
    }
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  // Handler for going back from preview to form
  const handleBackFromPreview = () => {
    setIsPreview(false);
  };

  const handleSubmit = () => {
    if (sectionValid.influencer && sectionValid.campaign && sectionValid.financial && sectionValid.bank) {
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
      
      // Clear storage after successful submission
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleDownloadPDF = () => {
    if (!invoicePreviewRef.current) return;
    
    // Verify account holder name matches invoice name
    const invoiceName = previewData.influencer.fullName;
    const accountHolderName = previewData.bank.accountHolderName;
    
    if (invoiceName !== accountHolderName) {
      toast({
        title: "Name Mismatch",
        description: "The Account Holder Name must match the Invoice Name. Please correct this before generating the PDF.",
        variant: "destructive",
      });
      return;
    }
    
    setSaveLoading(true);

    const element = invoicePreviewRef.current;
    const filename = `Invoice_${previewData.campaign.brandName || "Brand"}_${new Date().toISOString().split("T")[0]}.pdf`;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { 
        type: "jpeg", 
        quality: 1,
        loading: 'eager'
      },
      html2canvas: { 
        scale: 4,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const element = clonedDoc.querySelector('.invoice-preview');
          if (element) {
            element.classList.add('generating-pdf');
          }
        }
      },
      jsPDF: { 
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
        precision: 16,
        putOnlyUsedFonts: true,
        floatPrecision: 16
      },
    };

    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your invoice PDF...",
      variant: "default",
    });

    // Add a temporary class to the element when generating PDF
    element.classList.add('generating-pdf');
    
    // Give the browser a moment to apply the class and load resources
    setTimeout(() => {
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
          setSaveLoading(false);
          // Remove the temporary class
          element.classList.remove('generating-pdf');
        })
        .catch((error) => {
          console.error("PDF generation failed:", error);
          toast({
            title: "PDF Generation Failed",
            description:
              "There was an error generating your PDF. Please try again.",
            variant: "destructive",
          });
          setSaveLoading(false);
          // Remove the temporary class
          element.classList.remove('generating-pdf');
        });
    }, 250); // Increased timeout to ensure styles are applied
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "w-full max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-br from-purple-900/50 via-indigo-900/40 to-blue-900/50 backdrop-blur-xl border border-white/10 shadow-xl",
        className,
      )}
      style={{ backgroundColor: "rgba(15, 23, 42, 0.3)" }}
    >
      <div className="mb-4 sm:mb-8 flex items-center justify-center">
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">
            Influencer Invoice Generator
          </h1>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={4}
          onStepClick={handleStepClick}
        />

        {(sectionValid.influencer || sectionValid.campaign || sectionValid.financial) && (
          <Button
            onClick={togglePreview}
            className="w-full sm:w-auto ml-0 sm:ml-4 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
            variant="outline"
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreview ? "Edit Form" : "Preview Invoice"}
          </Button>
        )}
      </div>

      {isPreview ? (
        <>
          <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <Button
              onClick={handleBackFromPreview}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
              variant="outline"
            >
              <ArrowLeft size={16} />
              Back to Form
            </Button>
            
            <Button
              onClick={handleDownloadPDF}
              disabled={saveLoading}
              className="w-full sm:w-auto mt-2 sm:mt-0 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
            >
              {saveLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Download PDF
                </>
              )}
            </Button>
          </div>
          
          <div ref={invoicePreviewRef} className="rounded-xl overflow-hidden shadow-2xl">
            <InvoicePreview formData={previewData} totalAmount={totalAmount} />
          </div>
        </>
      ) : (
        <div className="mt-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg mb-6 transition-all duration-300 hover:shadow-xl hover:bg-white/10">
            {currentStep === 1 && (
              <InfluencerDetailsSection
                onComplete={handleInfluencerComplete}
                defaultValues={formData.influencer as any}
                className="mx-auto"
              />
            )}

            {currentStep === 2 && (
              <CampaignDetailsSection
                onComplete={handleCampaignComplete}
                defaultValues={formData.campaign as any}
                className="mx-auto"
              />
            )}

            {currentStep === 3 && (
              <FinancialDetailsSection
                onComplete={handleFinancialComplete}
                onTotalChange={setTotalAmount}
                onDataChange={handleFinancialDataChange}
                defaultValues={formData.financial as any}
              />
            )}

            {currentStep === 4 && (
              <BankDetailsSection
                onComplete={handleBankComplete}
                onBack={handlePrevious}
                className="mx-auto"
                influencerName={formData.influencer.fullName}
                defaultValues={formData.bank as any}
              />
            )}
          </div>

          <FormActions
            currentSection={currentStep - 1}
            totalSections={4}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isValid={
              (currentStep === 1 && sectionValid.influencer) ||
              (currentStep === 2 && sectionValid.campaign) ||
              (currentStep === 3 && sectionValid.financial) ||
              currentStep === 4
            }
            isLastSection={currentStep === 4}
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
