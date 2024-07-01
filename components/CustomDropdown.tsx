"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Dropdown {
  title: string;
  data: Array<string | number>;
  onSelect: (value: string | number) => void;
}

export function CustomDropdown({ title, data, onSelect }: Dropdown) {
  const [selectedValue, setSelectedValue] = React.useState(data[0]);

  const handleSelect = (value: string | number) => {
    setSelectedValue(value.toString());
    onSelect(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedValue.toString()}
          onValueChange={handleSelect}
        >
          {data.map((item, index) => (
            <DropdownMenuRadioItem key={index} value={item.toString()}>
              {item}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
