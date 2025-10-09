import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/Command'; 

// --- A Interface de Props do nosso Combobox ---
interface ComboboxProps {
  label: string;
  options: { value: string | number; label: string }[];
  value: string | number | null;
  onSelect: (value: string | number) => void;
  searchValue: string;
  onSearchChange: (search: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function Combobox({
  label,
  options,
  value,
  onSelect,
  searchValue,
  onSearchChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Busque uma opção...",
  emptyText = "Nenhuma opção encontrada.",
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                    disabled={disabled}
                >
                    {value ? selectedLabel : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput 
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onValueChange={onSearchChange}
                    />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.label} // O valor para busca é o label
                                onSelect={() => {
                                    onSelect(option.value);
                                    setOpen(false);
                                }}
                            >
                            <Check
                                className={cn(
                                'mr-2 h-4 w-4',
                                value === option.value ? 'opacity-100' : 'opacity-0'
                                )}
                            />
                            {option.label}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    </div>
  );
}