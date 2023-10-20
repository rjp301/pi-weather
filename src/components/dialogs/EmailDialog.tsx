import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Save } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export const EmailDialog: React.FC = () => (
  <Dialog>
    <DialogTrigger className={buttonVariants({ variant: "secondary" })}>
      <Plus className="h-4 w-4 mr-2" />
      Add Email
    </DialogTrigger>
    <DialogContent>
      <form action={`/api/emails`} method="post">
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
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);
