import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";

const GithubSignIn = () => {
  return (
    <Button type="button" variant="outline" className="h-11">
      <FaGithub className="size-4" />
      Continue with GitHub
    </Button>
  );
};

export default GithubSignIn;
