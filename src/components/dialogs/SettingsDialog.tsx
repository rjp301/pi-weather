import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import type { Record } from "pocketbase";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import TimeSlider from "../TimeSlider";

interface Props {
  initialSettings: Record;
}

export const SettingsDialog: React.FC<Props> = (props) => {
  const { initialSettings } = props;
  const [settings, setSettings] = React.useState(initialSettings);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <FontAwesomeIcon icon={faGear} className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Edit configuration settings</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="wu_api_key">Weather Underground API Key</Label>
            <Input
              type="password"
              id="wu_api_key"
              name="wu_api_key"
              defaultValue={settings.wu_api_key}
              placeholder="API Key"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="times_of_interest">Time of Interest</Label>
            <Textarea
              id="times_of_interest"
              name="times_of_interest"
              className="font-mono"
              rows={10}
              defaultValue={JSON.stringify(settings.times_of_interest, null, 2)}
              placeholder="Time of Interest"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time_zone">
              Time Zone (
              <a
                href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
                className="underline text-sky-500"
              >
                Valid Options
              </a>
              )
            </Label>
            <Input
              type="text"
              id="time_zone"
              name="time_zone"
              defaultValue={settings.time_zone}
              placeholder="Time Zone"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email_time">Email Distribution Time</Label>
            <TimeSlider default={settings.email_time} name="email_time" />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={
              JSON.stringify(settings) === JSON.stringify(initialSettings)
            }
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
