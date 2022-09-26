function deleteAllFiles() {
  console.log("[main] Delete all files");
  fetch("http://localhost:5000/files", {method: "DELETE"})
    .then(async (response) => {
      console.log("[main] Files are deleted");
      console.log(response)
      json = await response.json()
      document.getElementById("call-result").innerText = json.message;
    })
    .catch((error) => {
      throw error;
    });
}
