import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Image from "components/AppImage";

const PaymentMethodSelector = ({
  savedCards,
  onPaymentMethodSelect,
  selectedMethod,
  onAddPaymentMethod,
}) => {
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [newCardData, setNewCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const handleNewCardSubmit = (e) => {
    e?.preventDefault();

    const errors = validateCardData(newCardData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors); // show errors
      return;
    }

    setFieldErrors({});
    onAddPaymentMethod(newCardData);
    setNewCardData({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
    setShowNewCardForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewCardData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateCardData = (data) => {
    const errors = {};

    // Cardholder Name
    if (!data.cardholderName?.trim()) {
      errors.cardholderName = "Cardholder name is required";
    }

    // Card Number
    if (!data.cardNumber?.trim()) {
      errors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(data.cardNumber.replace(/\s+/g, ""))) {
      errors.cardNumber = "Card number must be 16 digits";
    }

    // Expiry Date
    if (!data.expiryDate?.trim()) {
      errors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)) {
      errors.expiryDate = "Expiry date must be in MM/YY format";
    }

    // CVV
    if (!data.cvv?.trim()) {
      errors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(data.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits";
    }

    return errors;
  };

  return (
    <div className="bg-card rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Saved Payment Methods
        </h2>
      </div>
      {/* Saved Cards */}
      {savedCards?.length > 0 && (
        <div className="mb-6">
          <div
            className={`space-y-3 overflow-auto ${
              savedCards?.length > 2 && "max-h-[250px]"
            }`}
          >
            {savedCards?.map((card) => (
              <div
                key={card?.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedMethod?.data?.id === card?.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() =>
                  onPaymentMethodSelect({ type: "saved_card", data: card })
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {card?.brand === "Card" ? (
                      <Icon
                        name={"CreditCard"}
                        size={30}
                        className="text-primary"
                      />
                    ) : (
                      <Image
                        src={`${
                          card?.brand === "Visa"
                            ? "/assets/images/visa.svg"
                            : "/assets/images/mastercard.svg"
                        }`}
                        alt={card?.brand}
                      />
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        •••• •••• •••• {card?.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {card?.brand} • Expires {card?.expiry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {card?.isDefault && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                    <Icon
                      name={
                        selectedMethod?.data?.id === card?.id
                          ? "CheckCircle"
                          : "Circle"
                      }
                      size={20}
                      className={
                        selectedMethod?.data?.id === card?.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Add New Card */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            Add New Payment Method
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewCardForm(!showNewCardForm)}
            iconName={showNewCardForm ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showNewCardForm ? "Hide Form" : "Add New Card"}
          </Button>
        </div>

        {showNewCardForm && (
          <form
            onSubmit={handleNewCardSubmit}
            className="space-y-4 p-4 bg-muted rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cardholder Name"
                type="text"
                placeholder="John Doe"
                value={newCardData?.cardholderName}
                onChange={(e) =>
                  handleInputChange("cardholderName", e?.target?.value)
                }
                required
                error={fieldErrors.cardholderName}
              />
              <Input
                label="Card Number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={newCardData?.cardNumber}
                onChange={(e) =>
                  handleInputChange("cardNumber", e?.target?.value)
                }
                required
                error={fieldErrors.cardNumber}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                type="text"
                placeholder="MM/YY"
                value={newCardData?.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e?.target?.value)
                }
                required
                error={fieldErrors.expiryDate}
              />
              <Input
                label="CVV"
                type="text"
                placeholder="123"
                value={newCardData?.cvv}
                onChange={(e) => handleInputChange("cvv", e?.target?.value)}
                required
                error={fieldErrors.cvv}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFieldErrors({});
                  setNewCardData({});
                  setShowNewCardForm(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Save Card
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
