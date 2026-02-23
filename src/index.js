import app from "./app.js";
import * as env from "./config/env.config.js";

app.listen(env.PORT, () => {
  console.log(`server is running on http://localhost:${env.PORT}`);
});
export default app;
