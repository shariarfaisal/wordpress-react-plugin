import FeaturedPrompts from "./featured-prompts";

export default function CustomPrompts({ show }) {
  if (!show) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10 mb-10">
      <h2 className="text-xl font-semibold">My Prompt Library</h2>
      <div className="flex flex-col items-center gap-10">
        <img
          src="https://web.tubeonai.com/icons/public-custom-prompts-empty.svg"
          className="w-96"
          alt=""
        />
        <p className="text-lg font-medium text-gray-500">
          You don’t have any prompt yet
        </p>
      </div>

      <FeaturedPrompts />
    </div>
  );
}
