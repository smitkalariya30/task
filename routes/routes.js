const express = require('express')
const router = express.Router();
const AddMovieValidation = require('../middleware/validationmiddleware');
const UpdateMovieValidation = require('../middleware/validationmiddleware');
const md = require('../models/model')

router.get('/getmovies', async(req,res) => {
   
    let smethod = "-"
    if(Number(req.query.sort) === 1)
    {
        smethod = ""        
    }

   try{
        if(!req.query.sortedby){
            req.query.sortedby = "updatedAt"
        }
        else{
            if(req.query.sortedby != "createdAt")
            {
                res.status(200).json("need to pass proper query string")
            }
             
        }
        console.log(" "+smethod+req.query.sortedby)
        const data = await md.find().sort(""+smethod+req.query.sortedby)

        res.json(data) 
    }
    catch(err)
    {
        res.send('error '+err)
    }
})

router.post('/addmovies',async(req,res) => {

    try{AddMovieValidation.validate(req.body)}
    catch(error){
        console.log(error)
    }
    
    const {title, description, is_released} = req.body;
    const data = new md({
        title: title,
        description: description,
        is_released: is_released
    })

    try{
       const d1 = await data.save()
       res.json(d1)
    }catch(err){
       console.log(err)
    }
})

router.get('/find/:id',async (req,res) => {
    
    try{
        const data = await md.findById(req.params.id)
        res.json(data)
    }catch(err){
        console.log(err)
    }
})

router.put('/updatemovies/:id',async (req,res) => {
   
    try{
        let data1 = await md.findById(req.params.id);

        if(!data1){
            return res.json({message:"id does not exist",success:false})
        }
        else{
            res.json(data1)
            const update = {};

            if(req.body.title){update.title = req.body.title}
            if(req.body.description){update.description = req.body.description}
            if(req.body.is_released){update.is_released = req.body.is_released}

            const status = UpdateMovieValidation.validate(update)

            if(status)
            {
                console.log("changes made")
                await md.findByIdAndUpdate({_id : req.params.id},{
                    $set : update
                })
               console.log(update)
            }
            else{
                console.log("changes not made")
            }
        
        }
    }
    catch(error)
    {

    }
    
})

router.delete('/deletemovie/:id',async(req,res) => {

    try{
        let data1 = await md.findById(req.params.id);

        if(!data1){
            return res.json({message:"id does not exist",success:false})
        }
     md.deleteOne({_id:req.params.id}).then((result) => {
        res.status(200).json(result)
     }).catch((err) => {console.log(err)}) 
    
    }
    catch(err)
    {
        res.json(err)
    }
})

module.exports = router