(function () {
  "use strict";
  const form = document.getElementById("kh-subscribe-form");
  if (!form) return;
  const input = document.getElementById("kh-coupon-code");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const coupon = input.value.trim().toUpperCase();
    const subject = "Hooked416 Know-How subscription purchase";
    const body = [
      "Hello Hooked416,",
      "",
      "I would like to purchase a Know-How subscription with the 3-day free trial.",
      "Coupon code: " + (coupon || "None"),
      "",
      "Please confirm purchase arrangements, any eligible first-month discount, and account activation."
    ].join("\r\n");
    window.location.href = "mailto:info@hooked416.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
