import { SignInButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default async function Home() {
  return (
    <div>
      <h1 className="text-xl font-bold">RepoMemo</h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quam
        quaerat alias libero, corrupti magni id consequuntur, omnis laborum
        facilis neque ratione, nostrum at perspiciatis temporibus minus
        doloribus maiores ab.
      </p>
      <SignInButton />
    </div>
  );
}
