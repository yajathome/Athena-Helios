import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { WASTE_CATEGORIES } from "@/lib/constants";
import type { Class } from "@shared/schema";

const wasteReportSchema = z.object({
  wasteType: z.enum([
    "stock_paper", "food_waste", "plastic_bottles", "plastic_cutlery", 
    "plastic_wrappers", "plastic_packets", "chart_paper", "disposable_cups",
    "pens", "paper_tissues"
  ]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  classId: z.string().min(1, "Please select a class"),
  properlySegregated: z.boolean(),
});

type WasteReportForm = z.infer<typeof wasteReportSchema>;

interface WasteReportFormProps {
  children: React.ReactNode;
}

export default function WasteReportForm({ children }: WasteReportFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classes } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
  });

  const form = useForm<WasteReportForm>({
    resolver: zodResolver(wasteReportSchema),
    defaultValues: {
      quantity: 1,
      properlySegregated: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: WasteReportForm) => {
      await apiRequest("POST", "/api/waste/report", {
        ...data,
        location: "School Campus", 
        reportedBy: "janitor-user-id", 
      });
    },
    onSuccess: () => {
      toast({
        title: "Waste reported successfully",
        description: "The waste entry has been recorded and points have been updated.",
      });
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to report waste. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WasteReportForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Waste</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="wasteType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waste Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select waste type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(WASTE_CATEGORIES).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.icon} {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (number of items)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes?.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} - {cls.house.charAt(0).toUpperCase() + cls.house.slice(1)} House
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />



            <FormField
              control={form.control}
              name="properlySegregated"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Properly segregated
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Was the waste placed in the correct bin?
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Reporting..." : "Report Waste"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
