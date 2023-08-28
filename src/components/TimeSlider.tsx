import { useState } from "react";
import { Slider } from "./ui/slider";

interface Props {
  default: number;
  name: string;
}

export default function TimeSlider(props: Props) {
  const [value, setValue] = useState(props.default);

  return (
    <div className="flex items-center gap-2">
      <span className="w-16">{`${value.toString().padStart(2, "0")}:00`}</span>
      <Slider
        name="email_time"
        id="email_time"
        max={24}
        min={0}
        step={1}
        defaultValue={[props.default]}
        onValueChange={(value) => setValue(value[0])}
      />
    </div>
  );
}
