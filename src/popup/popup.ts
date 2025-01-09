document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("refresh") as HTMLButtonElement;
  button.addEventListener("click", () => {
    console.log("Refresh button clicked!");
  });
});
