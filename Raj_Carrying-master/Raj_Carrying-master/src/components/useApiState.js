import { useState } from "react";

export function useApiState(action) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const clearApiState = () => {
    setLoading(false);
    setError(null);
    setData(null);
  }

  // The incoming "action" argument to the hook is NOT performed.
  // It is only stored in the function scope; so that, we can use it when
  // performing the action using the following function
  // This function is returned as the second element in the returned array
  async function performAction(body = null) {
    try {
      setLoading(true);
      setData(null);
      setError(null);
      // Calling the action function here
      const data = await action(body);
      setData(data);
    } catch (e) {
      setError({"msg":e.message, "data": body});
    } finally {
      setLoading(false);
    }
  }

  return [{ loading, data, error }, performAction, clearApiState];
}
