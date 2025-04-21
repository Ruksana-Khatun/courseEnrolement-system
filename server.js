import app from "./app.js";
import  connectionToDB  from "./config/dbConection.js";
const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
    await connectionToDB();
    console.log("Connected to MongoDB");
    console.log(`Server is listening on port ${PORT}`);
});
