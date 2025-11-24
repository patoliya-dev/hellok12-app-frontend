import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Image from "components/AppImage";
import { useDispatch } from "react-redux";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { createSetupIntent, fetchPaymentMethods } from "../../../../reducers/payments/paymentsThunks";
import { successToast, errorToast } from "../../../../utils/utils";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      "::placeholder": {
        color: "#a0aec0",
      },
      fontFamily: "inherit",
    },
    invalid: {
      color: "#e53e3e",
    },
  },
};

const PaymentMethodSelector = ({
  savedCards,
  onPaymentMethodSelect,
  selectedMethod,
  onAddPaymentMethod,
}) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [billingName, setBillingName] = useState("");

  const handleNewCardSubmit = async (e) => {
    e?.preventDefault();
    if (!stripe || !elements) {
      errorToast("Stripe is not loaded. Please try again.");
      return;
    }
    if (!billingName?.trim()) {
      setFieldErrors({ billingName: "Cardholder name is required" });
      return;
    }
    setFieldErrors({});
    setIsSaving(true);

    try {
      // 1) create SetupIntent on server (no card data)
      const res = await dispatch(createSetupIntent()).unwrap();
      const clientSecret = res?.client_secret || res?.data?.client_secret || res?.clientSecret || res?.lastClientSecret;
      if (!clientSecret) throw new Error("Failed to create setup intent");

      // 2) confirm SetupIntent client-side
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingName,
          },
        },
      });

      if (result.error) {
        throw result.error;
      }

      // Success: result.setupIntent.payment_method contains PM id
      const paymentMethodId = result.setupIntent?.payment_method;

      // Refresh server list of payment methods
      await dispatch(fetchPaymentMethods()).unwrap();

      // Notify parent (BookLesson) so it can set selectedPaymentMethod
      if (typeof onAddPaymentMethod === "function") {
        onAddPaymentMethod({ paymentMethodId, pm: null });
      }

      successToast("Card saved successfully");
      setShowNewCardForm(false);
      setBillingName("");
    } catch (err) {
      console.error("Save card failed", err);
      const message = err?.message || (err?.error && err.error.message) || "Failed to save card";
      errorToast(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Saved Payment Methods</h2>
      </div>

      {/* Saved Cards */}
      {savedCards?.length > 0 && (
        <div className="mb-6">
          <div className={`space-y-3 overflow-auto ${savedCards?.length > 2 && "max-h-[250px]"}`}>
            {savedCards?.map((card) => (
              <div
                key={card?.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedMethod?.data?.id === card?.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                onClick={() => onPaymentMethodSelect({ type: "saved_card", data: card })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {card?.brand === "Card" ? (
                      <Icon name={"CreditCard"} size={30} className="text-primary" />
                    ) : (
                      <Image src={`${card?.brand === "Visa" ? "/assets/images/visa.svg" : "/assets/images/mastercard.svg"}`} alt={card?.brand} />
                    )}
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• {card?.last4}</p>
                      <p className="text-sm text-muted-foreground">
                        {card?.brand} • Expires {card?.expiry || `${card?.exp_month}/${String(card?.exp_year)?.slice(-2)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {card?.isDefault && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>}
                    <Icon
                      name={selectedMethod?.data?.id === card?.id ? "CheckCircle" : "Circle"}
                      size={20}
                      className={selectedMethod?.data?.id === card?.id ? "text-primary" : "text-muted-foreground"}
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
          <h3 className="font-semibold text-foreground">Add New Payment Method</h3>
          <Button variant="outline" size="sm" onClick={() => setShowNewCardForm(!showNewCardForm)} iconName={showNewCardForm ? "ChevronUp" : "ChevronDown"} iconPosition="right">
            {showNewCardForm ? "Hide Form" : "Add New Card"}
          </Button>
        </div>

        {showNewCardForm && (
          <form onSubmit={handleNewCardSubmit} className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <Input label="Cardholder Name" type="text" placeholder="John Doe" value={billingName} onChange={(e) => setBillingName(e.target.value)} required error={fieldErrors.billingName} />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Card details</label>
              <div className="p-3 border rounded-md bg-white">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => { setFieldErrors({}); setBillingName(""); setShowNewCardForm(false); }}>
                Cancel
              </Button>
              <Button type="submit" variant="default" disabled={!stripe || isSaving}>
                {isSaving ? "Saving..." : "Save Card"}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Coupon */}
      <div className="">
        <h3 className="font-semibold text-foreground mb-5">Apply coupon code</h3>
        <div className="flex items-center justify-between space-x-3 border border-[#E2E8F0] rounded-[8px] p-3">
          <Input placeholder="Enter coupon code" value={""} onChange={() => { }} className="focus:!ring-0 focus:!border-none focus:!outline-none focus:!ring-offset-0" />
          <Button variant="default" className="px-10" onClick={() => successToast("Coupon applied (demo)")}>Apply</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
