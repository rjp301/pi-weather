import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Button } from "./ui/button";

interface Props {
  dateString: string;
}

export function SendEmail(props: Props) {
  const { dateString } = props;
  const [test, setTest] = useState(true);
  return (
    <form action={`/api/sendEmail/?date=${dateString}&test=${test}`} method="post">
      <div className="flex items-center space-x-2">
        <Switch
          id="airplane-mode"
          checked={test}
          onCheckedChange={(e) => setTest(e.valueOf)}
        />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
      <Button>Email to Recipients</Button>
    </form>
  );
}
