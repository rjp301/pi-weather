import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Record } from "pocketbase";
import { faEdit, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  data?: Record;
}

export const StationDialog: React.FC<Props> = (props) => {
  const { data } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>
        {data ? (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground"
          >
            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="secondary">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
            Add Station
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form
          action={data ? `/api/stations/${data.id}/update` : "/api/stations"}
          method="post"
        >
          <DialogHeader>
            <DialogTitle>{data ? "Edit " : "Add "} Weather Station</DialogTitle>
            <DialogDescription>
              Values should match those on Weather Underground
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={data?.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>ID</Label>
              <Input
                type="text"
                name="wu_id"
                placeholder="ID"
                defaultValue={data?.wu_id}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                type="number"
                name="lat"
                placeholder="Latitude"
                defaultValue={data?.lat}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                type="number"
                name="lon"
                placeholder="Longitude"
                defaultValue={data?.lon}
                required
              />
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
};
