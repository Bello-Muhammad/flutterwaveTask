const express = require('express')

const app = express()
const port = process.env.PORT 

app.use(express.json())

app.post("/split-payments/compute", (req, res) => {
    const {ID, Amount, Currency, CustomerEmail, SplitInfo} = req.body
    let comp = Amount
    let flat = []
    let percent = []
    let ratio = []
    let all
    let total = 0;

    for(let i = 0; i < SplitInfo.length; i++ ){


        if(SplitInfo[i].SplitType === 'FLAT'){
            
            flat.push(SplitInfo[i])

        }else if(SplitInfo[i].SplitType === 'PERCENTAGE'){
           
           percent.push(SplitInfo[i])
                       
        }else if (SplitInfo[i].SplitType === 'RATIO'){

           ratio.push(SplitInfo[i])
            
        }
        
    }

    
    // console.log(percent)
    // console.log(ratio)

    //looping for flat
    for(let i = 0; i<flat.length; i++){

        let newFlat = flat[i]

        comp = comp - newFlat.SplitValue
            
            let Flat = {
                SplitEntityId: newFlat.SplitEntityId,
                Amount: newFlat.SplitValue
            }

            flat[i] = Flat

    }


    //looping for percentage
    for(let i = 0; i<percent.length; i++){

        let newPercent = percent[i]

        let cent

        cent = ((newPercent.SplitValue/100) * comp)
        comp = comp - cent

        let Percent = {
             SplitEntityId: newPercent.SplitEntityId,
             Amount: cent
        }

        percent[i] = Percent

    }

    //looping for ratio total
    for(let i = 0; i<ratio.length; i++){

        let newRatio = ratio[i]

        total = total + newRatio.SplitValue

    }

    //looping for ratio
    for(let i = 0; i<ratio.length; i++){

        let newRatio = ratio[i]

        rat = (newRatio.SplitValue/total) * comp

        comp = comp - rat

        let Ratio = {
            SplitEntityId: newRatio.SplitEntityId,
            Amount: rat
        }

        ratio[i] = Ratio
        
    }

    // looping for all the result
    for(let i=0; i<1; i++){
        all = flat

        for(let i=0; i<percent.length; i++){
            all.push(percent[i])
        }

        for(let i=0; i<ratio.length; i++){
            all.push(ratio[i])
        }
    }
    console.log(all)
    console.log(comp)

    let result = {
        ID,
        Balance: comp,
        SplitBreakdown: all
    }

    res.status(200).send(result)

})

app.listen(port, () => {
    console.log('server on port' +port)
})