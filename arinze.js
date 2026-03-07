let items = [];

function renderItems() {
  const tbody = document.getElementById("items-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  let subtotal = 0;

  items.forEach(item => {
    const amount = item.qty * item.price;
    subtotal += amount;
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.name}</td><td>${item.qty}</td><td>₦${amount.toLocaleString()}</td>`;
    tbody.appendChild(row);
  });

  const subtotalEl = document.getElementById("subtotal");
  if (subtotalEl) subtotalEl.textContent = `₦${subtotal.toLocaleString()}`;

  calculateTotal(subtotal);
}

function calculateTotal(subtotal) {
  const totalEl   = document.getElementById("total");
  const paidEl    = document.getElementById("paid");
  const balanceEl = document.getElementById("balance");
  const discountEl = document.getElementById("discount");

  if (totalEl)   totalEl.textContent   = `₦${subtotal.toLocaleString()}`;
  if (paidEl)    paidEl.textContent    = `₦${subtotal.toLocaleString()}`;
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
  // Only save if there is meaningful content
  const customer = document.getElementById("input-customer")?.value.trim();
  const receiptNo = document.getElementById("input-receipt")?.value.trim();
  const address = document.getElementById("input-address")?.value.trim();

  if ((!customer || customer === "Walk-in Customer") &&
      (!receiptNo || receiptNo === "AZG-00001") &&
      items.length === 0) {
    alert("Please fill in at least customer name, receipt number or add items before updating.");
    return;
  }

  // Update displayed values
  if (document.getElementById("customer-name"))
    document.getElementById("customer-name").textContent = customer || "Walk-in Customer";

  if (document.getElementById("receipt-no"))
    document.getElementById("receipt-no").textContent = receiptNo || "AZG-00001";

  if (document.getElementById("shop-address"))
    document.getElementById("shop-address").textContent = address || "YOUR FULL SHOP ADDRESS HERE";

  const now = new Date();
  if (document.getElementById("date"))
    document.getElementById("date").textContent = now.toLocaleDateString('en-GB');

  renderItems();

  // Success message
  const feedback = document.getElementById("feedback") || document.createElement("div");
  feedback.textContent = "✅ Updated & saved to history!";
  feedback.style.color = "green";
  feedback.style.fontWeight = "bold";
  feedback.style.marginTop = "10px";
  feedback.style.textAlign = "center";

  const form = document.querySelector(".form");
  if (form && !document.getElementById("feedback")) {
    feedback.id = "feedback";
    form.appendChild(feedback);
  }

  setTimeout(() => { feedback.textContent = ""; }, 3000);

  // Save only after real update
  saveToHistory();
}

function saveToHistory() {
  const receiptData = {
    id: Date.now(),
    date: document.getElementById("date")?.textContent || new Date().toLocaleDateString('en-GB'),
    receiptNo: document.getElementById("receipt-no")?.textContent || "AZG-???",
    customer: document.getElementById("customer-name")?.textContent || "Unknown",
    address: document.getElementById("shop-address")?.textContent || "",
    items: [...items],
    total: document.getElementById("total")?.textContent || "₦0"
  };

  let history = JSON.parse(localStorage.getItem("receiptHistory")) || [];
  history.push(receiptData);
  localStorage.setItem("receiptHistory", JSON.stringify(history));
}

function printReceipt() {
  window.print();

  // Clear form after print
  setTimeout(clearForm, 800);
}

function clearForm() {
  if (document.getElementById("input-customer"))   document.getElementById("input-customer").value = "";
  if (document.getElementById("input-receipt"))    document.getElementById("input-receipt").value = "AZG-" + Date.now().toString().slice(-6);
  if (document.getElementById("input-address"))    document.getElementById("input-address").value = "";

  items = [];
  renderItems();

  if (document.getElementById("customer-name"))    document.getElementById("customer-name").textContent = "Walk-in Customer";
  if (document.getElementById("receipt-no"))       document.getElementById("receipt-no").textContent = document.getElementById("input-receipt")?.value || "AZG-00001";
  if (document.getElementById("date")) {
    const now = new Date();
    document.getElementById("date").textContent = now.toLocaleDateString('en-GB');
  }
}

window.onload = function() {
  const now = new Date();
  if (document.getElementById("date"))
    document.getElementById("date").textContent = now.toLocaleDateString('en-GB');

  if (document.getElementById("input-receipt"))
    document.getElementById("input-receipt").value = "AZG-" + Date.now().toString().slice(-6);

  renderItems();
};