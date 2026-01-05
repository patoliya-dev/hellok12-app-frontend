import React, { useMemo } from "react";
import Button from "components/ui/Button";
import Icon from "components/AppIcon";

const StatusBadge = ({ status }) => {
  const s = String(status || "").toUpperCase();
  const cls =
    s === "PENDING"
      ? "bg-yellow-50 text-yellow-700 border-yellow-500"
      : s === "ACCEPTED"
      ? "bg-green-50 text-green-700 border-green-500"
      : s === "EXPIRED"
      ? "bg-gray-100 text-gray-700 border-gray-400"
      : s === "CANCELLED"
      ? "bg-red-50 text-red-700 border-red-500"
      : "bg-gray-100 text-gray-700 border-gray-400";

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${cls}`}>
      {s || "—"}
    </span>
  );
};

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString();
};

const InvitationTable = ({
  title = "Invitations",
  invitations = [],
  loading = false,
  onCancel,
  showRole = true
}) => {
  const rows = useMemo(() => invitations || [], [invitations]);

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="font-medium text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">Track pending and historical invitations</p>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="py-10 flex items-center justify-center text-muted-foreground">
            <Icon name="Loader2" className="animate-spin mr-2" size={18} />
            Loading invitations...
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No invitations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="py-3 px-3">Email</th>
                  {showRole && <th className="py-3 px-3">Role</th>}
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Invited On</th>
                  <th className="py-3 px-3">Expires</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((inv) => {
                  const status = String(inv.status || "").toUpperCase();
                  const canCancel = status === "PENDING";

                  return (
                    <tr key={inv._id} className="border-t border-border text-sm">
                      <td className="py-4 px-3 text-brand-gray-800">{inv.recipientEmail}</td>
                      {showRole && (
                        <td className="py-4 px-3 text-brand-gray-800">{inv.recipientRole}</td>
                      )}
                      <td className="py-4 px-3">
                        <StatusBadge status={status} />
                      </td>
                      <td className="py-4 px-3 text-brand-gray-800">{formatDate(inv.createdAt)}</td>
                      <td className="py-4 px-3 text-brand-gray-800">{formatDate(inv.expiresAt)}</td>
                      <td className="py-4 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!canCancel}
                          onClick={() => onCancel?.(inv)}
                          iconName="X"
                          iconPosition="left"
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationTable;
