import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Button from "components/ui/Button";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { errorToast, successToast } from "../../../utils/utils";
import { payoutAccountService } from "../../../services/payoutAccount.service";

const ACCOUNT_TYPE_OPTIONS = [
  { label: "Savings", value: "SAVINGS" },
  { label: "Current", value: "CURRENT" },
];

const STATUS_CLASS = {
  PENDING: "bg-amber-100 text-amber-700",
  VERIFIED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const initialForm = {
  holderName: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  branchName: "",
  accountType: "",
  upiId: "",
  country: "IN",
  currency: "INR",
};

const PayoutAccountPage = () => {
  const authUser = useSelector(selectAuthUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState(initialForm);

  const editableSensitiveFields = useMemo(
    () => [
      "holderName",
      "bankName",
      "accountNumber",
      "ifsc",
      "branchName",
      "accountType",
      "upiId",
    ],
    [],
  );

  const hasSensitiveChanges = useMemo(() => {
    if (!account) return false;
    return editableSensitiveFields.some((key) => {
      if (key === "accountNumber") return Boolean(form.accountNumber.trim());
      return (
        String(form[key] || "").trim() !== String(account[key] || "").trim()
      );
    });
  }, [account, editableSensitiveFields, form]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await payoutAccountService.getMe();
      if (data?._id) {
        setAccount(data);
        setForm({
          holderName: data.holderName || "",
          bankName: data.bankName || "",
          accountNumber: "",
          ifsc: data.ifsc || "",
          branchName: data.branchName || "",
          accountType: data.accountType || "",
          upiId: "",
          country: data.country || "IN",
          currency: data.currency || "INR",
        });
      }
    } catch (e) {
      if (e?.response?.status !== 404) {
        errorToast(
          e?.response?.data?.error ||
            e?.message ||
            "Failed to load payout details",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.holderName.trim()) return "Account holder name is required";
    if (!form.bankName.trim()) return "Bank name is required";
    if (!account && !form.accountNumber.trim())
      return "Account number is required";
    if (form.ifsc && !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(form.ifsc.trim())) {
      return "Invalid IFSC format";
    }
    if (
      form.upiId &&
      !/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(form.upiId.trim())
    ) {
      return "Invalid UPI format";
    }
    return "";
  };

  const buildPayload = () => {
    const payload = {
      holderName: form.holderName.trim(),
      bankName: form.bankName.trim(),
      ifsc: form.ifsc.trim().toUpperCase(),
      branchName: form.branchName.trim(),
      accountType: form.accountType || undefined,
      upiId: form.upiId.trim() || undefined,
      country: (form.country || "IN").toUpperCase(),
      currency: (form.currency || "INR").toUpperCase(),
    };
    if (!account || form.accountNumber.trim()) {
      payload.accountNumber = form.accountNumber.trim();
    }
    return payload;
  };

  const onSave = async () => {
    const message = validate();
    if (message) {
      errorToast(message);
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      const data = account
        ? await payoutAccountService.patchMe(payload)
        : await payoutAccountService.createMe(payload);
      successToast("Payout details saved");
      setAccount(data);
      setForm((prev) => ({
        ...prev,
        accountNumber: "",
        upiId: "",
      }));
    } catch (e) {
      errorToast(
        e?.response?.data?.error ||
          e?.message ||
          "Failed to save payout details",
      );
    } finally {
      setSaving(false);
    }
  };

  const roleTitle = authUser?.role === "school" ? "School" : "Teacher";
  const status = String(account?.status || "PENDING");

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <main className="pt-16 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="my-8">
            <h1 className="text-3xl font-bold text-foreground">
              Payout / Bank Details
            </h1>
            <p className="text-text-secondary mt-1">
              {roleTitle} payout account used for manual payouts.
            </p>
          </div>

          <section className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Account Information
              </h2>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CLASS[status] || "bg-slate-100 text-slate-700"}`}
              >
                {status}
              </span>
            </div>

            {account?.status === "REJECTED" && account?.rejectionReason ? (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                Rejection reason: {account.rejectionReason}
              </div>
            ) : null}

            {account?._id && hasSensitiveChanges ? (
              <div className="mb-4 p-3 rounded-md bg-amber-50 text-amber-700 text-sm">
                Updating bank fields will reset verification status to PENDING.
              </div>
            ) : null}

            {account?.maskedAccountNumber ? (
              <div className="mb-4 text-sm text-muted-foreground">
                Saved account number:{" "}
                <span className="font-semibold text-foreground">
                  {account.maskedAccountNumber}
                </span>
              </div>
            ) : null}

            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading payout details...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Account Holder Name"
                  value={form.holderName}
                  onChange={(e) => setField("holderName", e.target.value)}
                />
                <Input
                  label="Bank Name"
                  value={form.bankName}
                  onChange={(e) => setField("bankName", e.target.value)}
                />
                <Input
                  label={
                    account
                      ? "Account Number (leave blank to keep existing)"
                      : "Account Number"
                  }
                  value={form.accountNumber}
                  onChange={(e) => setField("accountNumber", e.target.value)}
                />
                <Input
                  label="IFSC"
                  value={form.ifsc}
                  onChange={(e) => setField("ifsc", e.target.value)}
                />
                <Input
                  label="Branch Name (Optional)"
                  value={form.branchName}
                  onChange={(e) => setField("branchName", e.target.value)}
                />
                <Select
                  label="Account Type (Optional)"
                  options={ACCOUNT_TYPE_OPTIONS}
                  value={form.accountType}
                  onChange={(v) => setField("accountType", v)}
                  clearable
                />
                <Input
                  label="UPI ID (Optional)"
                  value={form.upiId}
                  onChange={(e) => setField("upiId", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Country"
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                  />
                  <Input
                    label="Currency"
                    value={form.currency}
                    onChange={(e) => setField("currency", e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="mt-5">
              <Button onClick={onSave} loading={saving}>
                Save
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PayoutAccountPage;
