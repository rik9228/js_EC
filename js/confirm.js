(() => {
  const ITEMS = JSON.parse(localStorage.getItem("items")); //ローカルストレージの商品データの配列
  const $itemList = document.getElementById("confirm__listFrame"); //カートの商品を追加する要素
  const $confirmPrice = document.getElementById("confirm__price"); //カートの商品を追加する要素
  const fragment = document.createDocumentFragment(); //DOMの追加処理用のフラグメント
  const $prevTop = document.getElementById("prevTop"); //DOMの追加処理用のフラグメント

  let saveItems = [];
  let sumPrice = 0;

  if (ITEMS === null) {
    return;
  }

  //データ保存用の配列に商品データを追加
  for (let i = 0; i < ITEMS.length; i++) {
    saveItems.push(ITEMS[i]);
  }

  for (let i = 0; i < ITEMS.length; i++) {
    const tItemName = ITEMS[i].name;
    const tItemPrice = ITEMS[i].price;

    const $li = document.createElement("li");
    const $span = document.createElement("span");
    $li.classList.add("confirm__listItem");
    $span.classList.add("confirm__listItem--price");

    $li.textContent = tItemName;
    $span.textContent = `¥${tItemPrice}`;

    $li.appendChild($span);
    // 一旦fragmentに格納する
    fragment.appendChild($li);

    // 合計金額の算出
    sumPrice = sumPrice + tItemPrice;
  }

  $itemList.append(fragment);
  // 合計金額の出力
  $confirmPrice.textContent = `¥${sumPrice}`;

  $prevTop.addEventListener("click", () => {
    localStorage.setItem("items", JSON.stringify(saveItems));
  });
})();
