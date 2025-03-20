document.getElementById("searchBtn").addEventListener("click", async function () {
    let tabletName = document.getElementById("tabletName").value.trim();
    if (!tabletName) {
        alert("Please enter a tablet name.");
        return;
    }

    document.getElementById("result").innerHTML = "Fetching data... ";

    try {
        let [apiData, aiData, googleResults] = await Promise.all([
            fetchMedicineInfo(tabletName),
            fetchAIInfo(tabletName),
            fetchGoogleResults(tabletName)
        ]);

        
        document.getElementById("result").innerHTML = `
        <h3><i class="fa fa-pills"></i> ${tabletName}</h3>
        <strong><i class="fa fa-check-circle"></i> Uses:</strong> ${apiData.uses} <br><br><hr><br><br>
        <strong><i class="fa fa-exclamation-triangle"></i> Side Effects:</strong> ${apiData.sideEffects} <br><br><hr><br><br>
    `;
    
    } catch (error) {
        document.getElementById("result").innerHTML = " Error fetching data.";
        console.error("Fetch error:", error);
    }
});

async function fetchMedicineInfo(drugName) {
    try {
        let response = await fetch(`https://api.fda.gov/drug/label.json?search=${drugName}&limit=1`);
        let data = await response.json();

        if (data.results && data.results.length > 0) {
            let drug = data.results[0];
            return {
                uses: drug.purpose ? drug.purpose.join(", ") : "Not available",
                sideEffects: drug.warnings ? drug.warnings.join(", ") : "Not available"
            };
        }
    } catch (error) {
        console.error("OpenFDA API error:", error);
    }
    return { uses: "No data found.", sideEffects: "No data found." };
}

async function fetchAIInfo(query) {
    try {
        const apiKey = "AIzaSyAdh47OCF576RPUExarRT9qgmK5KdMWsK4"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        let response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Provide a detailed medical summary of ${query}, including uses, side effects, advantages, disadvantages, and agegroup.` }] }]
            })
        });

        let data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        }
    } catch (error) {
        console.error("Gemini API error:", error);
    }
    return "No AI summary available.";
}

// Function to fetch related Google Search results
async function fetchGoogleResults(query) {
    try {
        const apiKey = "AIzaSyAdh47OCF576RPUExarRT9qgmK5KdMWsK4";  // Replace with your actual Google API key
        const cx = "YOUR_CX";  // Replace with your Custom Search Engine ID
        let response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}`);
        let data = await response.json();

        if (data.items) {
            return data.items.map(item => `<a href="${item.link}" target="_blank">${item.title}</a>`).join("<br>");
        }
    } catch (error) {
        console.error("Google Search API error:", error);
    }
    return "No Google results found.";
}
