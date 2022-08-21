import { signOut } from "next-auth/react";
import * as React from "react";

// bootstrap
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";

export interface IUserDropdownMenuProps {
  user: string | null | undefined;
  image: string | null | undefined;
}

export default function UserDropdownMenu({
  user,
  image,
}: IUserDropdownMenuProps) {
  image = image ?? "";

  return (
    <Dropdown>
      <Dropdown.Toggle id="userDropdown" className="bg-blue-4 my-5 flex">
        <Image
          src={image}
          alt="user profile picture"
          thumbnail={false}
          className="w-8 mr-2"
        />
        {user}
      </Dropdown.Toggle>
      <Dropdown.Menu id="userDropdown" className="bg-blue-3">
        <Dropdown.Item onClick={() => signOut()}>Sign Out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
