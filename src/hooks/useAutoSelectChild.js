import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { selectStudent } from "reducers/profile/profileSlice";

/**
 * Custom hook to automatically select the first child for parent users
 */
const useAutoSelectChild = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);

  useEffect(() => {
    if (
      authUser?.role === "parent" &&
      authUser?.profile?.children?.length > 0
    ) {
      if (!selectedChildId) {
        const firstChildId =
          authUser.profile.children[0]._id || authUser.profile.children[0].id;
        dispatch(selectStudent(firstChildId));
      }
    }
  }, [authUser, selectedChildId, dispatch]);
};

export default useAutoSelectChild;
