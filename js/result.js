const $toTop = document.getElementById("toTop");

$toTop.addEventListener("click", () => {
  // ローカルストレージの削除
  localStorage.clear();
});
