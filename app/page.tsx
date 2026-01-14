import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>BATMAN</h2>
      <Button variant="default">Get Started</Button>
      <UserButton />
    </div>
  
  );
}
