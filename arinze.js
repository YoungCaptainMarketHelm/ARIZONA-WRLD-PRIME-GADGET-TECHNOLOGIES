// ====================== CHANGE YOUR PASSWORD HERE ======================
const PASSWORD = "arizona123";   // ←←← CHANGE THIS TO YOUR OWN SECRET PASSWORD
// =======================================================================

let items = [];

function getNextReceiptNumber() {
  let last = parseInt(localStorage.getItem("lastReceiptNumber")) || 0;
  let nextNum = last + 1;
  localStorage.setItem("lastReceiptNumber", nextNum.toString());
  return "AZG-" + String(nextNum).padStart(5, "0");
}

function renderItems() {
  const tbody = document.getElementById("items-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  let subtotal = 0;

  items.forEach(item => {
    const amount = item.qty * item.price;
    subtotal += amount;
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.name}</td><td>${item.qty}</td><td>₦${amount.toLocaleString('en-NG')}</td>`;
    tbody.appendChild(row);
  });

  const subtotalEl = document.getElementById("subtotal");
  if (subtotalEl) subtotalEl.textContent = `₦${subtotal.toLocaleString('en-NG')}`;

  calculateTotal(subtotal);
}

function calculateTotal(subtotal) {
  const totalEl   = document.getElementById("total");
  const paidEl    = document.getElementById("paid");
  const balanceEl = document.getElementById("balance");
  const discountEl = document.getElementById("discount");

  if (totalEl)   totalEl.textContent   = `₦${subtotal.toLocaleString('en-NG')}`;
  if (paidEl)    paidEl.textContent    = `₦${subtotal.toLocaleString('en-NG')}`;
  if (balanceEl) balanceEl.textContent = `₦0`;
  if (discountEl) discountEl.textContent = `₦0`;
}

function addItemRow() {
  const name = prompt("Enter item name:");
  if (!name) return;
  const price = parseFloat(prompt("Enter price (₦):", "15000")) || 0;
  items.push({ name, qty: 1, price });
  renderItems();
}

function updateReceipt() {
  const customer   = document.getElementById("input-customer")?.value.trim();
  const receiptNo  = document.getElementById("input-receipt")?.value.trim();
  const address    = document.getElementById("input-address")?.value.trim();
  const imei1      = document.getElementById("input-imei1")?.value.trim() || "";
  const imei2      = document.getElementById("input-imei2")?.value.trim() || "";

  if ((!customer || customer === "Walk-in Customer") &&
      (!receiptNo || receiptNo === "AZG-00001") &&
      items.length === 0) {
    alert("Please fill in at least customer name, receipt number or add items before updating.");
    return;
  }

  // Update receipt preview
  if (document.getElementById("customer-name"))
    document.getElementById("customer-name").textContent = customer || "Walk-in Customer";

  if (document.getElementById("receipt-no"))
    document.getElementById("receipt-no").textContent = receiptNo || "AZG-00001";

  if (document.getElementById("shop-address"))
    document.getElementById("shop-address").textContent = address || "YOUR FULL SHOP ADDRESS HERE";

  // Update IMEI
  if (document.getElementById("imei1-display"))
    document.getElementById("imei1-display").textContent = imei1 || "N/A";
  if (document.getElementById("imei2-display"))
    document.getElementById("imei2-display").textContent = imei2 || "N/A";

  // Update date
  const now = new Date();
  if (document.getElementById("date"))
    document.getElementById("date").textContent = now.toLocaleDateString('en-GB');

  renderItems();

  // Success message
  const feedback = document.getElementById("feedback");
  feedback.textContent = "✅ Updated & saved to history!";
  feedback.style.color = "green";
  setTimeout(() => { feedback.textContent = ""; }, 3000);

  saveToHistory();
}

function saveToHistory() {
  const receiptData = {
    id: Date.now(),
    date: document.getElementById("date")?.textContent || new Date().toLocaleDateString('en-GB'),
    receiptNo: document.getElementById("receipt-no")?.textContent || "AZG-???",
    customer: document.getElementById("customer-name")?.textContent || "Unknown",
    address: document.getElementById("shop-address")?.textContent || "",
    imei1: document.getElementById("imei1-display")?.textContent || "N/A",
    imei2: document.getElementById("imei2-display")?.textContent || "N/A",
    items: [...items],
    total: document.getElementById("total")?.textContent || "₦0"
  };

  let history = JSON.parse(localStorage.getItem("receiptHistory")) || [];
  history.push(receiptData);
  localStorage.setItem("receiptHistory", JSON.stringify(history));
}

function printReceipt() {
  window.print();
  setTimeout(clearForm, 800);
}

function clearForm() {
  if (document.getElementById("input-customer"))   document.getElementById("input-customer").value = "";
  if (document.getElementById("input-address"))    document.getElementById("input-address").value = "";
  if (document.getElementById("input-imei1"))      document.getElementById("input-imei1").value = "";
  if (document.getElementById("input-imei2"))      document.getElementById("input-imei2").value = "";

  items = [];
  renderItems();

  if (document.getElementById("customer-name"))    document.getElementById("customer-name").textContent = "Walk-in Customer";
  if (document.getElementById("imei1-display"))    document.getElementById("imei1-display").textContent = "N/A";
  if (document.getElementById("imei2-display"))    document.getElementById("imei2-display").textContent = "N/A";

  // Auto-increment receipt number for next receipt
  if (document.getElementById("input-receipt"))
    document.getElementById("input-receipt").value = getNextReceiptNumber();

  if (document.getElementById("date")) {
    const now = new Date();
    document.getElementById("date").textContent = now.toLocaleDateString('en-GB');
  }
}

function checkPassword() {
  const input = document.getElementById("password-input").value.trim();
  const errorEl = document.getElementById("password-error");

  if (input === PASSWORD) {
    document.getElementById("password-modal").style.display = "none";
    unlockApp();
  } else {
    errorEl.textContent = "❌ Wrong password! Try again.";
    setTimeout(() => { errorEl.textContent = ""; }, 2500);
  }
}

function unlockApp() {
  document.getElementById("main-header").style.display = "block";   // Show buttons

  const now = new Date();
  if (document.getElementById("date"))
    document.getElementById("date").textContent = now.toLocaleDateString('en-GB');

  if (document.getElementById("input-receipt"))
    document.getElementById("input-receipt").value = getNextReceiptNumber();

  if (document.getElementById("imei1-display")) document.getElementById("imei1-display").textContent = "N/A";
  if (document.getElementById("imei2-display")) document.getElementById("imei2-display").textContent = "N/A";

  renderItems();
}

window.onload = function() {
  // Show password modal immediately
  document.getElementById("password-modal").style.display = "flex";
};
