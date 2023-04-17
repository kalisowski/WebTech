import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

app.get("/", (req, res) => {
  console.log(`${API_BASE_URL}/count`);
  fetch(`${API_BASE_URL}/count`).then(async (response) => {
    if (!response.ok) {
      res.send("Error");
      return;
    }
    const { count } = await response.json();

    res.send(`
			<form method="POST">
				<button type="submit" name="count" value="${count}">${count}</button>
			</form>
		`);
  });
});

app.post(
  "/",
  express.urlencoded({
    extended: true,
  }),
  (req, res) => {
    const count = Number(req.body.count) + 1;
    fetch(`${API_BASE_URL}/count`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count }),
    }).then(async (response) => {
      if (!response.ok) {
        res.send("Error");
        return;
      }
      res.redirect("/");
    });
  }
);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running at port ${server.address().port}`);
});
