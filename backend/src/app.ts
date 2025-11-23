import express from "express";
import cors from "cors";
import routes from "./routes/linkRoutes";
const app = express();

app.use(cors());
app.use(express.json());


app.get("/healthz",(_req, res)=>{
    res.status(200).json({ok: true,version:"1.0"});
});

app.use('/',routes);


export default app;