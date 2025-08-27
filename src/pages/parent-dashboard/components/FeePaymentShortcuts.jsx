import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeePaymentShortcuts = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const outstandingFees = [
    {
      id: 1,
      type: "Tuition Fee",
      amount: 1250.00,
      dueDate: "2025-08-15",
      status: "pending",
      description: "Monthly tuition fee for August 2025"
    },
    {
      id: 2,
      type: "Activity Fee",
      amount: 75.00,
      dueDate: "2025-08-10",
      status: "overdue",
      description: "Science lab and sports activities"
    },
    {
      id: 3,
      type: "Field Trip",
      amount: 45.00,
      dueDate: "2025-08-05",
      status: "pending",
      description: "Science Museum visit - Grade 8"
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'bank', name: 'Bank Transfer', icon: 'Building2' },
    { id: 'paypal', name: 'PayPal', icon: 'Wallet' },
    { id: 'apple', name: 'Apple Pay', icon: 'Smartphone' }
  ];

  const recentPayments = [
    {
      id: 1,
      type: "Tuition Fee",
      amount: 1250.00,
      date: "2025-07-15",
      status: "completed",
      method: "Credit Card"
    },
    {
      id: 2,
      type: "Book Fee",
      amount: 180.00,
      date: "2025-07-10",
      status: "completed",
      method: "Bank Transfer"
    }
  ];

  const totalOutstanding = outstandingFees.reduce((sum, fee) => sum + fee.amount, 0);
  const overdueAmount = outstandingFees.filter(fee => fee.status === 'overdue').reduce((sum, fee) => sum + fee.amount, 0);

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning/10 text-warning border-warning/20",
      overdue: "bg-error/10 text-error border-error/20",
      completed: "bg-success/10 text-success border-success/20"
    };
    return badges[status] || badges.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Fee Payments</h2>
          <Button variant="ghost" size="sm" iconName="Receipt">
            Payment History
          </Button>
        </div>

        {/* Outstanding Balance Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <span className="text-sm font-medium text-error">Total Outstanding</span>
            </div>
            <div className="text-2xl font-bold text-error">{formatCurrency(totalOutstanding)}</div>
          </div>
          
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Clock" size={16} color="var(--color-warning)" />
              <span className="text-sm font-medium text-warning">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-warning">{formatCurrency(overdueAmount)}</div>
          </div>
        </div>
      </div>

      {/* Outstanding Fees */}
      <div className="p-6 border-b border-border">
        <h3 className="font-medium text-foreground mb-4">Outstanding Fees</h3>
        <div className="space-y-3">
          {outstandingFees.map((fee) => (
            <div key={fee.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground">{fee.type}</h4>
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusBadge(fee.status)}`}>
                    {fee.status}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{fee.description}</p>
                <p className="text-xs text-muted-foreground">{getDaysUntilDue(fee.dueDate)}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">{formatCurrency(fee.amount)}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="CreditCard"
                  onClick={() => setSelectedPayment(fee.id)}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Pay All */}
        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Pay All Outstanding</h4>
              <p className="text-sm text-muted-foreground">Save time by paying all fees at once</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">{formatCurrency(totalOutstanding)}</div>
              <Button variant="default" iconName="Zap">
                Quick Pay All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-6 border-b border-border">
        <h3 className="font-medium text-foreground mb-4">Payment Methods</h3>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <Icon name={method.icon} size={20} color="var(--color-muted-foreground)" />
              <span className="text-sm font-medium text-foreground">{method.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="p-6">
        <h3 className="font-medium text-foreground mb-4">Recent Payments</h3>
        <div className="space-y-3">
          {recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{payment.type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString()} • {payment.method}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-foreground">{formatCurrency(payment.amount)}</div>
                <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusBadge(payment.status)}`}>
                  {payment.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeePaymentShortcuts;