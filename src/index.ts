import {app} from "./settings";


const port = process.env.PORT || 80

app.listen(port,()=>{
    console.log(`App start on port ${port}`)
})