import FeaturedPrompts from "./featured-prompts";
import { SignInContent } from "./limit-modal";

export default function CustomPrompts({ show }) {
  if (!show) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10 mb-10">
      <SignInContent />
      <FeaturedPrompts />
    </div>
  );
}
