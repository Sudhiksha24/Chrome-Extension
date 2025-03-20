chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "displayMedicineInfo") {
        alert(`Medicine Info: ${message.data}`);
    }
});
