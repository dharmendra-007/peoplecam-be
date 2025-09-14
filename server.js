import app from "./src/index.js";

const PORT = process.env.PORT || 8000

app.listen(PORT , () => {
    console.log(`App is listening at PORT : ${PORT}`)
})