chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "fetchMedicineInfo") {
        try {
            const apiKey = "AIzaSyAdh47OCF576RPUExarRT9qgmK5KdMWsK4";  
            const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyAdh47OCF576RPUExarRT9qgmK5KdMWsK4`;

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: "You are a helpful AI providing medicine details." },
                        { role: "user", content: `Tell me about the medicine ${message.medicineName}` }
                    ]
                })
            });

            const data = await response.json();
            sendResponse({ success: true, result: data.choices[0].message.content });

        } catch (error) {
            console.error("Error fetching medicine data:", error);
            sendResponse({ success: false, error: "Failed to fetch medicine details." });
        }
    }
    return true; 
});
