import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  dateString: string;
}

export const SendEmail: React.FC<Props> = (props) => {
  const { dateString } = props;
  const [testEmail, setTestEmail] = React.useState(true);
  const [sending, setSending] = React.useState(false);

  const handleClick = async () => {
    setSending(true);
    const formData = new FormData();
    formData.append("date", dateString);
    formData.append("test", testEmail ? "on" : "off");

    fetch("/api/send-email", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        console.log(res);
        setSending(false);
        if (!res.ok)
          return res.json().then((body) =>
            toast({
              title: body.title,
              description: body.description,
              variant: "destructive",
            })
          );
        toast({
          title: "Email Sent",
          description: `Weather summary sent for ${dateString} to ${
            testEmail ? "testers" : "everyone"
          }`,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex gap-4">
      <input type="hidden" name="date" value={dateString} />
      <div className="flex items-center space-x-2">
        <Checkbox
          id="test"
          name="test"
          checked={testEmail}
          onCheckedChange={(checked) => console.log(checked)}
        />
        <Label htmlFor="test">Tester Emails Only</Label>
      </div>
      <Button type="submit" disabled={sending} onClick={handleClick}>
        <FontAwesomeIcon
          icon={sending ? faSpinner : faPaperPlane}
          className={cn("h-4 w-4 mr-2", sending && "animate-spin")}
        />
        Send Summary
      </Button>
    </div>
  );
};
