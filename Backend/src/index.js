import connectToDB from "./db/index.js";
import app from "./app.js";
connectToDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server listening at port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    throw error;
  });
