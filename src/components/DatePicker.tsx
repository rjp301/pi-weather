import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateTime } from "luxon";

interface Props {
  currentDate?: Date;
}

export function DatePicker(props: Props) {
  const { currentDate } = props;

  const [date, setDate] = React.useState(currentDate);

  React.useEffect(() => {
    console.log(date);
  }, [date]);

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <a
        href={
          date
            ? `/weather/${DateTime.fromJSDate(date).toISODate()}`
            : "/weather"
        }
      >
        <Button
          type="submit"
          variant="secondary"
          disabled={currentDate === date}
        >
          Go to Date
        </Button>
      </a>
    </div>
  );
}
