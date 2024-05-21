import { settingInsertSchema, type Setting } from "@/api/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import api from "@/lib/client";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { CardHeader, CardTitle, CardDescription } from "../ui/card";

type Props = {
  initialData: Setting;
};

const SettingsForm: React.FC<Props> = (props) => {
  const { initialData } = props;

  const methods = useForm<Setting>({
    defaultValues: initialData,
    resolver: zodResolver(settingInsertSchema),
  });

  const { handleSubmit, control } = methods;

  const onSubmit = handleSubmit(async (data) =>
    api.settings
      .$post({ json: data })
      .then(() => {
        window.location.reload();
        toast.success("Settings saved");
      })
      .catch(() => {
        toast.error("Failed to save settings");
      }),
  );

  return (
    <Form {...methods}>
      <CardHeader className="px-0 pt-0">
        <CardTitle>Settings</CardTitle>
        <CardDescription>Edit configuration settings</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={control}
          name="wuApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weather Underground API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="API Key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="timeZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Time Zone (
                <a
                  href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
                  className="text-sky-500 underline"
                >
                  Valid Options
                </a>
                )
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Time Zone"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="timesOfInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time of Interest</FormLabel>
              <FormControl>
                <Textarea
                  id="times_of_interest"
                  className="font-mono"
                  rows={10}
                  placeholder="Time of Interest"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SettingsForm;
