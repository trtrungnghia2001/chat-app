import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { URLSearchParamsInit } from "react-router-dom";

const useSearchParamsValue = (defaultInit?: URLSearchParamsInit) => {
  const [searchParams, setSearchParams] = useSearchParams(defaultInit);

  const handleSearchParams = useCallback(
    (name: string, value: string) => {
      setSearchParams((prev) => {
        prev.set(name, value as unknown as string);
        return prev;
      });
    },
    [searchParams]
  );
  return { searchParams, handleSearchParams };
};

export default useSearchParamsValue;
