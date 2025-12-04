import app from "./src/app.js"; 

const PORT = process.env.PORT || 8888; 

// app.js is the express configuration but this is where the app actally starts, its better for seperation of concerns. 

app.listen(PORT, () => {
    console.log("password manager API server started on port " + PORT); 
})