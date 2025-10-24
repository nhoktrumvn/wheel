(() => {
  const $ = document.querySelector.bind(document);

  let timeRotate = 7000; //7 giây
  let currentRotate = 0;
  let isRotating = false;
  const wheel = $(".wheel");
  const btnWheel = $(".btn--wheel");
  const btnFakeWheel = $(".btn--fake-wheel");
  const showMsg = $(".msg");

  // Track picked items - resets only when page is refreshed
  let pickedIndices = [];
  const listElements = [];

  //=====< Danh sách phần thưởng >=====
  const listGift = [
    { text: "2", percent: 1 / 21 },
    { text: "4", percent: 1 / 21 },
    { text: "8", percent: 1 / 21 },
    { text: "10", percent: 1 / 21 },
    { text: "11", percent: 1 / 21 },
    { text: "13", percent: 1 / 21 },
    { text: "14", percent: 1 / 21 },
    { text: "15", percent: 0 / 21 },
    { text: "29", percent: 1 / 21 },
    { text: "30", percent: 1 / 21 },
    { text: "31", percent: 1 / 21 },
    { text: "32", percent: 1 / 21 },
    { text: "35", percent: 1 / 21 },
    { text: "36", percent: 1 / 21 },
    { text: "40", percent: 1 / 21 },
    { text: "41", percent: 1 / 21 },
    { text: "42", percent: 1 / 21 },
    { text: "44", percent: 1 / 21 },
    { text: "45", percent: 1 / 21 },
    { text: "46", percent: 1 / 21 },
    { text: "47", percent: 1 / 21 },
  ];

  //=====< Số lượng phần thưởng >=====
  const size = listGift.length;
  const rotate = 360 / size;
  const skewY = 90 - rotate;

  listGift.map((item, index) => {
    const elm = document.createElement("li");
    elm.style.transform = `rotate(${rotate * index}deg) skewY(-${skewY}deg)`;
    elm.innerHTML = `
      <p style="transform: skewY(${skewY}deg) rotate(${rotate / 2}deg);" class="text ${
      index % 2 == 0 ? "text-1" : "text-2"
    }">
        <b>${item.text}</b>
      </p>`;
    wheel.appendChild(elm);
    listElements.push(elm);
  });

  const markAsPicked = (index) => {
    if (!pickedIndices.includes(index)) {
      pickedIndices.push(index);
    }
    const element = listElements[index];
    if (element) {
      element.style.opacity = '0.4';
      element.style.filter = 'grayscale(70%)';
    }
  };

  const getAvailableGifts = () => {
    return listGift
      .map((item, index) => ({ ...item, index }))
      .filter((item) => !pickedIndices.includes(item.index) && item.percent > 0);
  };

  const start = () => {
    const availableGifts = getAvailableGifts();
    
    if (availableGifts.length === 0) {
      showMsg.innerHTML = "Tất cả các phần thưởng đã được chọn! Vui lòng làm mới trang.";
      return;
    }

    showMsg.innerHTML = "";
    isRotating = true;
    const random = Math.random();
    const gift = getGift(random);
    
    if (!gift) {
      showMsg.innerHTML = "Lỗi: Không thể chọn phần thưởng!";
      isRotating = false;
      return;
    }

    currentRotate += 360 * 10;
    rotateWheel(currentRotate, gift.index);
    showGift(gift);
  };

  const startFake = () => {
    const availableGifts = getAvailableGifts();
    
    if (availableGifts.length === 0) {
      showMsg.innerHTML = "Tất cả các phần thưởng đã được chọn! Vui lòng làm mới trang.";
      return;
    }

    // Check if index 7 is still available
    if (pickedIndices.includes(7)) {
      showMsg.innerHTML = "Phần thưởng này đã được chọn rồi!";
      return;
    }

    showMsg.innerHTML = "";
    isRotating = true;
    const fakeIndex = 7; // Chỉ định phần thưởng cố định (T key)
    currentRotate += 360 * 10;
    rotateWheel(currentRotate, fakeIndex);
    showGift({ ...listGift[fakeIndex], index: fakeIndex });
  };

  const startFake2 = () => {
    const availableGifts = getAvailableGifts();
    
    if (availableGifts.length === 0) {
      showMsg.innerHTML = "Tất cả các phần thưởng đã được chọn! Vui lòng làm mới trang.";
      return;
    }

    // Check if index 12 is still available
    if (pickedIndices.includes(12)) {
      showMsg.innerHTML = "Phần thưởng này đã được chọn rồi!";
      return;
    }

    showMsg.innerHTML = "";
    isRotating = true;
    const fakeIndex = 12; // Chỉ định phần thưởng cố định (Y key)
    currentRotate += 360 * 10;
    rotateWheel(currentRotate, fakeIndex);
    showGift({ ...listGift[fakeIndex], index: fakeIndex });
  };

  const rotateWheel = (currentRotate, index) => {
    $(".wheel").style.transform = `rotate(${currentRotate - index * rotate - rotate / 2}deg)`;
  };

  const getGift = (randomNumber) => {
    const availableGifts = getAvailableGifts();
    
    if (availableGifts.length === 0) {
      return null;
    }

    const totalPercent = availableGifts.reduce((sum, item) => sum + item.percent, 0);
    
    let currentPercent = 0;
    let list = [];
    
    availableGifts.forEach((item) => {
      const normalizedPercent = item.percent / totalPercent;
      currentPercent += normalizedPercent;
      if (randomNumber <= currentPercent) {
        list.push(item);
      }
    });
    
    return list[0] || availableGifts[0];
  };

  const showGift = (gift) => {
    setTimeout(() => {
      isRotating = false;
      markAsPicked(gift.index);
      
      const remainingCount = getAvailableGifts().length;
      showMsg.innerHTML = `Chúc mừng bạn đã nhận được "${gift.text}" `;
      
      if (remainingCount === 0) {
        setTimeout(() => {
          showMsg.innerHTML = "🎉 Tất cả đã được chọn! Làm mới trang để bắt đầu lại.";
        }, 2000);
      }
    }, timeRotate);
  };

  btnWheel.addEventListener("click", () => {
    !isRotating && start();
  });

  btnFakeWheel.addEventListener("click", () => {
    !isRotating && startFake();
  });

  // Keyboard shortcut: Press "T" to trigger fake spin (index 7)
  document.addEventListener("keydown", (event) => {
    if (event.key === "t" || event.key === "T") {
      if (!isRotating) {
        startFake();
      }
    }
    // Press "Y" to trigger fake spin (index 12)
    if (event.key === "y" || event.key === "Y") {
      if (!isRotating) {
        startFake2();
      }
    }
  });

  // Thêm JavaScript để thay đổi màu sắc cho dòng chữ
  const changingText = document.getElementById('changing-text');
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  let currentColorIndex = 0;

  function changeColor() {
    changingText.style.color = colors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colors.length;
  }

  // Đổi màu liên tục mỗi 1 giây
  setInterval(changeColor, 500);
})();
