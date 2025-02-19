// Define API URL and endpoint as global variables
const FASTAPI_BASE_URL = "https://fastapi-backend-small-138353761392.europe-west3.run.app";
const PREDICTION_ENDPOINT = "predict";
const FASTAPI_PREDICTION_URL = `${FASTAPI_BASE_URL}/${PREDICTION_ENDPOINT}/`;


// Wait until the entire HTML document (DOM) is fully loaded before executing any script
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");  // Log a message to the console when the page is ready

  // Define an asynchronous function to analyze sentiment using a backend API
  async function analyzeSentiment() {
    // Retrieve the user input text from the input field with ID "userInput"
    let text = document.getElementById("userInput").value;

    // Ensure the text is not empty before sending the request
    if (!text.trim()) {
      document.getElementById("result").innerText = "Please enter some text.";
      return;
    }

    // The backend API expects a JSON object that follows this structure:
    // {
    //   "text": "User input goes here"
    // }
    //
    // This is because the FastAPI backend has a Pydantic model like this:
    // 
    // class InputText(BaseModel):
    //     text: str
    //
    // Therefore, we must send a JSON object where the key is "text" and the value is the user input.

    // Send a POST request to the FastAPI sentiment analysis API


    // let response = await fetch("https://fastapi-backend-small-138353761392.europe-west3.run.app/predict/", {  
    let response = await fetch(FASTAPI_PREDICTION_URL, {
        // NOTE: Replace this URL with your actual FastAPI deployment URL if necessary.

        method: "POST",  // The API expects a POST request
        headers: { "Content-Type": "application/json" },  // Inform the server we are sending JSON data
        body: JSON.stringify({ text: text })  // Convert the user input into a JSON string
        // `JSON.stringify({ text })` is a shorthand for `JSON.stringify({ text: text })`
        // This ensures the request body matches the expected structure in FastAPI.
    });

    // Check if the API request was successful 
    if (!response.ok) {
      // If the request fails (e.g., network issue and/or server error), display an error message
      document.getElementById("result").innerText = "Error: Unable to fetch data";
      return;  // Stop execution
    }

    // Parse the API response as JSON
    let data = await response.json();

    // The API returns a response in the following format:
    // [
    //   { "label": "positive", "score": 0.98 }
    // ]
    // We extract the label and confidence score to display it to the user.

    // Display the sentiment prediction and confidence score in the "result" element
    document.getElementById("result").innerText = 
        `Prediction: ${data[0].label} (Confidence: ${data[0].score.toFixed(2)})`;
        //this format i.e. .label ans .score, is something you set in the backend = main.py
        // Also main.py returns a list, but only one item is inside of it, so you need to index it out with [0]
        // .toFixed(2) ensures the confidence score is displayed with 2 decimal places (e.g., 0.98 instead of 0.984567)
  }

  // Attach an event listener to the button with ID "analyzeButton"
  // When clicked, it will trigger the analyzeSentiment function
  document.getElementById("analyzeButton").addEventListener("click", analyzeSentiment);

});
