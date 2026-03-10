import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { successToast, errorToast } from "../../../utils/utils";
import Loader from "components/ui/Loader";
import {
  createConnectedAccount,
  fetchAccountStatus,
  generateOnboardingLink,
} from "reducers/stripe/stripeThunks";

const ConnectedAccountTab = ({ showVerificationOnly = false }) => {
  const dispatch = useDispatch();
  const stripe = useSelector((s) => s.stripe);
  const authUser = useSelector((s) => s.auth?.user);
  const [loadingLocal, setLoadingLocal] = useState(false);

  useEffect(() => {
    // ensure account status loaded
    dispatch(fetchAccountStatus());
  }, [dispatch]);

  const handleCreateAccount = async () => {
    setLoadingLocal(true);
    try {
      const res = await dispatch(
        createConnectedAccount({
          type: "express",
          country: "US",
          business_type: "individual",
        }),
      ).unwrap();
      successToast("Connected account created.");
      // fetch status
      await dispatch(fetchAccountStatus());
      setLoadingLocal(false);
    } catch (err) {
      setLoadingLocal(false);
      errorToast(err?.message || "Failed to create account");
    }
  };

  const handleStartOnboarding = async () => {
    try {
      const resp = await dispatch(
        generateOnboardingLink({
          return_url: window.location.href,
          refresh_url: window.location.href,
        }),
      ).unwrap();
      const url = resp?.url || resp;
      if (url) {
        // redirect to Stripe onboarding
        window.location.href = url;
      } else {
        errorToast("Failed to generate onboarding link");
      }
    } catch (err) {
      errorToast(err?.message || "Failed to create onboarding link");
    }
  };

  const account = stripe.selectedAccount;

  if (loadingLocal || stripe.loading) return <Loader />;

  // UI logic: teacher (independent) & school both see same flows
  return (
    <div>
      {!account && (
        <div>
          <p>No connected account found for your profile.</p>
          <div className="mt-4">
            <button
              onClick={handleCreateAccount}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Create Connected Account
            </button>
          </div>
        </div>
      )}

      {account && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Stripe Account</h3>
              <p className="text-sm text-text-secondary">
                Account ID: {account.id}
              </p>
            </div>
            <div>
              <button
                onClick={handleStartOnboarding}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Complete Onboarding
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded">
              <p>
                <strong>Charges enabled:</strong>{" "}
                {String(account.charges_enabled)}
              </p>
              <p>
                <strong>Payouts enabled:</strong>{" "}
                {String(account.payouts_enabled)}
              </p>
            </div>
            <div className="p-4 bg-muted rounded">
              <p>
                <strong>Country:</strong> {account.country}
              </p>
              <p>
                <strong>Missing requirements:</strong>{" "}
                {(account.requirements?.currently_due || []).join(", ") ||
                  "None"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedAccountTab;
