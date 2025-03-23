import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

interface FinancialDetailsSectionProps {
  onComplete?: (isComplete: boolean) => void;
  onTotalChange?: (total: number) => void;
  onDataChange?: (data: any) => void;
}

const FinancialDetailsSection: React.FC<FinancialDetailsSectionProps> = ({
  onComplete = () => {},
  onTotalChange = () => {},
  onDataChange = () => {},
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [commercials, setCommercials] = useState<number>(0);
  const [reimbursement, setReimbursement] = useState<number>(0);
  const [isGstApplicable, setIsGstApplicable] = useState<boolean>(false);
  const [gstNumber, setGstNumber] = useState<string>("");
  const [gstPercentage, setGstPercentage] = useState<number>(18); // Default GST percentage in India
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Calculate total amount whenever commercials, reimbursement, or GST changes
  useEffect(() => {
    let total = commercials + reimbursement;
    if (isGstApplicable) {
      const gstAmount = (commercials * gstPercentage) / 100;
      total += gstAmount;
    }
    setTotalAmount(total);
    onTotalChange(total);

    // Pass financial data to parent component
    onDataChange({
      invoiceNumber,
      commercials,
      reimbursement,
      isGstApplicable,
      gstNumber,
      gstPercentage,
      totalAmount: total,
    });
  }, [
    invoiceNumber,
    commercials,
    reimbursement,
    isGstApplicable,
    gstNumber,
    gstPercentage,
    onTotalChange,
    onDataChange,
  ]);

  // Check if all required fields are filled
  useEffect(() => {
    const isComplete =
      !!invoiceNumber &&
      commercials > 0 &&
      (!isGstApplicable || (isGstApplicable && !!gstNumber));
    onComplete(isComplete);
  }, [invoiceNumber, commercials, isGstApplicable, gstNumber, onComplete]);

  // Handle commercials input change
  const handleCommercialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setCommercials(value);
  };

  // Handle reimbursement input change
  const handleReimbursementChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setReimbursement(value);
  };

  return (
    <div className="w-full p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transition-all hover:shadow-xl hover:bg-white/15">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        Financial Details
      </h2>

      <div className="space-y-6">
        {/* Invoice Number */}
        <div className="space-y-2">
          <Label htmlFor="invoice-number" className="text-white">
            Invoice Number <span className="text-red-400">*</span>
          </Label>
          <Input
            id="invoice-number"
            type="text"
            placeholder="INV-001"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Commercials */}
        <div className="space-y-2">
          <Label htmlFor="commercials" className="text-white">
            Commercials (₹) <span className="text-red-400">*</span>
          </Label>
          <Input
            id="commercials"
            type="number"
            placeholder="0.00"
            value={commercials || ""}
            onChange={handleCommercialsChange}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Reimbursement */}
        <div className="space-y-2">
          <Label htmlFor="reimbursement" className="text-white">
            Reimbursement (₹)
          </Label>
          <Input
            id="reimbursement"
            type="number"
            placeholder="0.00"
            value={reimbursement || ""}
            onChange={handleReimbursementChange}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>

        {/* GST Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="gst-applicable"
            checked={isGstApplicable}
            onCheckedChange={(checked) => setIsGstApplicable(checked === true)}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label htmlFor="gst-applicable" className="text-white cursor-pointer">
            GST Applicable
          </Label>
        </div>

        {/* Conditional GST Fields */}
        {isGstApplicable && (
          <div className="space-y-4 pl-6 border-l-2 border-blue-400 mt-2">
            <div className="space-y-2">
              <Label htmlFor="gst-number" className="text-white">
                GST Number <span className="text-red-400">*</span>
              </Label>
              <Input
                id="gst-number"
                type="text"
                placeholder="22AAAAA0000A1Z5"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst-percentage" className="text-white">
                GST Percentage (%)
              </Label>
              <Input
                id="gst-percentage"
                type="number"
                placeholder="18"
                value={gstPercentage}
                onChange={(e) =>
                  setGstPercentage(parseFloat(e.target.value) || 0)
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="mt-2 text-sm text-blue-300">
              GST Amount: ₹{((commercials * gstPercentage) / 100).toFixed(2)}
            </div>
          </div>
        )}

        {/* Total Amount */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-white">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDetailsSection;
