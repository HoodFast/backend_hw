import {app} from "./settings";


const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`App start on port ${port}`)
})