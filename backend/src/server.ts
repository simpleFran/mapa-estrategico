import app from "./app";
import "./config/json-serializer";
const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
