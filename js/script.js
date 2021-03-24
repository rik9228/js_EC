"use strict";

(() => {
  const $resetButton = document.querySelector(".nav-bottom__link--reset");
  const $confirm = document.querySelectorAll(".confirm");
  const $buyButton = document.querySelectorAll(".shop__button");
  const $delButton = document.querySelectorAll(".shop__button--delete");
  const $select = document.querySelector(".shop__select");
  const $bottomPrice = document.querySelector(".nav-bottom__sum");
  const $bottomQuant = document.querySelector(".nav-bottom__quantity");
  const ITEMS = JSON.parse(localStorage.getItem("items")); //ローカルストレージの商品データ配列

  let sumPrice = 0;
  let sumQuant = 0;
  const items = [];
  let saveItems = [];
  let clicked = [];

  // ローカルストレージの有無確認
  if (ITEMS !== null) {
    // ローカルストレージにデータが入っている場合
    $buyButton.forEach((bButton, index) => {
      for (let i = 0; i < ITEMS.length; i++) {
        if (ITEMS[i].id === index) {
          clicked.push(ITEMS[i].id);
          saveItems.push(ITEMS[i]);
          $buyButton[index].classList.add("js-active");
          $buyButton[index].disabled = true;
          sumPrice = sumPrice + Number(bButton.dataset.price);
          $bottomPrice.textContent = `¥${sumPrice}`;
        }
      }
    });
    // 購入点数の表示
    sumQuant = ITEMS.length;
    $bottomQuant.textContent = `${ITEMS.length}点`;
  }

  $buyButton.forEach((bButton, index) => {
    //  カテゴリー調べる時に使用。商品内容DOMを配列の中にに格納する
    items.push(bButton);

    // 購入ボタンを押したとき
    bButton.addEventListener("click", (e) => {
      e.preventDefault();
      const tNext = bButton.nextElementSibling;
      const tItemIndex = Number(e.target.dataset.num);
      const tItemPrice = Number(e.target.dataset.price);
      const tItemName = e.target.dataset.name;

      tNext.disabled = false;

      //データ保存用の配列に商品データを追加
      saveItems.push({
        id: tItemIndex,
        name: tItemName,
        price: tItemPrice,
      });

      clicked.push(tItemIndex);

      bButton.disabled = true;
      bButton.classList.add("js-active");

      incCount(tItemPrice);

      localStorage.setItem("items", JSON.stringify(saveItems));
    });
  });

  $delButton.forEach((dButton, index) => {
    if (dButton.previousElementSibling.disabled) {
      dButton.disabled = false;
    } else {
      dButton.disabled = true;
    }

    dButton.addEventListener("click", (e) => {
      const $prevButton = dButton.previousElementSibling;
      const eNum = Number(e.target.previousElementSibling.dataset.num);
      const ePrice = Number(e.target.previousElementSibling.dataset.price);

      decCount(ePrice);

      dButton.disabled = true;

      if ($prevButton.disabled) {
        $prevButton.disabled = false;
        $prevButton.classList.remove("js-active");
      }

      // //クリック管理用の配列から対象のボタンのindexを削除
      for (let i = 0; i < clicked.length; i++) {
        if (clicked[i] === eNum) {
          // 対象の要素のi番がspliceの第１引数として使用される。
          // 例：[1,2]
          // 1(clicked[i]) === 1(eNum)
          // i → 0;
          // clicked.splice(0,1);
          // savaItems.splice(0,1);

          clicked.splice(i, 1);
          saveItems.splice(i, 1);
        }
      }
      localStorage.setItem("items", JSON.stringify(saveItems));
    });
  });

  // セレクトボックスの値を変えたとき
  $select.addEventListener("change", (e) => {
    sortItem(e);
  });

  // リセットボタンの処理
  $resetButton.addEventListener("click", (e) => {
    resetItem(e);
  });

  // カートボタンもしくは確認ボタンを押したとき

  for (let i = 0; i < $confirm.length; i++) {
    $confirm[i].addEventListener("click", (e) => {
      if (saveItems.length === 0) {
        e.preventDefault();
        alert("カートに商品がありません");
      }
    });
  }

  // 購入情報の書き換え
  const updateStatus = (price, quant) => {
    $bottomPrice.textContent = `¥${price}`;
    $bottomQuant.textContent = `${quant}点`;
  };

  // 購入点数の増加処理
  const incCount = (price) => {
    sumQuant++;
    sumPrice = sumPrice + price;

    updateStatus(sumPrice, sumQuant);
  };

  // 購入点数の減少処理
  const decCount = (price) => {
    if (sumQuant === 0 || sumPrice < 0) {
      price = 0;
      sumQuant = 0;
      return;
    }

    sumQuant--;
    sumPrice = sumPrice - price;
    updateStatus(sumPrice, sumQuant);
  };

  // アイテムの並べ替え
  const sortItem = (value) => {
    for (let i = 0; i < $buyButton.length; i++) {
      const sValue = $select.value;
      if (sValue !== items[i].dataset.category) {
        // 選択値と一致しない商品にアクティブクラスを付与する
        items[i].parentNode.classList.add("js-hidden");
      } else {
        items[i].parentNode.classList.remove("js-hidden");
      }

      // 全ての商品を表示
      if (sValue === "all") {
        items[i].parentNode.classList.remove("js-hidden");
      }
    }
  };

  // アイテムをリセットさせる関数
  const resetItem = (e) => {
    e.preventDefault();
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("js-active");
    }

    sumPrice = 0;
    sumQuant = 0;
    updateStatus(sumPrice, sumQuant);

    saveItems.length = 0;
    localStorage.clear();

    $buyButton.forEach((elem) => {
      elem.disabled = false;
    });
  };
})();
