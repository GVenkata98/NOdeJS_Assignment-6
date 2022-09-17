const router = require('express').Router();
const Blog = require('../models/Blog')

// Your routing code goes here


router.get('/allblogs', async (req,res)=>{
    try{
        const data = await Blog.find();
        res.json(data)
    } catch(err){
        message : err.message
    }
})

// Fetching Blogs 
router.get('/blog', async (req ,res) =>{
    try{
        const {page , topic} = req.query;
        if(topic == null){
            return res.json({
                status:"Failed", 
                message: "Search topic is empty."
            })
        }else if(page <=0){
            return res.json({
                status:"Failed", 
                message: "Invalid page Number."
            })
        }else{
            const jump = (page-1)*5;
            const totalBlogs = await Blog.find({topic: topic}); 
            if(totalBlogs.length == 0){
                return res.json({
                    status:"Failed", 
                    message: "Search topic Doesn`t exist."
                })
            }
            else if(page > Math.ceil(totalBlogs.length/5)) {
                return res.json({
                    status:"Failed",
                    message:"The "+ topic+ " Containes only "+ totalBlogs.length +" number of Blogs , enter less page no."
                })
            }else{
                const requiredBlogs = await Blog.find({topic: topic}).limit(5).skip(jump);
                return res.json({
                    status: "Success",
                    results : requiredBlogs
                })
            }
        }
    
    }catch(err){
        res.json({
            status: "Failed" ,
            message : err.message
        })
    }
})

// Create Blog
router.post('/blog', async (req, res) =>{
    const data = req.body;
    try{
        await Blog.create(data)
        res.json({
            status: "Success" ,
            message: "Blog has been Successfully added."
        })
    }catch(err){
        return res.json({
            status: "Failed to add Blog",
            message: err.message
        })
    }   
})

// Updateing the Blog
router.put('/blog/:id', async (req, res) =>{
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id , req.body)
        if(updatedBlog.length === 0){
            return res.json({
                status: "Failed" , 
                message : "No Blog is Found with the given Id."
            })
        }else{
            return res.json({
                status: "Success" ,
                message : "Blog has been Successfully Updated"
            })
        }
    }catch(err){
        res.json({
            status: "Failed" ,
            message : err.message
        })
    }
})

// Deleting the Blog
router.delete('/blog/:id' , async(req, res) =>{
    try{
        const requiredBlog = await Blog.findById(req.params.id);
        if(requiredBlog == null){
            return res.json({
                status: "Failed" ,
                message: "No Blog is Found with th given Id."
            })
        }
        else{
            await Blog.findByIdAndDelete(req.params.id);
            return res.json({
                status: "Success" ,
                message: "Deleted the Blog Successfully."
            })
        }
    }catch(err){
        return res.json({
            status: "Failed" ,
            message: err.message
        })
    }
})



module.exports = router;