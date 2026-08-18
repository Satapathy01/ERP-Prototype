"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

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

import { useAdmissionSearch } from "@/hooks/use-admission-search";

import type { AdmissionSearchResult } from "@/modules/finance/services/types";

interface Props {
  value: string;
  onChange: (admission: AdmissionSearchResult) => void;
}

export function AdmissionCombobox({
  value,
  onChange,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const {
    data: admissions = [],
    isLoading,
    isError,
  } = useAdmissionSearch(search);

  const selected = admissions.find(
    (admission) => admission.id === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">
            {selected
              ? `${selected.student.name} • ${selected.student.registrationNumber}`
              : "Search Student"}
          </span>

          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search student..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            {isLoading && search.length >= 2 ? (
              <CommandEmpty>
                Searching...
              </CommandEmpty>
            ) : isError ? (
              <CommandEmpty>
                Failed to search students
              </CommandEmpty>
            ) : search.length < 2 ? (
              <CommandEmpty>
                Type at least 2 characters
              </CommandEmpty>
            ) : admissions.length === 0 ? (
              <CommandEmpty>
                No student found
              </CommandEmpty>
            ) : (
              <CommandGroup heading="Students">
                {admissions.map((admission) => {
                  const isSelected =
                    admission.id === value;

                  return (
                    <CommandItem
                      key={admission.id}
                      value={`${admission.student.name} ${admission.student.registrationNumber}`}
                      onSelect={() => {
                        onChange(admission);
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-medium">
                          {admission.student.name}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          Reg:{" "}
                          {admission.student.registrationNumber}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {admission.course.code}
                          {" • "}
                          {admission.course.name}
                          {" • "}
                          {admission.batch?.name ??
                            "No Batch"}
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="ml-2 size-4 shrink-0" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}