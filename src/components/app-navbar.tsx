import * as React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuButton,
} from "@/components/ui/navbar";

export function AppNavbar({ ...props }: React.ComponentProps<typeof Navbar>) {
  return (
    <Navbar {...props}>
      <NavbarBrand>
        <a href="/">ESTIAM Project</a>
      </NavbarBrand>
      <NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem>
            <NavbarMenuButton asChild>
              <a href="/">Home</a>
            </NavbarMenuButton>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NavbarMenuButton asChild>
              <a href="/users">Users</a>
            </NavbarMenuButton>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NavbarMenuButton asChild>
              <a href="/login">Login</a>
            </NavbarMenuButton>
          </NavbarMenuItem>
        </NavbarMenu>
      </NavbarContent>
    </Navbar>
  );
}
