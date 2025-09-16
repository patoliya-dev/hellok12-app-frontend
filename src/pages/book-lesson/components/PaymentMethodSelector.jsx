import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Image from "components/AppImage";

const PaymentMethodSelector = ({
  savedCards,
  onPaymentMethodSelect,
  selectedMethod,
}) => {
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCardData, setNewCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const handleNewCardSubmit = (e) => {
    e?.preventDefault();
    onPaymentMethodSelect({
      type: "new_card",
      data: newCardData,
    });
    setShowNewCardForm(false);
  };

  const handleInputChange = (field, value) => {
    if (field?.includes(".")) {
      const [parent, child] = field?.split(".");
      setNewCardData((prev) => ({
        ...prev,
        [parent]: {
          ...prev?.[parent],
          [child]: value,
        },
      }));
    } else {
      setNewCardData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Payment Method
        </h2>
      </div>
      {/* Saved Cards */}
      {savedCards?.length > 0 && (
        <div className="mb-6">
          <div className="space-y-3">
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
                    <Image
                      src={`${
                        card?.brand === "Visa"
                          ? "/assets/images/visa.svg"
                          : "/assets/images/mastercard.svg"
                      }`}
                      alt="abcd"
                    />
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
              />
              <Input
                label="CVV"
                type="text"
                placeholder="123"
                value={newCardData?.cvv}
                onChange={(e) => handleInputChange("cvv", e?.target?.value)}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewCardForm(false)}
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

      {/* Coupon Code */}
      <div className="">
        <h3 className="font-semibold text-foreground mb-5">
          Apply coupon code
        </h3>
        <div className="flex items-center justify-between space-x-3 border border-[#E2E8F0] rounded-[8px] py-3 pr-3">
          <Input
            placeholder="Enter coupon code"
            className="focus:!ring-0 focus:!border-none focus:!outline-none focus:!ring-offset-0"
          />
          <Button variant="default" className="px-10">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
