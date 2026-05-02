"use client";

import * as React from "react";
import { Search, RotateCcw, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/common.utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaginatedDropdown } from "./PaginatedDropdown";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: FilterOption[];
  placeholder?: string;
  isSearchable?: boolean;
  disabled?: boolean;
  fetchData?: (params: {
    search: string;
    page: number;
    limit: number;
  }) => Promise<{
    options: FilterOption[];
    hasMore: boolean;
  }>;
  queryKey?: string[];
  selectedLabel?: string;
}

interface FilterBarProps {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters?: FilterConfig[];
  onReset?: () => void;
  className?: string;
}

export function FilterBar({
  search,
  filters,
  onReset,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end",
        className,
      )}>
      {/* Search Input */}
      {search && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
            Search
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder={search?.placeholder || "Search..."}
              value={search?.value}
              onChange={(e) => search?.onChange(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>
      )}

      {/* Dynamic Filters */}
      {filters &&
        filters?.map((filter) => (
          <div key={filter?.key} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              {filter?.label}
            </label>
            {filter?.fetchData && filter?.queryKey ? (
              <PaginatedDropdown
                value={filter?.value}
                onValueChange={filter?.onChange}
                fetchData={filter?.fetchData}
                queryKey={filter?.queryKey}
                selectedLabel={filter?.selectedLabel}
                placeholder={filter?.placeholder || `All ${filter?.label}`}
                disabled={filter?.disabled}
                isClearable
                clearLabel={`All ${filter?.label}`}
              />
            ) : filter?.isSearchable ? (
              <SearchableSelect
                value={filter?.value}
                onChange={filter?.onChange}
                options={filter?.options || []}
                placeholder={
                  filter?.placeholder || `Select ${filter?.label}...`
                }
                disabled={filter?.disabled}
              />
            ) : (
              <Select
                value={filter?.value || "all"}
                onValueChange={(val) =>
                  filter?.onChange(val === "all" ? "" : val)
                }
                disabled={filter?.disabled}>
                <SelectTrigger className="h-10 w-full focus:ring-2 focus:ring-blue-500/30 text-sm">
                  <SelectValue placeholder={filter?.placeholder || "All"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter?.label}</SelectItem>
                  {filter?.options?.map((option) => (
                    <SelectItem key={option?.value} value={option?.value}>
                      {option?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}

      {/* Reset Button */}
      {onReset && (
        <div className="flex items-center h-10">
          <Button
            size="sm"
            onClick={onReset}
            className="flex items-center gap-2 border-gray-200 h-10 px-3 transition-colors cursor-pointer">
            <RotateCcw size={16} />
            <span className="text-sm font-medium">Reset</span>
          </Button>
        </div>
      )}
    </div>
  );
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
  disabled?: boolean;
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options?.find((option) => option?.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-10 w-full justify-between font-normal border-gray-200 hover:bg-white hover:text-black text-sm">
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange("");
                  setOpen(false);
                }}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "" ? "opacity-100" : "opacity-0",
                  )}
                />
                All
              </CommandItem>
              {options &&
                options?.map((option) => (
                  <CommandItem
                    key={option?.value}
                    value={option?.label}
                    onSelect={() => {
                      onChange(option?.value);
                      setOpen(false);
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option?.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
