import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const EmailDialog: React.FC = () => (
  <Dialog>
    <DialogTrigger className={buttonVariants({ variant: "secondary" })}>
      <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
      Add Email
    </DialogTrigger>
    <DialogContent>
      <form action={`/api/emails`} method="POST">
        <DialogHeader>
          <DialogTitle>Add Email</DialogTitle>
          <DialogDescription>
            Add recipient of daily weather email
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input type="email" name="email" placeholder="Email" required />
          <div className="flex items-center space-x-2">
            <Checkbox name="tester" id="tester" />
            <Label htmlFor="tester">Tester</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            <FontAwesomeIcon icon={faSave} className="h-4 w-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);
