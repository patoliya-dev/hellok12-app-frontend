import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "features/auth/authThunks";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    }
  }, [status, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "succeeded" && <p>Email verified ✅ Redirecting to login...</p>}
      {status === "failed" && <p style={{ color: "red" }}>❌ {error}</p>}
    </div>
  );
}
