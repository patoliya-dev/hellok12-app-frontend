import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBalance } from "reducers/stripe/stripeThunks";

const PayoutsTab = () => {
    const dispatch = useDispatch();
    const { balance } = useSelector(s => s.stripe);

    useEffect(() => { dispatch(fetchBalance()); }, [dispatch]);

    if (!balance) return <div>No balance available</div>;

    return (
        <div>
            <h3 className="font-semibold">Available Balance</h3>
            <div className="mt-4 p-4 bg-muted rounded">
                <p>Available: {(balance.available || []).map(b => `${(b.amount / 100).toFixed(2)} ${b.currency}`).join(", ")}</p>
                <p>Pending: {(balance.pending || []).map(b => `${(b.amount / 100).toFixed(2)} ${b.currency}`).join(", ")}</p>
            </div>
        </div>
    );
};

export default PayoutsTab;
