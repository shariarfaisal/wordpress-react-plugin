export function copyTextToClipboard(text, onSuccess) {
  const copyManually = () => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      onSuccess?.();
    } catch (err) {
      console.error("Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      function () {
        onSuccess?.();
      },
      function (err) {
        copyManually();
      }
    );
  } else {
    copyManually();
  }
}
