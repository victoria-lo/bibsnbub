'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button as AriaButton, Input as AriaInput, Group, NumberField } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  amenities: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You must select at least one amenity.',
  }),
});

type SelectAmenitiesProps = {
  formData: {
    amenities: string[];
    amenityQuantities: Record<string, number>;
    hasDiaperChangingStation?: boolean;
    hasLactationRoom?: boolean;
  };
  setFormData: (data: any) => void;
  amenities: { id: string; name: string }[];
};

const SelectAmenities: React.FC<SelectAmenitiesProps> = ({ formData, setFormData, amenities }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amenities: formData.amenities || [],
    },
  });

  const handleCheckboxChange = (checked: boolean, amenityId: string, amenityName: string) => {
    setFormData((prev: any) => {
      const nextAmenities: string[] = checked
        ? Array.from(new Set([...(prev.amenities || []), amenityId]))
        : (prev.amenities || []).filter((v: string) => v !== amenityId);

      // default quantity to 1 when selected; remove when deselected
      const nextQuantities: Record<string, number> = { ...(prev.amenityQuantities || {}) };
      if (checked) {
        if (!nextQuantities[amenityId]) {
          nextQuantities[amenityId] = 1;
        }
      } else {
        delete nextQuantities[amenityId];
      }

      const lc = amenityName.toLowerCase();
      const toggles: any = {};
      if (lc === 'diaper changing station') {
        toggles.hasDiaperChangingStation = checked;
      }
      if (lc === 'lactation room') {
        toggles.hasLactationRoom = checked;
      }

      return {
        ...prev,
        amenities: nextAmenities,
        amenityQuantities: nextQuantities,
        ...toggles,
      };
    });
  };

  const setQuantity = (amenityId: string, qty: number) => {
    setFormData((prev: any) => ({
      ...prev,
      amenityQuantities: {
        ...(prev.amenityQuantities || {}),
        [amenityId]: Math.max(0, Math.min(99, Math.floor(qty || 0))),
      },
    }));
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Select Amenities</FormLabel>
                <FormDescription>
                  Choose the amenities available at the facility.
                </FormDescription>
              </div>
              {amenities.map(amenity => (
                <FormItem
                  key={amenity.id}
                  className="flex items-center gap-2"
                >
                  <FormControl>
                    <Checkbox
                      checked={formData.amenities.includes(amenity.id)}
                      onCheckedChange={checked => handleCheckboxChange(!!checked, amenity.id, amenity.name)}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal flex-1 min-w-0">
                    {amenity.name}
                  </FormLabel>
                  {formData.amenities.includes(amenity.id) && (
                    <NumberField
                      value={formData.amenityQuantities?.[amenity.id] ?? 1}
                      minValue={0}
                      onChange={val => setQuantity(amenity.id, Number(val))}
                      aria-label={`${amenity.name} quantity`}
                      className="ml-auto shrink-0 w-[100px] space-y-0"
                    >
                      <Group className="dark:bg-input/30 border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-8 items-center overflow-hidden rounded-md border bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-[3px] md:text-sm">
                        <AriaButton
                          slot="decrement"
                          className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <MinusIcon className="size-4" />
                          <span className="sr-only">Decrement</span>
                        </AriaButton>
                        <AriaInput className="selection:bg-primary selection:text-primary-foreground w-full grow px-3 py-2 text-center tabular-nums outline-none" />
                        <AriaButton
                          slot="increment"
                          className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <PlusIcon className="size-4" />
                          <span className="sr-only">Increment</span>
                        </AriaButton>
                      </Group>
                    </NumberField>
                  )}
                </FormItem>
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SelectAmenities;
