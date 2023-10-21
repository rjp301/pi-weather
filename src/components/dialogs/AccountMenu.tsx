import type React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { SettingsDialog } from "./SettingsDialog";

import type { Record } from "pocketbase";

interface Props {
  userObject: Record;
  imageUrl: string;
}

export const AccountMenu: React.FC<Props> = (props) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        <img src={props.imageUrl} alt="profile" className="h-6 mr-2" />
        {props.userObject.username}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <SettingsDialog initialSettings={props.userObject} />
      <form action="/api/auth/logout" method="POST">
        <Button size="sm" className="w-full justify-start" variant="ghost">
          <FontAwesomeIcon icon={faSignOut} className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </form>
    </DropdownMenuContent>
  </DropdownMenu>
);
