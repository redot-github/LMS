const mongoose=require('mongoose')

const schema=mongoose.Schema;

const useschema= new schema({
        batchtype:{
            type:  String,
            required:true
        },
        batchIntime:{
            type: String,
            required:true
        },
        batchOuttime:{
            type: String,
            required:true
        },
        coursecode:{
            type: [String],
            required:true
        },
})

module.exports=mongoose.model('Batch',useschema)