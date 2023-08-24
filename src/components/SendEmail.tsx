import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";

interface Props {
  dateString: string;
}

export function SendEmail(props: Props) {
  const { dateString } = props;
  const [test, setTest] = useState(true);
  return (
    <div className="flex gap-4">
      <div className="flex items-center space-x-2">
        <Switch checked={test} onCheckedChange={(e) => setTest(e.valueOf())} />
        <Label>Test Email</Label>
      </div>
      <a href={`/sendEmail?date=${dateString}&test=${test}`}>
        <Button>Email to Recipients</Button>
      </a>
    </div>
  );
}
