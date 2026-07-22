import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check, Search } from "lucide-react";
import { CommonError } from "@/components/ui/common-error";
import { cn } from "@/utils/common.utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface PaginatedDropdownProps {
  value?: string;
  onValueChange: (value: string, label?: string) => void;
  fetchData: (params: {
    search: string;
    page: number;
    limit: number;
  }) => Promise<{
    options: DropdownOption[];
    hasMore: boolean;
  }>;
  queryKey: any[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  selectedLabel?: string;
  limit?: number;
  isClearable?: boolean;
  clearLabel?: string;
  onItemsLoaded?: (totalItems: number) => void;
  className?: string;
  selectedValues?: string[];
}

export function PaginatedDropdown({
  value,
  onValueChange,
  fetchData,
  queryKey,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  disabled = false,
  selectedLabel,
  isClearable = false,
  clearLabel = "All",
  limit = 10,
  onItemsLoaded,
  className,
  selectedValues = [],
}: PaginatedDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [...queryKey, debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchData({
        search: debouncedSearch,
        page: pageParam as number,
        limit,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const options = data?.pages?.flatMap((page) => page?.options) ?? [];

  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && data) {
      onItemsLoaded?.(options?.length);
    }
  }, [options.length, isLoading, isFetchingNextPage, onItemsLoaded]);

  // Default to finding the label in the options array if not provided explicitly
  const displayLabel =
    selectedLabel ?? options?.find((opt) => opt?.value === value)?.label;

  // Handle search value change with debounce-like behavior if triggered internally
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Reset search when popover closes
  useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  const onLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between font-normal text-left px-3 h-10 w-full",
            className,
          )}
          disabled={disabled}>
          <span className="block truncate">
            {value ? displayLabel || placeholder : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start">
        <div className="flex flex-col max-h-[300px]">
          <div className="flex items-center border-b px-3 text-sm">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex-1 overflow-y-auto py-1 custom-scrollbar">
            {isError ? (
              <div className="p-4">
                <CommonError
                  message={(error as any)?.message || "Failed to load options"}
                  onRetry={refetch}
                  fullScreen={false}
                  className="min-h-[150px] p-2"
                />
              </div>
            ) : isLoading && options?.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary mb-2"></div>
                <span className="text-sm">Loading...</span>
              </div>
            ) : options?.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No options found.
              </div>
            ) : (
              <div className="px-1">
                {isClearable && !searchValue && (
                  <div
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      !value && "bg-accent/50",
                    )}
                    onClick={() => {
                      onValueChange("", "");
                      setOpen(false);
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {clearLabel}
                  </div>
                )}
                {options?.map((option) => {
                  const isSelected =
                    value === option?.value ||
                    selectedValues.includes(option?.value);
                  return (
                    <div
                      key={option?.value}
                      onClick={() => {
                        onValueChange(option?.value, option?.label);
                        setOpen(false);
                      }}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        isSelected ? "" : "",
                      )}>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option?.label}
                    </div>
                  );
                })}

                {isFetchingNextPage ? (
                  <div className="py-3 flex justify-center items-center text-xs text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary mr-2 hover:text-white"></div>
                    Loading more...
                  </div>
                ) : hasNextPage ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadMore();
                    }}
                    className="py-3 mt-1 flex justify-center items-center text-xs text-primary cursor-pointer hover:bg-accent rounded-sm mx-1 font-medium transition-colors hover:text-white">
                    Load more
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
